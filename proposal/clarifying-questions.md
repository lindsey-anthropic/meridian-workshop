# Clarifying Questions — RFP MC-2026-0417

*Per RFP §6, submitted to procurement@meridiancomponents.example ahead of the April 28 deadline.*

---

## 1. UI Modernization Scope (D1)
**Question:** RFP §3.2 asks to "align with current standards" for D1 — could Meridian clarify whether this means a full visual redesign, or a lighter refresh of the existing interface?

**Assumption used in this proposal:** Light refresh — modernized spacing, colors, and components, keeping the existing page structure and information architecture intact. Scoped and priced accordingly.

## 2. Critical User Flows for Testing (R3)
**Question:** R3 calls for automated coverage of "critical user flows." Which flows does Meridian consider critical — the full dashboard, or a subset?

**Assumption used in this proposal:** Reports and Restocking are the critical flows — the area being remediated (R1) and the new feature being built (R2). These represent the highest-risk, highest-change surface area in this engagement.

## 3. Budget Range
**Question:** The RFP does not specify a budget range or ceiling. Can Meridian share a target range so we can right-size our proposal?

**Assumption used in this proposal:** No range provided at time of drafting — pricing section will present options (fixed-fee vs. T&M with not-to-exceed) rather than assume a single model, and will ask this question directly of procurement.

## 4. Data Layer / Database Migration
**Question:** The current system stores data in flat JSON files with no database. Does Meridian want this engagement to include a migration to a persistent database, or should that remain out of scope for now?

**Assumption used in this proposal:** In scope — this engagement will include a migration off flat JSON files to a real database. This is a meaningful scope addition beyond the RFP's explicit line items, since every requirement (R1–R4) currently reads and writes against the JSON data layer; it will be reflected in the technical approach, timeline, and pricing.

---

*These assumptions will be restated in the executive summary and technical approach so Meridian can flag any that don't match their intent.*
