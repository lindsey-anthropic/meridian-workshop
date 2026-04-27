# Executive Summary — Modernizzazione Dashboard Meridian Components

**RFP MC-2026-0417 — Meridian Components**

---

Il team Operations di Meridian lavora ogni giorno su un sistema con difetti attivi nel modulo più usato. Il vendor precedente ha consegnato un'applicazione incompleta: il modulo Reports non funziona correttamente, non esistono test automatizzati che permettano all'IT di approvare modifiche in sicurezza, e la funzionalità di restocking che il team ha richiesto non è mai stata costruita. Il risultato è un sistema che genera frustrazione operativa e blocca l'evoluzione del prodotto.

Abbiamo esaminato il codice sorgente incluso nel pacchetto RFP prima di scrivere questa proposta. Questo ci ha permesso di arrivare a un'analisi concreta dei difetti e a stime basate sul codice reale — non sulle note di handoff. I dettagli sono nella sezione Approccio Tecnico.

**La nostra sequenza di intervento:**

Prima stabiliziamo quello che esiste. Il modulo Reports ha nove difetti verificati, incluso uno attivo che causa la visualizzazione di dati vuoti su tutti i periodi 2026. Lo correggiamo per primo, in parallelo alla costruzione della copertura di test automatizzati — perché senza test, il vostro IT team non può approvare nessuna modifica futura in sicurezza. I test non sono un nice-to-have: sono il prerequisito che sblocca tutto il resto dell'engagement.

Poi costruiamo il nuovo. La Restocking view che il team Operations ha richiesto viene sviluppata dopo che la base è stabile e testata, con le specifiche validate direttamente con i vostri operatori prima di scrivere una riga di codice.

Infine documentiamo. L'architettura current-state viene prodotta nella prima settimana come primo deliverable concreto — utile a noi per l'onboarding, utile a Meridian IT per gestire il sistema dopo la consegna.

**Timeline:** 5 settimane di delivery con milestone verificabili a ogni fase, più una settimana di buffer per review e acceptance IT. Il calendario completo è in `timeline.md`.

**Prezzo:** proponiamo tre scenari con perimetri e costi distinti — required only (R1–R4), required con i18n estesa, scope completo includendo UI refresh e dark mode. La struttura è fixed-fee per gli item a scope definito, T&M con not-to-exceed per le attività il cui perimetro dipende dalle risposte alle nostre clarifying questions. I dettagli sono in `pricing.md`.

Siamo disponibili a rispondere a qualsiasi domanda tecnica prima della scadenza dell'8 maggio.
