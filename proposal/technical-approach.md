# Approccio Tecnico — Analisi, Remediation e Nuove Funzionalità

**RFP MC-2026-0417 — Meridian Components**

---

## Pre-proposal code review

Prima di scrivere questa proposta, abbiamo esaminato il codice sorgente incluso nel pacchetto RFP. Questo ci ha permesso di stimare ogni requisito sul codice reale, non sulle note di handoff.

Durante questa analisi abbiamo identificato un difetto attivo nel modulo Reports che va oltre i bug documentati nella RFP: la logica di calcolo trimestrale è hardcodata sull'anno 2025, con il risultato che il modulo mostra dati vuoti o incompleti su tutti i periodi 2026. Questo difetto è attivo adesso e spiega parte della frustrazione che il team Operations potrebbe aver riscontrato nell'ultimo periodo.

Questa scoperta conferma il valore di un audit approfondito come primo passo — e ci ha permesso di stimare R1 con maggiore precisione rispetto a una proposta basata solo sulle note di handoff del vendor precedente.

### Una nota sulle stime

Le stime riportate per ogni requisito sono giorni-uomo di sviluppo netto. La durata complessiva dell'engagement è maggiore perché il calendario include review con il team Operations e IT, sessioni di acceptance, hardening, e un buffer per imprevisti. Il dettaglio del calendario completo è in `timeline.md`.

---

## R1 — Reports module remediation

Abbiamo identificato 9 difetti nel modulo Reports, raggruppati qui per categoria.

### Architettura e pattern API

| # | File | Problema | Severity |
|---|------|----------|----------|
| 1 | `Reports.vue:156,162` | URL API hardcodati a `localhost:8001` — bypassa il modulo centralizzato `api.js` usato da tutte le altre view | Critica |
| 2 | `api.js` | Nessun metodo `getQuarterlyReports()` / `getMonthlyTrends()` — il client API non conosce questi endpoint | Critica |
| 3 | `Reports.vue:130+` | Unica view scritta in Options API; tutte le altre (Dashboard, Inventory, Orders, Spending, Demand) usano Composition API | Alta |

### Backend e logica dati

| # | File | Problema | Severity |
|---|------|----------|----------|
| 4 | `main.py:239-248` | Anno 2025 hardcodato nel calcolo trimestrale — i dati 2026 non vengono categorizzati | Critica |
| 5 | `main.py:230-305` | Endpoint `/api/reports/*` non accettano parametri filtro (warehouse, category, ecc.) — tutti gli altri endpoint li gestiscono | Alta |
| 6 | `main.py:261-269` | Match hardcodato su `"Delivered"` per il calcolo fulfillment rate — case-sensitive, fragile a variazioni del valore | Media |

### Qualità del codice e i18n

| # | File | Problema | Severity |
|---|------|----------|----------|
| 7 | `Reports.vue:145-256` | 13 chiamate `console.log()` distribuite su 4 metodi — presenti in produzione | Alta |
| 8 | `Reports.vue` intero | Zero integrazione i18n: tutte le stringhe sono inglese hardcodato, nessuna chiamata a `t()` | Alta |
| 9 | `locales/en.js`, `locales/ja.js` | Nessuna chiave `reports:` in nessuno dei due file locale — le traduzioni non esistono | Alta |

### Approccio di remediation

Interveniamo in questo ordine:

1. **Fix backend** (difetti 4, 5, 6): correggiamo la logica trimestrale per gestire anni arbitrari, aggiungiamo i parametri filtro agli endpoint reports, rendiamo robusto il match sullo status.
2. **Refactor frontend** (difetti 1, 2, 3): migrazione di Reports.vue a Composition API, aggiunta dei metodi mancanti in `api.js`, sostituzione degli URL hardcodati con chiamate al modulo centralizzato.
3. **Pulizia e i18n** (difetti 7, 8, 9): rimozione dei `console.log()`, aggiunta delle chiavi `reports:` nei file locale, integrazione di `useI18n()` nella view.

Per dare concretezza: il pattern corretto per una view in questo codebase è questo —

```js
// ✗ Quello che Reports.vue fa oggi (Options API)
export default {
  data() {
    return { items: [], loading: false }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      console.log('loading...')          // da rimuovere
      const res = await axios.get('http://localhost:8001/api/reports/quarterly')
      this.items = res.data
    }
  }
}

// ✓ Il pattern usato da tutte le altre view (Composition API)
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../api'

export default {
  setup() {
    const { t } = useI18n()
    const items = ref([])
    const loading = ref(false)

    onMounted(async () => {
      loading.value = true
      items.value = await api.getQuarterlyReports()
      loading.value = false
    })

    return { t, items, loading }
  }
}
```

**Stima R1:** 3–4 giorni lavorativi.

**Definition of done:**
- Tutti i 9 difetti chiusi e verificati
- Test E2E sulla navigazione di Reports verdi, incluso check su dati 2026 non vuoti
- Code review IT passata sulle modifiche backend e frontend

---

## R3 — Automated browser testing

Proponiamo di completare R3 prima di R2 per una ragione precisa: senza test automatizzati, non possiamo consegnare R2 con le garanzie che il vostro IT team richiede per approvare modifiche al sistema. R3 è il prerequisito che sblocca tutto il resto.

Il repo include già Playwright configurato — l'infrastruttura di test è disponibile dall'inizio.

I flussi critici che proponiamo di coprire (da confermare con IT a inizio engagement, in risposta alla nostra Q3):

| Flusso | Cosa verifica |
|--------|---------------|
| Inventory view | Caricamento dati, filtro per magazzino, filtro per categoria |
| Reports navigation | Caricamento dati Q1-Q4, assenza di dati vuoti per 2026 |
| Orders flow | Filtri status e periodo, coerenza dei risultati |
| Filter state | Persistenza dei filtri durante la navigazione tra view |

**Stima R3:** 2–3 giorni lavorativi.

**Definition of done:**
- Critical flows confermati con IT (in risposta a Q3) coperti da test Playwright
- Suite di test eseguibile da CI con report HTML
- Documento "come aggiungere un nuovo test" consegnato

---

## R2 — Restocking recommendations

La Restocking view è la funzionalità principale richiesta dal team Operations. La logica centrale: dato il livello di stock attuale per ogni prodotto, la domanda prevista, e un budget ceiling fornito dall'operatore, il sistema genera una lista di ordini di acquisto raccomandati per magazzino.

### Logica funzionale

```
Per ogni prodotto per magazzino:
  giorni_rimanenti = stock_attuale / domanda_media_giornaliera
  se giorni_rimanenti < soglia_minima:
    quantità_suggerita = (stock_target - stock_attuale)
    costo_stimato = quantità_suggerita × prezzo_unitario

Ottimizzazione: ordinare per urgenza, allocare budget partendo
dall'item più critico fino a esaurimento del budget ceiling
```

### Componenti tecnici

- **Frontend:** nuova view `Restocking.vue` in Composition API (stesso pattern di `Inventory.vue` e `Orders.vue`), con input per budget ceiling e tabella ordinata per urgenza
- **Backend:** nuovo endpoint `GET /api/restocking?warehouse=&budget=` in `main.py`, logica di raccomandazione in Python con i dati esistenti di inventory e demand
- **Dati:** nessuna modifica ai file JSON — la logica è applicata in-memory sui dati esistenti

### Modalità di lavoro

R2 richiede alcune scelte di product design (soglie di stock, formato degli ordini, logica di prioritizzazione) che devono essere validate con il team Operations. Proponiamo: documento di specifiche condiviso a inizio sprint, una sessione di review intermedia con R. Tanaka o suo delegato, delivery con test E2E inclusi.

**Stima R2:** 5–7 giorni lavorativi.

**Definition of done:**
- Specifiche prodotto firmate dal team Operations
- Test E2E del flusso restocking verde
- Sessione di walkthrough con R. Tanaka completata

---

## R4 — Architecture documentation

Consegniamo un documento di architettura current-state come primo deliverable dell'engagement — è utile a noi per l'onboarding e a Meridian IT per il passaggio di consegne finale.

**Formato:** file HTML interattivo con diagramma a blocchi (stack, flusso dati, pattern filtri).

**Contenuto:**
- Stack completo: Vue 3 + Vite (porta 3000) → `api.js` → FastAPI (porta 8001) → `mock_data.py` → file JSON in `server/data/`
- Pattern filtri: come i 4 filtri (Time Period, Warehouse, Category, Order Status) fluiscono da UI a query params a logica in-memory
- Debito tecnico residuo post-remediation: note per i manutentori futuri
- Dipendenze chiave e versioni

**Stima R4:** 1 giorno lavorativo, prodotto durante la prima settimana dell'engagement in parallelo all'analisi approfondita del codice e al setup dell'ambiente di test.

**Definition of done:**
- Documento HTML approvato da IT
- Diagramma stack e flusso dati validati
- Note debito tecnico residuo condivise

---

## D1, D2, D3 — Desired items

Includiamo questi nel perimetro condizionato alle risposte alle nostre clarifying questions (Q1 budget, Q2 design system).

**D1 — UI modernization:** lo scope dipende dalla risposta a Q2. Senza un design system di riferimento, proponiamo un refresh conservativo basato sui token colore esistenti. Con un design system definito, diventa un'attività separata con stima dedicata.

**D2 — Internationalization:** le fondamenta sono già presenti (vue-i18n configurato, `en.js` e `ja.js` esistenti). Dopo R1 le chiavi `reports:` saranno aggiunte; le restanti view che mancano di traduzione giapponese sono un'estensione diretta dello stesso pattern. Stima: 1–2 giorni aggiuntivi.

**D3 — Dark mode:** il sistema usa già token CSS per i colori (slate/gray). Implementabile come tema alternativo con CSS custom properties, sviluppato su un branch isolato per non toccare main durante il lavoro. Stima: 1–2 giorni aggiuntivi.

---

## Riepilogo stime

| Requisito | Descrizione breve | Stima sviluppo netto |
|-----------|-------------------|----------------------|
| R1 | Reports remediation (9 difetti) | 3–4 gg |
| R3 | Test automatizzati E2E | 2–3 gg |
| R2 | Restocking recommendations | 5–7 gg |
| R4 | Architecture documentation | 1 gg |
| D2 (opzionale) | i18n estesa | 1–2 gg |
| D3 (opzionale) | Dark mode | 1–2 gg |
| **Totale required (R1–R4)** | | **11–15 gg** |
| **Totale con D2+D3** | | **13–19 gg** |

Il calendario completo dell'engagement, comprensivo di review, acceptance e buffer, è descritto in `timeline.md`.
