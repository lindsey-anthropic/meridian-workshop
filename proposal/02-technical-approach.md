# Approccio Tecnico

**RFP #MC-2026-0417 — Meridian Components, Inc.**

---

Il nostro punto di partenza non è l'handoff del vendor precedente — è il codice. Prima di fare stime o promesse, esploriamo direttamente il sistema esistente: cosa funziona, cosa no, e perché. Questo ci permette di scrivere un piano fondato su evidenze, non su assunzioni.

---

## R1 — Remediation del modulo Reports

Il modulo Reports è l'area con la più alta densità di problemi noti. In assenza di un elenco strutturato da parte di Meridian, conduciamo una **discovery diretta sul codice**: audit dei componenti Vue, verifica del wiring dei filtri verso il backend, analisi dei pattern API utilizzati, e revisione del comportamento i18n nei campi di output.

I fix vengono applicati in modo incrementale, con verifica manuale di ogni correzione prima di passare alla copertura automatizzata (R3). L'obiettivo è un modulo Reports che si comporti in modo prevedibile e coerente su tutti i magazzini.

---

## R2 — Vista Restocking

Questa è la funzionalità che il team operativo aspetta. La logica centrale è semplice: dati i livelli di stock attuali, le previsioni di domanda e un **budget ceiling** fornito dall'operatore, il sistema calcola e mostra gli ordini di acquisto raccomandati.

Lato frontend, costruiamo una nuova vista Vue 3 (Composition API, coerente con il resto del codebase) con un campo di input per il budget, una tabella di raccomandazioni per magazzino e categoria, e la possibilità di confermare o modificare gli ordini prima di esportarli. Lato backend, estendiamo FastAPI con un nuovo endpoint `/api/restocking` che incrocia dati di stock, domanda e parametri di budget.

Il design della UX viene concordato con R. Tanaka prima dell'implementazione — è lei che usa questo strumento ogni giorno.

---

## R3 — Test automatizzati browser

Il prerequisito per cui IT possa approvare modifiche future in sicurezza. Utilizziamo **Playwright**, già presente nell'infrastruttura del repo, per coprire i flussi critici: dashboard principale, modulo Reports con filtri, e flusso Restocking.

I test vengono scritti *dopo* il completamento di R1 e R2, in modo da testare comportamenti corretti e non difetti residui. La suite è progettata per essere eseguibile in CI senza dipendenze manuali.

---

## R4 — Documentazione architetturale

L'handoff del vendor precedente era minimale e parzialmente impreciso. Generiamo una documentazione architetturale basata sull'esplorazione diretta del codice attuale: mappa dei componenti frontend, schema degli endpoint API, flusso dati end-to-end, e note sui pattern adottati.

Il formato è un file HTML standalone — visualizzabile da qualsiasi browser, senza dipendenze, pronto per essere consegnato a Meridian IT come documento di riferimento.

---

## D1–D3 — UI modernization, i18n, dark mode

Abbiamo esperienza su tutti e tre i fronti: refresh visivo con design tokens, estensione i18n a nuove lingue (incluso giapponese per il team di Tokyo), e dark mode con toggle lato operatore. Questi elementi rientrano nel perimetro dell'engagement se le priorità e il budget lo consentono — direzione e scope li definiamo insieme dopo l'aggiudicazione.

---

## Assunzioni

| Area | Assunzione |
|---|---|
| R1 — Bug Reports | Discovery completa a nostro carico; nessun elenco preesistente da Meridian |
| R3 — Scope test | Copertura sui flussi critici (Dashboard, Reports, Restocking); non copertura totale |
| D1 — UI | Direzione visiva proposta da noi, approvazione da R. Tanaka |
| Budget | Proposta T&M con not-to-exceed, dettagliata per fase; nessun tetto dichiarato da Meridian |
