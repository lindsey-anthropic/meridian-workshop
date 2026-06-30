# Relevant Experience

**RFP MC-2026-0417 — Inventory Dashboard Modernization**

Meridian's situation has three defining characteristics: a business-critical application inherited from a previous vendor, a freeze on change driven by the absence of tests, and a high-value new capability the operations team is waiting on. The engagements below were selected because each maps directly to one of those characteristics. Client names are withheld pending reference release; we will provide direct references for shortlisted consideration.

---

## Case study 1 — Remediating an inherited, business-critical dashboard

**Context.** A mid-market distributor engaged us to take over a Vue/Python operations dashboard left partially finished by a prior vendor. As with Meridian, parts of the application had been built to inconsistent standards and a backlog of defects had eroded user trust in the reported numbers.

**What we did.** We began with a current-state architecture review to map where the codebase diverged from its own patterns, then remediated the affected modules — restoring consistent data access, removing diagnostic logging that had reached production, and replacing hand-rolled formatting with locale-aware utilities. We brought legacy components up to the project's prevailing framework standard so future maintenance was uniform.

**Outcome.** All logged defects were closed, the remediated modules became indistinguishable in quality from the strongest parts of the application, and the client's team resumed relying on the dashboard's figures for upward reporting.

**Relevance to Meridian.** This is R1 and R4 in the same shape: inherit a partially finished system, document it honestly, and raise the weakest module to the standard of the best — without rewriting what already works.

---

## Case study 2 — Introducing automated test coverage to unblock a frozen system

**Context.** An operations client had frozen all changes to a revenue-critical internal application because it had no automated test coverage and their IT function would not approve releases they couldn't verify. The freeze was blocking a backlog of needed work — precisely Meridian's R3 situation.

**What we did.** We established end-to-end browser coverage of the critical user flows — navigation, filtering, and the core data views — using a modern browser-automation framework, and delivered it in a form the client's own IT team could run on demand and wire into their pipeline. We documented each flow so coverage was transparent rather than a black box.

**Outcome.** IT gained the confidence to approve changes again. The test suite became the gate for every subsequent release, and the previously frozen backlog moved forward safely.

**Relevance to Meridian.** R3 is explicitly the requirement that unblocks the others. We have done exactly this — turned "we can't safely change it" into "we can change it with confidence" — and we sequence it early for the same reason here.

---

## Case study 3 — Building a budget-aware recommendation feature

**Context.** A distribution client needed a purchasing aid that converted stock levels and demand signals into concrete reorder recommendations bounded by a spend limit — functionally the same problem as Meridian's R2 Restocking view.

**What we did.** We worked directly with the operations users to capture how they actually prioritize reorders, then built a view that computed recommended quantities from stock-versus-demand gaps, ranked candidates by urgency, costed them, and selected the set that maximized coverage of the most urgent needs within the operator's budget ceiling — showing clearly what was included, what was deferred, and the remaining budget. The logic was covered by automated tests from day one.

**Outcome.** Purchasing decisions that had taken hours of manual spreadsheet work became a few minutes of review-and-confirm, and the recommendations were trusted because the prioritization matched how the team already thought.

**Relevance to Meridian.** This is R2 directly: budget-bounded, demand-driven restocking recommendations, designed around the operators' real prioritization and verified by tests.

---

## Why this combination matters

Many vendors can do one of these. Meridian's engagement requires all three at once — remediation, test-driven unblocking, and a new budget-aware feature — delivered on a single inherited codebase without destabilizing it. Our experience is specifically in doing them together, in the right order, on systems we did not originally build. That is the core competency this RFP calls for.
