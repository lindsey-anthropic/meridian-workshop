# Struttura di Prezzo — Scenari e Assunzioni

**RFP MC-2026-0417 — Meridian Components**

---

## Struttura contrattuale

Non tutti i requisiti hanno lo stesso profilo di rischio, e proponiamo una struttura di prezzo che riflette questa differenza:

**Fixed-fee** per R1 e R4 — lo scope è pienamente definito. R1 ha 9 difetti verificati e documentati; R4 è un deliverable di un giorno con output concordato. Il rischio di overrun è basso e il cliente ha certezza di costo.

**T&M con not-to-exceed** per R2 e R3 — lo scope dipende da input esterni. Per R3, il perimetro esatto dei critical flows deve essere confermato da IT (Q3 nelle nostre clarifying questions); una volta confermati, possiamo convertire in fixed-fee se preferito. Per R2, la logica di raccomandazione e le soglie di prioritizzazione dipendono dalle specifiche del team Operations — iniziare a costo fisso prima di avere le specifiche firmate scaricherebbe sul cliente il rischio di ambiguità che è invece nostro da gestire.

---

## Scenari

**Tariffa giornaliera base: $1.800/giorno** (senior consultant, full-time allocation).

### Scenario A — Required only (R1–R4)

| Voce | Struttura | Gg stimati | Importo |
|------|-----------|-----------|---------|
| R1 — Reports remediation | Fixed-fee | 4 gg | $7.200 |
| R4 — Architecture documentation | Fixed-fee | 1 gg | $1.800 |
| R3 — Test automatizzati E2E | T&M NTE | max 3 gg | NTE $5.400 |
| R2 — Restocking view | T&M NTE | max 7 gg | NTE $12.600 |
| **Totale Scenario A** | | **max 15 gg** | **NTE $27.000** |

### Scenario B — Required + i18n estesa (R1–R4 + D2)

| Voce | Struttura | Gg stimati | Importo |
|------|-----------|-----------|---------|
| Tutto Scenario A | — | max 15 gg | NTE $27.000 |
| D2 — Internationalization | Fixed-fee | 2 gg | $3.600 |
| **Totale Scenario B** | | **max 17 gg** | **NTE $30.600** |

*D2 è fixed-fee perché viene eseguita in parallelo a R1, quando siamo già nel codice i18n: lo scope incrementale è ben definito.*

### Scenario C — Scope completo (R1–R4 + D2 + D3)

| Voce | Struttura | Gg stimati | Importo |
|------|-----------|-----------|---------|
| Tutto Scenario B | — | max 17 gg | NTE $30.600 |
| D3 — Dark mode | Fixed-fee | 2 gg | $3.600 |
| **Totale Scenario C** | | **max 19 gg** | **NTE $34.200** |

### D1 — UI modernization (fuori dagli scenari base)

D1 non è incluso in nessuno degli scenari perché il suo scope dipende dalla risposta alla Q2 sulle clarifying questions (design system di riferimento). Forniremo una stima dedicata non appena riceveremo le indicazioni di Meridian. L'impatto atteso è tra 2 e 8 giorni aggiuntivi a seconda del perimetro.

---

## Note e assunzioni

- I prezzi sono espressi in USD e si intendono per l'intero engagement, non per risorsa.
- Le stime in giorni sono giorni-uomo di sviluppo netto. Il calendario dell'engagement (6 settimane) include review, sessioni con Operations e IT, hardening e buffer — vedere `timeline.md`.
- Gli scenari T&M vengono fatturati a consuntivo; il cap NTE non viene superato senza previa approvazione scritta di Meridian.
- I prezzi sono soggetti a conferma a seguito delle risposte alle clarifying questions Q1 (budget di riferimento), Q3 (perimetro critical flows R3), e Q5 (modello di collaborazione Operations per R2).
- Il buffer di acceptance IT (Settimana 6) è incluso nel calendario ma non genera costo aggiuntivo — è parte del commitment di delivery.
- Eventuali richieste fuori scope concordate durante l'engagement saranno preventivate separatamente con change order.
