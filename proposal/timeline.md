# Timeline

**RE: RFP MC-2026-0417 — Inventory Dashboard Modernization**

We propose a five-phase delivery plan, aligned to the sequencing in our technical approach. Each phase is scoped and priced independently (see Pricing Assumptions) and confirmed with Meridian before the next begins — consistent with the phased fixed-fee structure we're proposing.

| Phase | Scope | Duration | Gate to next phase |
|---|---|---|---|
| **1. Discovery & Architecture Review** | Independent verification of current-state system; produce architecture overview (R4 draft) | 1–2 weeks | Meridian confirms findings and Phase 2 scope/estimate |
| **2. Stabilize** | Reports remediation (R1) + first automated test suite (R3), covering the fixes delivered in this phase | 3–4 weeks | Reports defects resolved and passing under automated tests |
| **3. Build** | Restocking recommendations (R2), including edge-case handling, plus expanded test coverage for the new view | 4–6 weeks | Restocking feature delivered and tested against agreed critical flows |
| **4. Document & Handoff** | Finalize architecture documentation (R4) incorporating Phases 2–3 changes; handoff session with Meridian IT | 1 week | IT sign-off on documentation and test suite |
| **5. Enhance** *(contingent)* | UI redesign (D1), extended i18n (D2), dark mode (D3) — scoped and priced separately once Phases 1–4 are confirmed | 4–6 weeks (est.) | N/A — optional phase |

**Total for required scope (Phases 1–4):** approximately 9–13 weeks, depending on what Discovery surfaces. We'd rather commit to a range now and firm it up after Phase 1 than promise a fixed date against a system we haven't yet verified — the same reasoning behind pricing each phase as we go rather than quoting one number up front.

Phase 4's architecture documentation is scoped as a short finalization step because most of that work happens during Phase 1 and is simply kept current through Phases 2–3, rather than authored from scratch at the end.
