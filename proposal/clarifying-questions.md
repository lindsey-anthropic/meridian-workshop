# Clarifying Questions — RFP MC-2026-0417
**From:** [Firm Name]
**To:** J. Okafor, Director of Procurement — Meridian Components
**Date:** April 27, 2026
**Re:** RFP MC-2026-0417 — Inventory Dashboard Modernization

---

Per §6 of the RFP, we submit the following clarifying questions ahead of the April 28 deadline.

---

**Q1 — Budget and contract structure**
The RFP does not specify a budget range or a preference between fixed-fee and T&M engagement models. To ensure our proposal is scoped appropriately, could you share an indicative budget range or a preferred contract structure?

*Assumption if unanswered: fixed-fee engagement, scope limited to requirements R1–R4, budget ceiling ≤ €80K.*

---

**Q2 — UI reference standards (D1)**
Requirement D1 references "current standards" without further specification. Does Meridian have brand guidelines, a design system, or codified color/typography tokens the selected vendor should follow?

*Assumption if unanswered: we will use the existing codebase palette (slate/gray) as a baseline, updating only where needed for accessibility and visual consistency.*

---

**Q3 — Critical user flows for E2E testing (R3)**
R3 requires coverage of "critical user flows" but does not enumerate them. Could you confirm which flows your IT team considers mandatory for approving future changes to the system?

*Assumption if unanswered: coverage of the Restocking flow (new) and Dashboard summary (homepage), with additional tests on the Reports module.*

---

**Q4 — Reports defect backlog (R1)**
The RFP references "at least eight issues" in the Reports module. Does Meridian have a structured backlog (Jira, Linear, etc.) it could share with the selected vendor, or should we treat this as a full discovery effort starting from the source code?

*Assumption if unanswered: we will conduct a full audit of the codebase; any internally tracked issues Meridian wishes to surface explicitly should be shared at project kickoff.*

---

**Q5 — Format and audience for architecture documentation (R4)**
R4 calls for "a current-state architecture overview suitable for handoff to Meridian IT." Does your IT team have a preferred tooling or format (Confluence, Notion, standalone HTML/PDF)? Is there an existing documentation structure we should align to?

*Assumption if unanswered: standalone HTML document, viewable in any browser without external dependencies.*

---

*We are happy to join a brief call if you prefer to address these questions verbally.*
