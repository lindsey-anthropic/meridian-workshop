# RFP Analysis — MC-2026-0417
> Semilavorato Act 1 / Step 1–2. Alimenta: executive-summary, technical-approach, clarifying-questions.

---

## Requisiti obbligatori (R)

| # | Titolo | Dettaglio | Peso strategico |
|---|---|---|---|
| R1 | Reports remediation | Almeno 8 bug noti: filtri non cablati, i18n gaps, console noise, API pattern inconsistenti | Alto — il cliente li ha già contati |
| R2 | Restocking view | Nuova schermata: stock attuale + demand forecast + budget ceiling → raccomandazioni PO | Alto — richiesta diretta di R. Tanaka (VP Ops) |
| R3 | Browser testing | E2E coverage su critical flows con Playwright | **Non negoziabile** — IT lo usa come gatekeeper per bloccare qualsiasi cambio |
| R4 | Architecture docs | Current-state overview per handoff a Meridian IT | Basso sforzo, alto valore percepito |

## Requisiti desiderati (D)

| # | Titolo | Note |
|---|---|---|
| D1 | UI modernization | "Current standards" non definito — serve chiarimento o assunzione |
| D2 | i18n | Driver: team Tokyo ~12 persone, inglese non fluente. Lingue target non specificate (presumibilmente JA) |
| D3 | Dark mode | Use case: stazioni in ambienti low-light nei magazzini |

---

## Ambiguità e gap nell'RFP

| Ambiguità | Impatto | Assunzione di fallback |
|---|---|---|
| "Current standards" per UI (D1) | Non si sa verso cosa modernizzare | Assumere minor visual refresh (colori, spaziatura) senza redesign completo |
| Nessun budget indicativo | Impossibile calibrare la stima | Proposta T&M con not-to-exceed; chiedere in clarifying questions |
| "Critical flows" per R3 non definiti | Non si sa quanti/quali test scrivere | Coprire: inventory view, orders filter, reports filter, restocking workflow |
| "At least eight issues" su Reports (R1) | Il numero è un floor, non un ceiling — potrebbero essere di più | Fare audit completo prima di stimare; mettere buffer |
| Lingue per D2 | Solo Tokyo citato, ma possibili altre lingue future | Assumere JA come prima lingua + architettura i18n estendibile |
| Infrastruttura di deployment | Non menzionata — attualmente è solo locale | Assumere deploy su infrastruttura Meridian esistente, fuori scope |

---

## Analisi del cliente (da meridian-background.md)

**Buying committee — chi conta davvero:**

- **J. Okafor** (Director Procurement) — firma il contratto, vuole prevedibilità su timeline e prezzo
- **R. Tanaka** (VP Operations) — champion reale, usa il dashboard ogni giorno, ha richiesto personalmente R2 (Restocking). **Frustra col vendor precedente** → opportunità di differenziazione
- **IT (non nominato)** — gatekeeper: ha bloccato modifiche perché non ci sono test. R3 sblocca tutto il resto → trattarlo come priorità anche se è "solo" R3

**Come usare queste info in proposta:**
- Executive summary: parlare ai pain di Tanaka (operativi), non solo alla lista tecnica
- Technical approach: rendere esplicito che R3 è il prerequisito che sblocca gli altri
- Timeline: R3 in fase 1 insieme a R4, così IT può approvare subito

---

## Analisi vendor-handoff (da vendor-handoff.md)

**Cosa hanno lasciato:**
- Stack: Vue 3 + FastAPI + JSON mock data (no DB)
- Documentazione: **minima** — file map e API list, nessun diagramma, nessun design decision
- Known issues ammessi: Reports filtri non cablati, zero test, Options API migration incompleta

**Finding critico:** La scarsità della handoff documentation è essa stessa un rischio che il cliente dovrebbe conoscere. Va citato nel Technical Approach come parte dell'onboarding plan (R4).

**Implicazioni tecniche:**
- No database: tutti i dati sono JSON in memoria → R2 (Restocking) è solo logica front/back, nessuna migrazione
- Options API mista a Composition API → rischio di regressioni durante R1 Reports fix
- Nessun test → qualsiasi modifica è a rischio fino a quando R3 non è consegnato

---

## Domande per procurement (deadline 28 apr)

1. **Budget**: Esiste una fascia di riferimento o un not-to-exceed complessivo?
2. **Critical flows R3**: Quali sono i 3-5 flussi utente che il vostro IT team considera critici da coprire con i test automatizzati?
3. **UI standards D1**: Avete un design system o brand guidelines esistenti da rispettare, o il refresh è a discrezione del vendor?
4. **i18n D2**: Oltre al giapponese per il team di Tokyo, ci sono altre lingue target? Esiste già un sistema di localizzazione (file `.json`, libreria i18n) o è da costruire da zero?
5. **Deployment**: Il sistema è attualmente ospitato su infrastruttura Meridian o è ancora in locale? Il deployment è in scope?

---

## Note per la proposta

- **Differenziatore chiave**: dimostrare che abbiamo già letto il codice e identificato i problemi — il vendor precedente non l'ha fatto
- **Tono**: parlare a Tanaka (operazioni), non solo a Okafor (procurement)
- **R3 come prerequisito**: rendere esplicito che i test sono ciò che sblocca il resto, non solo un deliverable
- **Onestà sui rischi**: handoff doc lacunosa = buffer di contingenza nella stima
