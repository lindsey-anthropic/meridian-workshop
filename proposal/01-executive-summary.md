# Executive Summary

**Prepared for:** Meridian Components, Inc.
**In response to:** RFP #MC-2026-0417 — Inventory Dashboard Modernization
**Date:** May 2026 (submission due May 8, 2026)

---

## Our understanding

Meridian's operations team depends on its inventory dashboard every day — across San Francisco, London, and Tokyo — to track stock, orders, supplier spend, and demand. The system your previous vendor delivered in 2024 works, but it was handed over unfinished: the Reports module has unresolved defects, there is no automated test coverage, and the capabilities your operations team most wants — chiefly intelligent restocking — were never built.

The absence of tests is the quiet center of the problem. It is why your IT team has been reluctant to approve changes, which in turn has frozen the system in its half-finished state. Nothing gets better because nothing can safely move. **Any credible modernization has to start by making the system safe to change.**

## Our approach, in one breath

We propose a **stabilize → finish → extend** engagement:

1. **Stabilize.** Establish automated browser test coverage across your critical flows and produce a current-state architecture overview. This unblocks IT and gives every later change a safety net.
2. **Finish.** Remediate the Reports module completely — resolving the eight-plus logged defects together with the additional issues our audit identifies during scoping.
3. **Extend.** Build the Restocking recommendations view your operations team has asked for, and lay the groundwork to modernize the interface toward a maintainable design system as part of the desired-scope items in §3.2.

This sequence is a deliberate choice. The RFP rightly lists Reports remediation as the top priority, and it remains our first functional deliverable — but resolving those defects safely depends on having tests and a clear architecture picture in place first. Sequencing stabilization ahead of remediation de-risks every change that follows and leaves Meridian with a system your own team can confidently maintain after we're gone — the opposite of the handoff you received last time.

## Why us

We specialize in **rescuing and finishing** software that a prior vendor left incomplete. That means we are comfortable working without pristine documentation, reading an unfamiliar codebase quickly, and prioritizing the changes that unblock your team fastest. We measure success the way your VP of Operations does: can her team get their work done without fighting the tool.

## What you get

A fully tested, fully documented inventory dashboard with the Reports module fixed and a working Restocking recommendation capability — delivered in phases so you see value early and carry no surprise risk on cost. We are equally ready to take on the desired-scope modernization items (UI refresh, extended internationalization, dark mode) and have structured our approach so they can be added without rework, scoped and priced separately once the required work is underway.
