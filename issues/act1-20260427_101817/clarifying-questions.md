# Clarifying Questions — RFP MC-2026-0417
> Work-in-progress Act 1 / Step 3.
> To be sent to procurement@meridiancomponents.example by April 28, 2026 (§6 RFP).
> Fallback assumptions feed directly into the Technical Approach if we receive no reply.

---

## Q1 — Budget

**Question:**
> "The RFP does not include a budget range or not-to-exceed figure. To ensure our pricing proposal is
> calibrated to your expectations, could you share an indicative range or confirm whether a fixed-fee
> or T&M model is preferred?"

**Why we ask:** Without a reference, we risk over-estimating (and losing) or under-estimating
(and losing margin). Okafor cares about price — giving him a calibrated proposal builds trust.

**Fallback assumption:**
T&M proposal with not-to-exceed. Estimate based on a team of 2 senior consultants for 6 weeks.
R1–R4 mandatory requirements included in the not-to-exceed. D1–D3 as separate options on request.

---

## Q2 — Critical flows for R3 (testing)

**Question:**
> "R3 requires automated browser test coverage for 'critical user flows.' To scope this accurately,
> could your IT team identify the 3–5 flows they consider non-negotiable for sign-off? Examples might
> include: inventory filtering, order status update, reports export, or the new restocking workflow."

**Why we ask:** "Critical flows" is vague. If we do not define them now, the client will shift them
during delivery. IT is the gatekeeper — this question involves them directly and holds them
accountable for the definition.

**Fallback assumption:**
Coverage of the following 5 main flows:
1. Inventory view — loading and filtering by warehouse/category
2. Orders view — filtering by status and month
3. Reports view — quarterly and monthly trends with filters
4. Restocking view — budget input and recommendation generation (R2)
5. Dashboard summary — KPIs with combined filters

---

## Q3 — UI standards for D1

**Question:**
> "D1 mentions aligning the UI to 'current standards.' Do you have an existing design system,
> brand guidelines, or a reference UI you'd like us to match? If not, we'll propose a direction
> and iterate with your team."

**Why we ask:** Without a reference, "modernization" can mean everything or nothing.
If a brand guideline exists and we don't follow it, the work will be rejected. If it doesn't exist,
we need to say that we will propose the direction ourselves.

**Fallback assumption:**
No existing design system. We propose a conservative visual refresh: improved
spacing, typographic hierarchy, and status color consistency. No structural redesign
of views. Current palette retained as a base (slate/gray).

---

## Q4 — Target languages for D2 (i18n)

**Question:**
> "D2 references the Tokyo warehouse team specifically. Beyond Japanese, are there other target
> languages you anticipate needing — now or in the next 12 months? Also, does any existing
> localization infrastructure exist in the codebase (i18n library, translation files), or is
> this to be built from scratch?"

**Why we ask:** Building i18n for one language is very different from building it for five.
The architecture changes. And if `vue-i18n` is already installed (but we don't know), the work is halved.

**Fallback assumption:**
Target language: Japanese (JA) + English (EN) as the base. Extensible i18n architecture (vue-i18n).
No existing infrastructure — to be built from scratch. EN strings extracted from all current views.

---

## Q5 — Deployment and infrastructure

**Question:**
> "The current system appears to run locally. Is there an existing hosting environment
> (internal server, cloud) where the updated system will be deployed, or is deployment
> out of scope for this engagement? If in scope, what are the infrastructure constraints?"

**Why we ask:** The previous vendor does not address this. If deployment is in scope and
we do not price it, it is a gap in the contract. If it is out of scope, this must be stated explicitly
to avoid mismatched expectations.

**Fallback assumption:**
Deployment out of scope. Delivery as a working local application with documentation
for the Meridian IT team on how to host it. Any deploy activities as a separate change request.

---

## Assumptions summary (to include in the Technical Approach)

| # | Topic | Adopted assumption |
|---|---|---|
| A1 | Budget | T&M with not-to-exceed. Team 2 senior, 6 weeks. D1–D3 optional. |
| A2 | Critical flows R3 | 5 flows covered: inventory, orders, reports, restocking, dashboard |
| A3 | UI modernization D1 | Conservative visual refresh. No structural redesign. Current palette. |
| A4 | i18n D2 | EN + JA. vue-i18n to be built. Strings extracted from all views. |
| A5 | Deployment | Out of scope. IT handoff documentation included. |
