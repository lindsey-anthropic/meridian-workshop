# Executive Summary

**RE: RFP MC-2026-0417 — Inventory Dashboard Modernization**

Meridian Components' inventory dashboard is functional but unfinished. The Reports module has known defects, the operations team lacks a way to translate stock and demand data into purchasing decisions, and — most urgently — the absence of automated test coverage has left IT unwilling to approve further changes. The result is a system that works today but cannot safely evolve.

We propose an engagement structured around that reality: stabilize first, build second, harden throughout.

**Our approach.** We'll begin with a short architecture review to independently verify the current state of the Vue/FastAPI application — the previous vendor's handoff documentation is thin, and we don't want to price or plan against assumptions we haven't checked ourselves. From there, we address the four required items in Meridian's stated priority order: remediate the Reports module (R1), design and build the Restocking recommendations view (R2), establish automated browser test coverage for the flows most critical to daily operations (R3), and deliver current-state architecture documentation for IT (R4). Automated testing is listed third in the RFP, but because it directly unblocks IT's willingness to approve any change — including our own — we treat it as foundational and sequence it early rather than last.

The Restocking feature is the centerpiece of the engagement and the one most directly requested by the operations team who use this system daily. We'll design it around real purchasing behavior: current stock, demand forecast, and an operator-supplied budget ceiling, producing recommendations Meridian's team can act on rather than raw data they have to interpret themselves.

Time and floor conditions permitting, we'll also address the desired items — a full visual redesign (D1), extended internationalization for Tokyo operations (D2), and dark mode for low-light warehouse stations (D3) — as a follow-on phase once required scope is delivered and confirmed.

**Why we're the right team for this.** We've read this system, not just this RFP. The handoff notes we received are thin by design — no test documentation, no design rationale, an incomplete Options-API-to-Composition-API migration left mid-flight — and we've treated that thinness itself as a finding, not an inconvenience. Our architecture review will independently verify what the previous vendor's documentation could not confirm, so every phase we price is priced against reality, not assumption.

We've also thought past the happy path. The Restocking engine has to behave sensibly at the edges, not just on the demo case: zero or negative available stock, a budget ceiling too small to cover minimum viable order quantities, conflicting demand signals across three warehouses with different lead times, and suppliers with minimum order thresholds that don't divide evenly into a budget. We will design and test explicitly for these conditions rather than discover them after go-live. The same discipline applies to R1 — each of the eight-plus logged Reports defects will be root-caused individually, not patched symptomatically, so fixes hold up under the filter combinations and locales operations actually uses, including the Tokyo team's. And because IT's core concern is change risk, R3's test suite will be built to catch regressions in exactly these edge behaviors, not just confirm that pages load.

**How we propose to work together.** We recommend a phased fixed-fee structure: each phase scoped, priced, and confirmed before the next begins. This gives Meridian pricing certainty per phase without committing to a single all-in number before the architecture review has actually validated scope — a lesson we take directly from how the previous engagement ended.

**What we need from Meridian.** A handful of scoping questions remain open — expected data volume for the Restocking engine, and confirmation of which user flows are considered most critical for test coverage — which we've flagged separately for procurement's response.

We understand this system is more than a dashboard: it's the tool R. Tanaka's operations team relies on every day across three warehouses, and the reason IT has been unable to safely move it forward. Our goal is to leave Meridian with a system that works, that IT can confidently change, and that operations actually wants to use.
