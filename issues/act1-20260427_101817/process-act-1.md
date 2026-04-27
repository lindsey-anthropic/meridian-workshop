# Act 1 — Respond to the RFP
> Scenario: Meridian Components has issued RFP #MC-2026-0417. You are the consultant responding.
> All output goes in `proposal/`. No code in this act.

---

## 1. Read & Analyze the RFP

**Objective:** Understand what the client is asking for before writing a single word.

**Activities:**
- Read `docs/rfp/MC-2026-0417.md` in full
- Separate the **mandatory** requirements (R1–R4) from the **desired** ones (D1–D3)
- Identify the **deliberate ambiguities** in the text:
  - "current standards" for the UI (D1) — undefined
  - No budget range indicated
  - "critical flows" for tests (R3) — unspecified
  - "at least eight issues" on Reports (R1) — vague number
- Note the questions you would send to procurement (§6 of the RFP, deadline April 28)

**Output:** Mental list / working notes — not a file.

**Useful prompt:**
```
Read @docs/rfp/MC-2026-0417.md and tell me: what are the mandatory vs desired requirements,
what is ambiguous, and what would I ask the client before writing the proposal.
```

---

## 2. Research the Client

**Objective:** Understand who Meridian is in order to personalize the proposal.

**Activities:**
- Read `docs/rfp/meridian-background.md` — company profile, operational context
- Read `docs/rfp/vendor-handoff.md` — notes from the previous vendor (thin = a finding in itself)
- Identify operational pain points: 3 warehouses (SF, London, Tokyo), multilingual staff, low-light environments
- Evaluate the quality of the documentation left — if it is sparse, it is a risk to mention in the proposal

**Output:** No file, but the information feeds all subsequent sections.

**Useful prompt:**
```
Read @docs/rfp/meridian-background.md and @docs/rfp/vendor-handoff.md.
What do I need to know about Meridian that could differentiate our proposal?
```

---

## 3. Draft Clarifying Questions

**Objective:** Simulate the real questions you would send to procurement.

**Activities:**
- Write 3–5 clarifying questions based on the ambiguities found in step 1
- For each, decide on a **fallback assumption** to use in the proposal if no reply is received
- Typical examples:
  - *"What are the 'critical flows' your IT team wants covered by the tests?"*
  - *"Is there an indicative budget or reference range?"*
  - *"Do you have a design system or brand guidelines for the UI refresh (D1)?"*
  - *"Does the Tokyo staff work in Japanese? What other languages are needed for D2?"*

**Output:** The answers become **explicit assumptions** in the proposal (Technical Approach section).

**Useful prompt:**
```
Based on the RFP, write 3–5 questions you would send to procurement@meridiancomponents.example.
For each, include the assumption we would use in the proposal if they don't reply.
```

---

## 4. Write the Proposal

Each section goes in a separate file in `proposal/`. Write one section at a time, stop, review, then move forward.

### 4a. Executive Summary
**File:** `proposal/executive-summary.md`

**Content:**
- 1 page max (as required by RFP §4)
- Demonstrate you understood the problem (not just read the text)
- Value proposition in 2–3 sentences: why us, why now
- Reference to the 4 mandatory requirements without going into technical detail

**Useful prompt:**
```
[stage] You are a senior Accenture consultant responding to an RFP to modernize an inventory dashboard.
[task] Write the executive summary for proposal/executive-summary.md.
[rules] Max 1 page. Professional but direct tone. No buzzwords. Demonstrate understanding of the problem,
not just a list of deliverables.
```

### 4b. Technical Approach
**File:** `proposal/technical-approach.md`

**Content:**
- For each of R1–R4 (and optionally D1–D3): how you would address it, with what assumptions
- R1 Reports: audit + remediation plan (mention that you have already seen the code)
- R2 Restocking: architecture of the new view (input: stock + demand + budget → output: recommended POs)
- R3 Testing: chosen framework (Playwright), coverage plan, definition of done
- R4 Architecture: interactive HTML format, delivered with the engagement
- Include the assumptions derived from the clarifying questions

> Use **Plan Mode** (`Shift+Tab`) before writing this section — this is the right moment to align on the outline before producing the text.

### 4c. Timeline
**File:** `proposal/timeline.md`

**Content:**
- Phased plan (suggested: 3 sprints of 2 weeks)
- Phase 1: Onboarding + R4 Architecture + start of R1 Reports
- Phase 2: Completion of R1 + R2 Restocking
- Phase 3: R3 Testing + final R4 + optional D1–D3
- Milestones and acceptance criteria for each phase
- Risk notes: previous vendor documentation is sparse

### 4d. Pricing
**File:** `proposal/pricing.md`

**Content:**
- Model: fixed-fee or T&M with not-to-exceed (as required by RFP §4)
- Estimate per requirement: R1 (X days), R2 (Y days), R3 (Z days), R4 (W days)
- Assumptions on which the price is based (e.g. team size, code access, no DB migration)
- Option for desired items D1–D3 as change requests

---

## 5. Build the Capabilities Deck

**File:** `proposal/capabilities-deck.html`

**Objective:** Visual presentation of 10–15 slides, self-contained in a single HTML file.

**Suggested structure:**
1. Cover — firm name + engagement title
2. Meridian's problem (in 3 bullets)
3. Our approach (R1→R4 in one slide)
4. R1 — Reports remediation: what we will do
5. R2 — Restocking view: how it will work
6. R3 — Testing: coverage plan
7. R4 — Architecture docs
8. Phased timeline (visual)
9. Why us (relevant experience)
10. Next steps

**Technical notes:**
- Navigable with arrow keys / anchor `#1`, `#2`… like today's Anthropic deck
- Style: dark or light background, large serif, accent color, clean layout
- Open in the browser as soon as generated, then ask what to change and iterate at least once

**Useful prompt:**
```
Generate proposal/capabilities-deck.html: a 10-slide self-contained HTML deck to respond
to Meridian Components' RFP. Navigable via arrow keys. Professional style, dark background,
serif font, orange accent. Content based on executive-summary.md and technical-approach.md.
```

**PPTX option** (if a shareable file is needed):
```
Convert the deck to proposal/capabilities-deck.pptx using python-pptx.
```

---

## Act 1 completion checklist

- [ ] RFP read and requirements separated (R vs D)
- [ ] Ambiguities identified
- [ ] Client background researched (`meridian-background.md` + `vendor-handoff.md`)
- [ ] Clarifying questions written + assumptions defined
- [ ] `proposal/executive-summary.md` written and reviewed
- [ ] `proposal/technical-approach.md` written and reviewed
- [ ] `proposal/timeline.md` written and reviewed
- [ ] `proposal/pricing.md` written and reviewed
- [ ] `proposal/capabilities-deck.html` generated, opened in browser, iterated at least once
- [ ] Transition to Act 2 — *"We won the bid. Now it's hands on keyboard."*

---

## Implicit lesson of Act 1

Each step in this act demonstrates a collaboration technique with Claude:
- **Read + analyze** → Claude as research partner
- **Clarifying questions** → Claude using the `AskUserQuestion` tool to simulate the client
- **Write section by section** → collaboration loop (Brief → Draft → Review → Refine)
- **Plan Mode before the Technical Approach** → alignment before producing
- **Capabilities deck** → Claude generating visual artifacts and iterating on feedback
