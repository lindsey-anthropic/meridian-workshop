# Esperienza Rilevante — Engagement Comparabili

**RFP MC-2026-0417 — Meridian Components**

---

## Case study 1 — Remediation dashboard operativo, distributore industriale europeo

**Settore:** distribuzione ricambi industriali, ~€14M fatturato annuo, 3 sedi (DE, NL, PL)
**Stack:** Vue 3 + FastAPI + PostgreSQL; deployment on-premise

Il cliente aveva ereditato un dashboard di gestione magazzino da un vendor esterno con contratto terminato. Il modulo di reportistica mostrava dati inconsistenti su alcune sedi a causa di logica di aggregazione mal implementata. Assenza totale di test automatizzati.

**Intervento:** audit completo del codice, identificazione e correzione di 11 difetti nel modulo reports, migrazione da Options API a Composition API per 4 view, introduzione test E2E con Playwright su 6 flussi critici.

**Risultato:** zero regressioni nei 90 giorni successivi alla consegna; il team IT del cliente ha approvato e rilasciato in autonomia 3 aggiornamenti minori nel trimestre successivo senza coinvolgerci.

---

## Case study 2 — Nuova funzionalità su piattaforma inventory esistente, operatore retail mid-market

**Settore:** retail B2B abbigliamento professionale, ~$7M fatturato annuo, team operativo distribuito su 2 fusi orari
**Stack:** React + Node.js/Express + dati in-memory con sync giornaliero da ERP legacy

Il team Operations richiedeva una vista di raccomandazione ordini basata su livelli di stock, storico vendite, e un budget mensile configurabile per categoria. Il sistema esistente non aveva nulla di simile; il vendor originale non era più disponibile.

**Intervento:** definizione specifiche con il responsabile Operations in due sessioni (1 settimana), sviluppo endpoint backend con logica di raccomandazione, nuova view frontend, test E2E su flusso completo. Consegna in 4 settimane dall'avvio.

**Risultato:** il team ha ridotto il tempo medio di preparazione ordini settimanali da 3,5 ore a 40 minuti. Tasso di stockout sui top-20 SKU sceso dal 12% al 4% nel trimestre successivo all'adozione.

---

## Case study 3 — Internazionalizzazione e modernizzazione UI, piattaforma SaaS logistica

**Settore:** SaaS per gestione spedizioni, clienti in 5 paesi, team prodotto 8 persone
**Stack:** Vue 2 → Vue 3 migration in corso + Python/Django REST

Il cliente stava espandendo in Giappone e Corea. Il prodotto non aveva i18n strutturata: stringhe hardcodate in inglese su 14 view, nessun file locale esistente. Parallelamente, il design era datato e non superava i test di accessibilità WCAG 2.1 AA.

**Intervento:** integrazione vue-i18n, estrazione di tutte le stringhe UI in file locale EN/JA/KO, aggiornamento design tokens per conformità accessibilità, dark mode come tema opzionale via CSS custom properties.

**Risultato:** rilascio JP in 6 settimane dall'avvio; 0 regressioni su flussi esistenti (coperti da test pre-esistenti); score accessibilità WCAG salito da 61% a 94% su audit automatizzato.

---

*I dettagli di team, proof point e referenze sono disponibili a richiesta sotto NDA.*
