# Piano di Consegna — 4 Fasi in 6 Settimane

**RFP MC-2026-0417 — Meridian Components**

---

## Struttura dell'engagement

L'engagement è organizzato in quattro fasi sequenziali con un buffer esplicito nella fase finale per l'acceptance IT. Le stime per requisito in `technical-approach.md` sono giorni-uomo di sviluppo netto; il calendario include review, sessioni con Operations e IT, hardening, e buffer per imprevisti.

**Data di avvio assunta:** prima settimana disponibile dopo l'aggiudicazione (indicativamente maggio 2026).

---

## Tabella milestone

| Fase | Settimana | Deliverable | Owner review |
|------|-----------|-------------|--------------|
| **Fase 1 — Onboarding e architettura** | Settimana 1 | Documento architettura current-state (`architecture.html`) con diagramma stack, flusso dati, pattern filtri e note debito tecnico | Meridian IT |
| **Fase 1 — Onboarding e architettura** | Settimana 1 | Ambiente di sviluppo e test configurato; critical flows per R3 confermati con IT | Meridian IT |
| **Fase 2 — Stabilizzazione** | Settimane 1–2 | Reports module remediation: tutti i 9 difetti corretti, dati 2026 visibili | Meridian IT (code review) |
| **Fase 2 — Stabilizzazione** | Settimane 1–2 | Suite test E2E Playwright: critical flows coperti, suite eseguibile da CI con report HTML | Meridian IT |
| **Fase 2 — Stabilizzazione** | Settimana 2 | Documento "come aggiungere un nuovo test" | Meridian IT |
| **Fase 3 — Nuova funzionalità** | Settimana 3 | Documento di specifiche Restocking condiviso e firmato da Operations | R. Tanaka / Operations |
| **Fase 3 — Nuova funzionalità** | Settimana 3 | Review intermedia Restocking view (build in progress) | R. Tanaka / Operations |
| **Fase 3 — Nuova funzionalità** | Settimana 4 | Restocking view completa: endpoint backend, view Vue, test E2E | R. Tanaka / Operations + IT |
| **Fase 4 — Hardening e opzionali** | Settimana 5 | Hardening, fix da review Fase 3, documentazione finale aggiornata | Meridian IT |
| **Fase 4 — Hardening e opzionali** | Settimana 5 | D2 i18n estesa (se in scope) e/o D3 dark mode (se in scope) | R. Tanaka / IT |
| **Buffer — IT acceptance** | Settimana 6 | Sessione di acceptance IT: verifica deliverable, fix da feedback, sign-off finale | Meridian IT + Procurement |

---

## Dettaglio per fase

### Fase 1 — Onboarding e architettura (Settimana 1)

Primo deliverable concreto nella prima settimana. Mentre analizziamo il codebase in profondità, produciamo il documento di architettura current-state (R4) e allineamo con IT i flussi critici da coprire con i test (risposta operativa a Q3). Questo parallelismo è deliberato: R4 non è lavoro separato dal resto, è il prodotto naturale del processo di onboarding.

Deliverable al termine della fase:
- `proposal/architecture.html` approvato da IT
- Critical flows R3 confermati e documentati
- Ambiente di sviluppo e test operativo

### Fase 2 — Stabilizzazione (Settimane 1–2)

R1 e R3 procedono in parallelo: man mano che i difetti di Reports vengono corretti, scriviamo i test che li coprono. Questo approccio riduce il rischio di regressione e consegna IT i test nello stesso sprint in cui arrivano le correzioni — non in un secondo momento.

Nota su D2: se l'i18n estesa (D2) è in scope, la Fase 2 è il momento ottimale per avviare il lavoro. Il refactor di Reports.vue include già l'integrazione di `useI18n()` e l'aggiunta delle chiavi `reports:` — estendere alle view rimanenti richiede lo stesso contesto e lo stesso pattern, con overhead minimo rispetto al farlo in una fase separata.

Deliverable al termine della fase:
- Reports module: tutti i 9 difetti chiusi, dati 2026 visibili
- Suite test E2E attiva su CI
- Documento guida per i test

### Fase 3 — Nuova funzionalità (Settimane 3–4)

R2 (Restocking) è la fase a maggior rischio product design: la logica di raccomandazione dipende da soglie di stock e criteri di prioritizzazione che devono essere validati con il team Operations, non decisi unilateralmente dal vendor. Per questo la fase inizia con una sessione di specifiche con R. Tanaka o suo delegato, seguita da una review intermedia a metà sprint prima della consegna finale.

La Restocking view viene consegnata con test E2E inclusi e walkthrough finale con Operations.

Deliverable al termine della fase:
- Specifiche firmate da Operations
- Restocking view in produzione con test
- Walkthrough completato con R. Tanaka

### Fase 4 — Hardening e opzionali (Settimana 5)

Settimana dedicata al consolidamento: correzioni emerse dalle review di Fase 3, aggiornamento della documentazione, e — se in scope — consegna di D3 (dark mode). D3 viene sviluppato su branch isolato per non toccare main durante il lavoro.

Se D2 non è stato anticipato in Fase 2, può essere completato qui. Se entrambi D2 e D3 sono in scope e D2 non è stato anticipato, valuteremo in fase di kick-off se estendere la Fase 4 o portare D3 fuori dallo scope base.

### Buffer — IT acceptance (Settimana 6)

Settimana riservata esclusivamente all'acceptance IT. Non è buffer per ritardi interni: è tempo strutturato per permettere al team IT di verificare i deliverable, sollevare osservazioni, e ricevere fix prima del sign-off finale. L'esperienza insegna che l'acceptance IT richiede tempo reale — includerlo nel calendario, non sperarlo.

---

## Assunzioni

- Avvio entro 2 settimane dall'aggiudicazione
- Disponibilità di R. Tanaka o suo delegato per la sessione di specifiche R2 (Settimana 3) e walkthrough finale (Settimana 4)
- Risposta di IT ai deliverable di Fase 1 entro 3 giorni lavorativi dalla consegna
- Scope D1 (UI modernization) condizionato alla risposta Q2 — non incluso nel calendario base
- Scope D2/D3 confermato entro kick-off

---

## Note sui rischi di timeline

| Rischio | Probabilità | Mitigazione |
|---------|-------------|-------------|
| R1 più ampio del previsto (difetti oltre i 9 identificati) | Bassa — audit pre-proposta già effettuato | Buffer Fase 4 assorbe fino a 2 gg aggiuntivi |
| Specifiche R2 richiedono più iterazioni con Operations | Media | Sessione di specifiche dedicata in Settimana 3 prima di scrivere codice |
| IT acceptance genera richieste di modifica sostanziali | Bassa — IT coinvolto fin dalla Fase 1 | Settimana 6 interamente dedicata |
| Scope D1 aggiunto dopo kick-off | Media | Stima separata richiesta; non modifica il calendario base |
