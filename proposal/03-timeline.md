# Timeline

**RFP #MC-2026-0417 — Meridian Components, Inc.**

---

La consegna è organizzata in quattro fasi. Ogni fase termina con un deliverable verificabile — non aspettiamo la fine del progetto per dimostrare avanzamento.

---

## Fase 1 — Onboarding e discovery (settimane 1–2)

Esploriamo il codice esistente, verifichiamo l'ambiente, e produciamo la documentazione architetturale (R4). È il fondamento su cui si appoggiano tutte le fasi successive: senza capire bene il sistema, qualsiasi stima successiva sarebbe campata in aria.

**Deliverable:** Documento architetturale (R4) consegnato a Meridian IT.

---

## Fase 2 — Remediation Reports (settimane 2–4)

Audit e risoluzione dei difetti nel modulo Reports (R1). Partiamo dai problemi più bloccanti per il team operativo, lavoriamo in modo incrementale con verifica manuale di ogni fix.

**Deliverable:** Modulo Reports funzionante e verificato su tutti i magazzini.

---

## Fase 3 — Vista Restocking (settimane 4–7)

Design e implementazione della nuova funzionalità (R2). La UX viene concordata con R. Tanaka a inizio fase prima di scrivere una riga di codice.

**Deliverable:** Vista Restocking disponibile in ambiente di test, pronta per revisione operativa.

---

## Fase 4 — Test automatizzati e rilascio (settimane 7–8)

Scrittura della suite Playwright sui flussi critici (R3) e rilascio in produzione. I test vengono scritti dopo R1 e R2, su comportamenti già corretti.

**Deliverable:** Suite di test operativa; sistema approvato da Meridian IT per modifiche future.

---

## Riepilogo

| Fase | Contenuto | Settimane | Deliverable chiave |
|---|---|---|---|
| 1 | Onboarding + R4 | 1–2 | Documentazione architetturale |
| 2 | R1 Reports | 2–4 | Reports corretto e verificato |
| 3 | R2 Restocking | 4–7 | Vista Restocking in test |
| 4 | R3 Test + rilascio | 7–8 | Suite Playwright + go-live |

**Durata totale stimata: 8 settimane** dalla firma del contratto.

---

## Requisiti desiderati (D1–D3)

UI modernization, i18n e dark mode sono valutabili come Fase 5 in continuità con l'engagement, o come intervento separato. Stima e scope da concordare dopo l'aggiudicazione.

---

*Nota: la timeline presuppone accesso all'ambiente di sviluppo entro la fine della settimana 1 e disponibilità di R. Tanaka per una sessione di revisione UX a inizio Fase 3 (circa 1 ora).*
