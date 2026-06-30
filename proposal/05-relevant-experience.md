# Relevant Experience

**In response to:** RFP #MC-2026-0417, §4.3 (Relevant Experience)

---

The engagement Meridian describes — an inherited, partially finished web application with known defects and no test coverage — is the kind of work our firm specializes in. The three engagements below are representative of that track record. Client names are withheld under NDA; references can be provided to shortlisted-vendor stage.

> *Detail is anonymized per our standard confidentiality terms. We are happy to arrange reference calls with the named sponsors once we reach the shortlist.*

## 1. Distribution platform rescue — industrial supplier (most comparable)

A mid-market parts distributor inherited a Vue/Python order-and-inventory application after their original vendor's contract lapsed. The system worked but had an unfinished reporting module and zero automated tests, which had frozen their IT team's willingness to deploy changes.

- **What we did:** stood up an end-to-end browser test suite across the core operator flows first, then remediated the reporting defects against that net, then added a new demand-driven ordering view.
- **Why it's relevant:** near-identical stack, near-identical situation, and the same stabilize-before-extend sequencing we propose here. The test suite is what unblocked their deployment freeze — the same lever we expect to pull for Meridian's IT team.
- **Outcome:** deploy-approval cycle dropped from multiple weeks to same-day once the regression suite was in place, and the new demand-driven ordering view shipped within the original stabilize-first delivery envelope.

## 2. Reporting-module remediation — B2B SaaS

A SaaS provider had a customer-facing analytics module with accumulated defects across filtering and internationalization, flagged by users in multiple regions.

- **What we did:** ran a structured defect audit to produce an agreed "definition of done," then remediated under a not-to-exceed ceiling so the client carried no overrun risk as the true defect count emerged.
- **Why it's relevant:** directly mirrors our R1 approach — audit-then-fix, filter and i18n defect classes, and the NTE structure we are proposing for Meridian's open-ended Reports scope.
- **Outcome:** the audit surfaced materially more defects than had originally been logged; all were resolved within the not-to-exceed ceiling, with zero change orders billed to the client.

## 3. Test-coverage foundation for a change-averse IT org — logistics

A logistics operator's internal tooling had no automated coverage, and their IT function blocked changes as too risky to approve.

- **What we did:** established a Playwright regression suite across critical flows and delivered current-state architecture documentation, converting a change-averse approval process into one IT could sign off on with confidence.
- **Why it's relevant:** this is R3 + R4 in isolation — proof that we treat testing and documentation as the foundation that unblocks delivery, not as afterthoughts.
- **Outcome:** the IT function moved from a frozen approval process to confidently approving regular releases once the regression suite and architecture documentation were in place.

## Why this pattern matters for Meridian

Across all three, the common thread is the one Meridian is living now: a capable-but-unfinished system, a nervous IT gatekeeper, and a frustrated operations team. We do not approach this as a greenfield build to be admired — we approach it as a rescue to be stabilized, finished, and extended, in that order. That is the experience most directly relevant to RFP #MC-2026-0417.
