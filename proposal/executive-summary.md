# Executive Summary

**RFP MC-2026-0417 — Meridian Components Inventory Dashboard Modernization**

Meridian Components' inventory dashboard has unresolved defects, no test coverage, and capability gaps that are holding back the operations team. The previous vendor left work unfinished; our engagement starts by making the system stable and testable before extending it.

**No budget ceiling was provided.** We have structured our proposal as fixed-fee with a clear scope boundary, so Meridian has full cost predictability. Optional items are priced separately and do not affect the core delivery timeline.

**Required deliverables (R1–R4):**

- **R1 (Reports remediation):** Independent audit of the Reports module; resolution of all identified defects including filter behavior, i18n gaps, and data inconsistencies.
- **R2 (Restocking recommendations):** New Restocking view combining stock levels, historical demand data, and an operator-supplied budget ceiling to generate purchase order recommendations.
- **R3 (Automated testing):** End-to-end browser test coverage for the Reports module and Restocking view, unblocking Meridian IT's change approval process.
- **R4 (Architecture documentation):** Current-state architecture overview based on our own codebase assessment, suitable for handoff to Meridian IT.

**Optional enhancements, separately priced:**

- **D1 (UI modernization):** Visual refresh aligned to a modern design direction; no brand guide was provided so direction is at our discretion, consistent with the existing palette.
- **D2 (Internationalization):** Extended i18n support for the Tokyo warehouse team, currently operating in English-only views.
- **D3 (Dark mode):** Operator-selectable theme for low-light warehouse floor stations.
- **D4 (Database migration):** Migration of the existing JSON data layer to a structured database — recommended if Meridian anticipates growth in data volume or needs to support future reporting capabilities.

Our goal is a system Meridian's team can use confidently, maintain independently, and extend without fear.
