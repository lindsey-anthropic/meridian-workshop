# Negotiation Strategy — Deep Stakeholder Playbook

**RFP #MC-2026-0417 — Meridian Components, Inc.**
*Internal document — not submitted with proposal*

---

## Strategic Overview

### The Political Landscape

Meridian is not a single buyer — it is a coalition of three distinct power centres with partially overlapping and partially conflicting interests:

| Stakeholder | Role | What They Fear | What They Want |
|---|---|---|---|
| **J. Okafor** (Procurement) | Formal buyer, owns vendor selection | Picking the wrong vendor again; being blamed | Predictable price, defensible decision, clean handoff |
| **R. Tanaka** (VP Operations) | Champion, real user | Another half-delivered engagement; her team's frustration | Features that work; being heard; not managing workarounds |
| **IT (unnamed)** | Gatekeeper | Something breaking in production; being overruled | Control, safety net, documented changes |
| **Tokyo warehouse team** | End users (silent stakeholders) | System that doesn't fit their workflow or language | Precision, trust, usability in native language |

**The coalition dynamic:** IT is blocking everything. Tanaka has the political will to push things through, but needs IT's sign-off. Okafor needs both of them aligned before he can award a contract. The vendor who makes IT comfortable *first* wins the political battle, which is why Phase 1 (tests + architecture) is the strategic opening move — not a warmup.

**The previous vendor problem:** Every single objection will be coloured by the previous vendor's failure. "You all say this" is the unspoken background noise in every conversation. Our job is to be *structurally* different — not just to say we're different.

---

## Stakeholder 1: J. Okafor — Director of Procurement

### Who He Is

Okafor's job is to select a vendor and defend that selection to Meridian leadership. His published criteria (40% technical / 25% experience / 20% timeline / 15% price) tell you what he says he cares about. What he *actually* cares about is not being in a meeting six months from now explaining why he picked another vendor that didn't deliver.

He is a process-oriented professional. He issued a formal RFP with numbered requirements, response sections, and submission deadlines. He expects vendors to follow the format and respond to what was asked — not what they wish had been asked.

He is unlikely to be the most technically fluent person in the room. He will rely on IT to validate technical claims. He will rely on Tanaka to validate operational value. His job is to synthesize those inputs and make the call.

### What He Will Read Most Carefully

1. The pricing section — specifically whether the fee structure has hidden exposure
2. The timeline — whether it's credible and what the checkpoints are
3. The experience section — does this vendor have a track record with similar scope?
4. Assumptions and exclusions — what are we *not* responsible for?

### Anticipated Questions from Okafor

**Q: "How do you guarantee delivery on the timeline you've proposed?"**

> *"We don't use the word 'guarantee' — and any vendor who does should concern you. What we do offer is a fixed-fee structure where you're not exposed to cost overruns, phase-gated delivery so you can stop before the next phase if you're not satisfied, and a defect register published in Phase 1 so there are no scope surprises. The timeline is based on our review of the actual codebase, not estimates from documentation."*

**Q: "Your price is $X higher than another bid we received. Why should we pay more?"**

> *"Two things. First: the previous vendor presumably wasn't your highest bid either. Price and delivery are not correlated in this market. Second: our $71K is a not-to-exceed ceiling across all four required items. If another bid is lower but T&M, your actual cost could exceed ours by the time the engagement closes. We're happy to compare structures on paper if you can share the competing proposal format."*

**Q: "What happens if you find more defects in the Reports module than the eight documented in the RFP?"**

> *"Our Phase 2 fixed fee covers all defects found during audit — not just eight. We built that into the price deliberately because we know inherited codebases are never exactly as documented. If we find twelve issues, we fix twelve. No change order."*

**Q: "Can we break this into smaller phases to reduce our commitment?"**

> *"Absolutely — that's already how we've structured it. You authorize Phase 1 at $18,500. At the end of Week 2, you review the architecture doc, the test suite, and the defect register. If you're not satisfied, you don't authorize Phase 2. You've spent $18,500 and have a test suite and an architecture document — two deliverables with real ongoing value regardless of whether we continue."*

**Q: "What if Meridian's needs change mid-engagement?"**

> *"Scope changes are handled as change orders — we define what's added, what it costs, and what it does to the timeline. We never absorb scope silently, and we never refuse to discuss changes. We just make sure both parties understand the tradeoff before we commit."*

**Q: "Can you give us references from similar engagements?"**

> *"Yes — we've listed four comparable engagements in the experience section with scope, stack, and outcome. We can provide references for any or all of them. We'd specifically recommend speaking with the operations lead from Engagement 1 — the stakeholder dynamic there (IT blocking, ops frustrated, inherited defects) maps almost exactly to Meridian's situation."*

**Q: "What's your approach to knowledge transfer at the end of the engagement?"**

> *"R4 (architecture documentation) is explicitly designed for handoff — it's written for Meridian IT, not for a technical pitch. We also document everything we change in the code with clear comments and PR descriptions. At the close of the engagement, we offer a 2-hour walkthrough session with your IT team. This is included in the Phase 3 fee."*

### Objection Handling — Okafor

| Objection | Our Response |
|---|---|
| "We need a shorter timeline — 6 weeks, not 8." | "We can compress to 6 weeks by removing the buffer weeks and adding a second engineer to Phase 3. Cost increases by ~$6K. We recommend against it — the buffer is there because stakeholder review cycles (IT, Tanaka) take time we can't control. But it's your call." |
| "Can you start sooner?" | "We can start within 1 week of contract signing. We maintain a 1-week onboarding slot. Beyond that, we can't hold the slot without a signed contract — resource commitments have to be made." |
| "We want a T&M structure so we can reduce scope." | "We understand the instinct, but T&M shifts risk to you — if the codebase is messier than expected (which inherited codebases often are), you absorb the cost. Our fixed-fee structure absorbs that risk. If you want to reduce total spend, the cleanest path is to defer Phase 4 (D1–D3), not to switch to T&M on Phases 1–3." |
| "Other vendors have more team members available." | "Team size is not a delivery metric. Two experienced engineers who know this stack will outperform five generalists who are learning it. We're not staffing a body shop — we're running an engagement." |

### Closing with Okafor

Okafor needs one thing above all: a defensible decision. Give it to him explicitly.

> *"Mr. Okafor, if you select us and this engagement delivers on schedule, you've done exactly what your process is designed to do. If there's a reason to be cautious, it's already documented in our proposal — the risk register, the assumptions, the exclusions. There are no hidden traps. That's how we operate."*

---

## Stakeholder 2: R. Tanaka — VP Operations

### Who She Is

Tanaka is the most important person in this deal, even though she is not the formal buyer. She is the one whose team will use the system daily. She is the one who knows where the bodies are buried in the existing dashboard. She is the one who has been waiting for the Restocking feature since before the previous vendor left.

She is frustrated. Not just with the vendor — with the situation. She has been the internal champion for improvements that haven't come. Her team has developed workarounds that they shouldn't need. Every passing month without the Restocking view is a month her team is doing manually what the system should do for them.

She respects directness and competence. She has heard too many vendor pitches that didn't survive contact with the actual work. What she wants is someone who has looked at the codebase, understands the problem, and doesn't bullshit her.

### What She Will Test You On

- Do you understand what the Reports module is actually doing wrong? (Not just "filter defects" — can you describe them specifically?)
- Do you have a realistic model of what the Restocking feature needs to do, or have you just restated the RFP?
- Will you involve her team before you ship, or surprise them at delivery?
- Are you going to disappear after sign-off like the last vendor did?

### Anticipated Questions from Tanaka

**Q: "The previous vendor said all the same things. What makes you different?"**

> *"The previous vendor's handoff document is two pages and doesn't reflect what's actually in the codebase. We read both — the docs and the code. The Reports view has filter state that's not connected to the API calls. The i18n composable is implemented in some views and hardcoded in others — inconsistently. The API patterns aren't uniform. None of that is in the vendor handoff. We know because we looked. That's the difference."*

**Q: "Walk me through how the Restocking feature would actually work for my team."**

This is the most important question she will ask. Have a concrete answer:

> *"Your team opens the Restocking view. There's a budget ceiling input at the top — you type in, say, $50,000. The system looks at every SKU across your three warehouses, compares current stock to reorder point, and weights that by demand trend from the forecast data. It produces a ranked table: at the top, the SKUs most urgently below their reorder threshold with increasing demand. Each row shows current qty, recommended order qty, estimated cost, and a badge — Critical, Warning, or Watch. You can filter by warehouse. You can click 'Create Purchase Order' on any row, fill in supplier and delivery date, and it's logged. You can export the whole thing to CSV. The budget ceiling filters the list so you're only looking at what you can actually afford this cycle."*

> *"Before we build any of that, I want to spend 30 minutes with you validating the ranking logic. You know how your team actually decides what to restock. If our algorithm doesn't match your operational intuition, we need to know that in Week 5, not Week 8."*

**Q: "How do you handle the fact that my team already has workarounds they've built up? They might resist a new workflow."**

> *"We'd like to know what those workarounds are. Specifically — if your team is exporting data to a spreadsheet to do analysis the dashboard doesn't support, that's a feature gap we can address. If they've built habits around the broken Reports filters, we want to make sure the fixed version doesn't surprise them. The mid-point demo in Week 6 is designed exactly for this — so your team can react before the feature is finished."*

**Q: "The Reports module has been broken for months. Why will it take two weeks to fix?"**

> *"It won't take two weeks to fix — it'll take two weeks including the audit. We need to enumerate every defect before we fix any of them, because fixing filter #1 without understanding filters #2 through #8 can make things worse. The actual fix work is about 6 days. The rest is test writing and verification. We're not going slow — we're going deliberately."*

**Q: "What about the London warehouse? Is anything broken there?"**

> *"Our audit will cover all three warehouses. The RFP flags the Reports module specifically, but we'll note any issues we find in other views during the Phase 1 audit. If London-specific issues surface, we'll include them in the defect register and price any out-of-scope fixes as options before touching them."*

**Q: "How do I know you won't deliver something that technically works but my team hates?"**

> *"Three things. One: the Restocking algorithm gets validated with you before we build the UI. Two: your team gets a working build to react to in Week 6, not a final demo in Week 8. Three: if your team has feedback after Phase 3 delivery, we don't close the ticket. We fix it. A technically delivered feature that operations doesn't use is not a delivery."*

**Q: "What's your process for bug reports after the engagement ends?"**

> *"We offer a 30-day post-delivery support window included in Phase 3. Any defect in delivered functionality is fixed at no charge during that window. After 30 days, we're available for a retainer or a new statement of work. We won't disappear."*

### Objection Handling — Tanaka

| Objection | Our Response |
|---|---|
| "We need the Restocking feature before the Reports fix — R2 is more urgent for my team." | "Understood. We can technically sequence it that way, but here's the risk: the Restocking view needs the demand and inventory data to work correctly. If the existing data APIs have defects — which we believe they do — we'd be building on a broken foundation. Our recommendation is the current sequence, but we can discuss if there's a specific operational deadline driving R2 urgency." |
| "I want to be involved in every sprint, not just milestone demos." | "Done. We'll add you to the project channel and share a weekly written update every Friday — what was built, what's blocked, what's next. If you want to jump on a call any week, we're available. We don't manage clients out of the project." |
| "Can we add [feature X] to the Restocking view while you're in it?" | "Let's write it down right now. If it's within the spec we've agreed to, we'll include it. If it's additive, we'll estimate it honestly — usually a few hours to a day for incremental UI features — and you decide whether to add it. We never say no to a conversation, and we never add scope without telling you what it costs." |
| "I'm not sure the budget ceiling concept works for how we actually buy." | "Tell me how you actually buy. The budget ceiling is our default model, but if your purchasing process is category-based, or per-supplier, or per-warehouse, we can adjust the algorithm. This is exactly the Week 5 conversation — your operational model drives the feature design, not the other way around." |

### Building Tanaka's Trust Before the Contract

The highest-impact action before contract signing: **ask Tanaka one specific question about the Restocking feature** in the pre-award conversation.

> *"We have one question before we finalize the spec for R2: when your team decides to restock a SKU, do they primarily look at the reorder point, the demand forecast, or the days-of-stock-remaining? The answer changes how we weight the ranking algorithm."*

This demonstrates that you've read the codebase (you know what data exists), you've thought about the feature beyond the RFP description, and you're treating her as the domain expert she is. It will stand out.

---

## Stakeholder 3: IT (Unnamed)

### Who They Are

IT is a gatekeeper with legitimate concerns and a track record of being right. Changes were made to this system before without tests, and something broke. They put their foot down. That was the correct call.

They are not obstructionist — they are cautious. They will respond well to structure, documentation, and evidence. They will not respond well to "trust us" or to being asked to approve something they don't understand.

They are likely understaffed and responsible for more systems than just this dashboard. Anything that requires ongoing IT maintenance needs to be simple, documented, and handed over with a working runbook.

The key insight: **IT doesn't need to love the feature — they need to feel safe about the change.** Those are different problems.

### What IT Will Focus On

- Can they run the tests themselves without vendor help?
- Do they understand what was changed and why?
- Are there any security or dependency issues they'll inherit?
- Will they be able to maintain this without calling us every time something breaks?

### Anticipated Questions from IT

**Q: "How do we run the tests ourselves?"**

> *"One command: `npm run test:e2e`. It runs the full Playwright suite against localhost:3000. Output is pass/fail with a summary. We'll also add a GitHub Actions configuration so if you set up CI, it runs automatically on every PR. The README in the `tests/` directory has step-by-step instructions for a new team member who has never run Playwright before."*

**Q: "What if the tests are brittle and break on unrelated changes?"**

> *"Good question — brittle tests are worse than no tests. We write tests against user-visible behaviour, not implementation details. We don't select elements by CSS class or internal component state — we use `data-testid` attributes and semantic HTML roles. If a test breaks when you change a colour, that's a badly written test. We write tests that break when behaviour changes."*

**Q: "How do we know what you changed and why?"**

> *"Every change ships as a pull request with a clear description: what was broken, what we changed, how to verify the fix. The defect register (delivered at end of Phase 1) has a line for every issue. When Phase 2 is done, every line in the defect register links to a PR. You can trace every change back to a reason."*

**Q: "There are npm vulnerabilities flagged in the frontend. Are those your problem or ours?"**

> *"We'll categorize them during Phase 1 audit. Vulnerabilities in development-only dependencies (like Vite itself) don't affect production behaviour. Vulnerabilities in runtime dependencies that are exploitable in a browser context we will fix as part of Phase 1. We'll give you a written assessment of each flagged package so you can make an informed decision."*

**Q: "The architecture says it uses in-memory data. What happens when the server restarts?"**

> *"Data resets to the mock JSON files on restart — this is by design for the current system. The RFP scope does not include adding a database. If Meridian wants data persistence, that's a separate engagement. We'll document this clearly in the architecture doc so there's no ambiguity about what the system does and doesn't do."*

**Q: "Can we review every PR before it's merged to main?"**

> *"Yes. We will not merge anything to main without a PR. If you want to be a required reviewer on the repo, we'll set that up in Week 1. Every change goes through review. That's not a concession — it's how we work."*

**Q: "What if we find a bug after the engagement ends? Who fixes it?"**

> *"Phase 3 includes a 30-day warranty period — any defect in delivered functionality is fixed at no charge. After 30 days, we offer a retainer option. We'll also make sure the architecture documentation and test suite are thorough enough that a competent developer Meridian hires independently could make fixes without us."*

**Q: "Who has access to the production system during the engagement?"**

> *"We need read access to the codebase (git) and localhost access for testing. We don't need and won't request direct production server access. All changes go through your review process before deployment. We can define this formally in the contract if that's helpful."*

### Objection Handling — IT

| Objection | Our Response |
|---|---|
| "We don't want to approve the Playwright MCP server connection — security policy." | "Understood. Playwright in MCP mode is only used for local development and test writing. It doesn't have network access to production. If your policy requires it, we can write all Playwright tests using the CLI (`npx playwright test`) without MCP, with identical results. We'll do whatever fits your security posture." |
| "We need to review the architecture doc before we can authorize Phase 2." | "We built that review into the schedule. Phase 1 ends with the architecture doc and a sign-off session. Phase 2 authorization requires your explicit approval. You're not being rushed." |
| "We're concerned about the Vue Options API / Composition API inconsistency." | "It's a real issue — the previous vendor left the migration incomplete. We'll note every Options API component in the defect register. For R1 (Reports), we'll migrate the Reports view to Composition API as part of the remediation. We won't migrate all views in one go — that's unnecessary risk. We'll do it progressively, one view at a time, with tests covering each migration." |
| "We don't have time to review every PR." | "Then assign one IT person as the repo reviewer and set a 48-hour SLA for review. We'll time our work to batch PRs at natural breakpoints (end of sprint) so reviews happen in a predictable rhythm, not continuously." |

### Winning IT Before the Contract

Send IT the architecture doc draft (or an outline of what it will contain) during the pre-award period. This is unusual — most vendors don't produce documentation before contract. Doing so signals:
- We've already done the work
- We understand what IT needs
- The documentation is real, not vaporware

A one-page draft architecture overview shared before contract signing will differentiate you more effectively than any pitch deck.

---

## Stakeholder 4: Tokyo Warehouse Team (Silent Stakeholders)

### Who They Are

Twelve people who have been opening an English-only (or broken-Japanese) dashboard every day since 2023. They are the people for whom D2 (i18n) exists, but they are almost certainly not part of the formal procurement process. They may have no direct voice in vendor selection.

However: Tanaka knows them. If the Tokyo team's needs are dismissed or superficially addressed, Tanaka will know — and it will affect her confidence in the vendor, even if she doesn't say so directly.

In Japanese professional culture, the Tokyo team will not complain openly about a bad localization. They will use the English version and not say anything. This is the failure mode — silent non-adoption is invisible until it causes an operational problem.

### Japanese Cultural Dynamics — Full Depth

**Wa (和) — Harmony and Group Consensus**

The Tokyo team will not advocate openly for their own needs in a mixed (Tokyo + HQ) setting. They will say things are fine when they are not, to preserve group harmony. We cannot rely on them to surface problems — we must create structured, private, low-pressure channels where concerns can emerge without face risk.

*Practical implication:* The i18n review process must be async, not live. A live call where an SF-based project manager asks "Is the Japanese translation correct?" puts Tokyo team members in an impossible position — they cannot critique it without creating awkwardness. An async email with specific questions ("We used バックオーダー for 'Backordered' — does your team use this term, or a different one?") gives them space to respond thoughtfully and privately.

**Nemawashi (根回し) — Consensus Before the Meeting**

Formal decisions in Japanese organizations are announced in meetings — they are decided in the conversations before the meeting. If we send the Japanese locale file to the full team for a group review call, we will get polite agreement regardless of actual quality. Instead:

*Step 1 (Week before formal review):* Share the draft `ja.json` with 1–2 trusted senior Tokyo team members via email. Ask specific questions about terminology. Incorporate their feedback.

*Step 2 (Formal review):* Present the revised locale file. Because the senior members have already seen and approved it, the group will follow. The formal review becomes a confirmation.

This is not manipulation — it is how respectful consultation works in this cultural context.

**Ringi (稟議) — Hierarchical Approval**

Even if individual team members approve the locale, the Tokyo warehouse manager may need to consult with a senior in the Tokyo hierarchy before formally confirming. Build 5–7 business days of buffer into the D2 review cycle. Never follow up before the agreed deadline — doing so signals distrust and creates pressure that damages the relationship.

**Precision Culture and Quality (品質, 正確さ)**

A single incorrect or awkward phrase in the Japanese UI is not a small thing — it is evidence of insufficient care. Japanese professionals work with high attention to detail and expect the same from their tools. The standard for Japanese business software localization is high.

Specifically:

| Term | Wrong (literal) | Right (logistics standard) |
|---|---|---|
| Backordered | 在庫切れ注文 (literal) | バックオーダー (industry standard) |
| Reorder Point | 再注文ポイント (literal) | 発注点 (standard warehouse term) |
| Purchase Order | 購買注文 (generic) | 発注書 (correct logistics term) |
| Out of Stock | 在庫なし (casual) | 欠品 (warehouse/logistics term) |
| Pending | 保留中 (vague) | 処理待ち (operational clarity) |
| Delivered | 配達済み (consumer) | 納品済み (business-to-business) |

Using consumer-facing or literal translations in a B2B warehouse operations context signals unfamiliarity with the domain. Using correct logistics terminology signals exactly the kind of professional competence that builds trust.

**Error Message Register**

Japanese error messages must not be blunt. Compare:

- ❌ English pattern applied to Japanese: `エラー: データが見つかりません`
- ✅ Correct Japanese register: `申し訳ありません。データの読み込みに失敗しました。もう一度お試しください。`

The correct version apologizes (申し訳ありません), states what happened (データの読み込みに失敗しました), and offers a path forward (もう一度お試しください). This is not over-engineering — it is the minimum expected register for business software.

**Omotenashi (おもてなし) — Anticipating Needs**

The Tokyo team has not been asked what they need. No one from the previous vendor apparently did. The act of asking — specifically, thoughtfully, in Japanese — is itself a differentiator.

*Before the engagement begins:* Send a brief email (in Japanese) to the Tokyo warehouse manager introducing the project and asking two specific questions:
1. Which terms does your team use on the floor for [key logistics terms]?
2. Are there any displays or workflows in the current system that create particular confusion for your team?

This email will likely generate substantive responses that inform the D2 work. More importantly, it signals to the Tokyo team that they are being treated as domain experts rather than translation reviewers.

### Anticipated Concerns from Tokyo Team (Surfaced Through Tanaka)

**Concern: "Our team has gotten used to the English version. Switching might be disruptive."**

> *"That's a real concern. We'll make the language switcher the user's choice — defaulting to browser language but always switchable. No one is forced into Japanese mode. The Tokyo team can adopt it at their own pace, and we'll make sure the Japanese version is good enough that they want to."*

**Concern: "Machine translations have caused problems before — we don't trust automated translations."**

> *"We don't use machine translation for production copy. Every Japanese string in the locale file will be reviewed by a human with business Japanese fluency before it goes in. And the Tokyo team reviews the file before it ships. If they change anything, we implement it — no discussion."*

**Concern: "Some Tokyo team members prefer English for technical terms — can they keep that?"**

> *"Yes. Japanese technical writing commonly uses katakana loanwords for technical terms (バックオーダー, フィルター, etc.) precisely because they're more familiar in technical contexts than native Japanese equivalents. We'll use the same approach — native Japanese where natural, katakana loanwords where the term is more recognizable that way. The Tokyo team review will validate these choices."*

---

## Pre-Negotiation: Clarifying Questions as Anchors

Submit before the proposal deadline. Their answers become scope assumptions that anchor our framing.

| # | Question | Strategic Purpose |
|---|---|---|
| 1 | What budget ceiling should the Restocking recommendations engine use as its default maximum? Is this per-warehouse or across all warehouses? | Anchors R2 scope; reveals whether Tanaka's team has a real budget figure or needs us to design the parameter |
| 2 | Which user flows does IT consider "critical" for R3 browser test coverage? Do they have a list, or should we define it? | If IT defines it, we write tests they'll accept. If we define it, we own the standard. Either way, it's documented before work begins. |
| 3 | What does "current standards" mean for D1 (UI modernization)? Does Meridian have a brand guide, color palette, or design system we should align with? | Scopes D1 and surfaces whether it's cosmetic or substantive work |
| 4 | Is there a Tokyo-side representative who should be included in the D2 (i18n) review process? Who should we contact? | Surfaces the Tokyo stakeholder; gives us a direct contact for nemawashi |
| 5 | The previous vendor's handoff notes mention that some views still use the Vue Options API and that the migration was incomplete. Is full migration to Composition API in scope, or just the affected views? | Scopes a significant technical decision before we price it |

---

## Price Negotiation Tactics

### If They Push Back on Total Price

**Don't discount Phase 3.** That's where the value is. If they need to reduce spend:

**Option A — Defer Phase 4:**
> *"Let's confirm Phases 1–3 at $71K and revisit Phase 4 after delivery. You'll have a working, tested system in 8 weeks. Phase 4 can be a separate statement of work when budget is available."*

**Option B — Reduce Phase 4 scope:**
> *"If budget is constrained, D3 (dark mode) is the cleanest item to defer — it's a CSS-only change that won't affect any other feature. D1 and D2 have more operational impact for Tanaka's team and the Tokyo office."*

**Option C — Compress with cost tradeoff:**
> *"We can cut 1 week from Phase 3 by adding a second frontend engineer at +$6K. If timeline is the constraint, this is the lever. If total spend is the constraint, we hold the current plan."*

### If a Competitor Comes in Lower

Don't match. Don't apologize. Anchor on structural difference:

> *"We'd ask you to compare the structures, not just the numbers. If the lower bid is T&M, your actual cost depends on how long it takes — and inherited codebases routinely take longer than estimated. Our $71K is the ceiling. Which number are you comparing?"*

If the competitor is fixed-fee at a lower number:

> *"Then the question is what's in and what's out. Walk me through what they've included. The most common place bids get trimmed is test coverage and documentation — which are exactly the things your IT team needs to approve changes going forward. We're happy to do a scope comparison."*

---

## Red Lines — Non-Negotiable

1. **No test coverage before production changes.** If they want to skip Phase 1, we decline. This is professional standards, not a negotiating position.

2. **No T&M on Phase 3 (Restocking feature).** Too much scope ambiguity. Fixed-fee or a formally defined spec with a capped T&M.

3. **No skipping stakeholder validation sessions.** The Tanaka algorithm validation (Week 5) and mid-point demo (Week 6) are in the contract. If Meridian wants to waive them, we explain the risk and document their waiver in writing — we don't silently remove them.

4. **No machine translation for ja.json.** If Meridian pushes back on human-reviewed Japanese, we explain why it matters. If they insist on machine translation, we add a disclaimer to the deliverable that the locale has not been validated by a native speaker and recommend a future review.

5. **No merger of IT review into a single final demo.** IT needs to see changes incrementally — specifically the architecture doc before Phase 2 begins. A "big reveal" at the end is how the previous vendor operated. We don't do that.

---

## Opening, Target, and Walk-Away

| Item | Opening | Target | Walk-Away |
|---|---|---|---|
| Phase 1–3 total | $71,000 (fixed) | $71,000 | $63,000 (10% flex, absorb by reducing Phase 1 to 2 deliverables; defer defect register to Phase 2 start) |
| Phase 4 package | $24,000 | $22,000 | $19,500 (reduce D1 scope to colour tokens + typography only) |
| Payment terms | Net-30 | Net-30 | Net-45 |
| Start date | 2 weeks post-signing | 2 weeks | 4 weeks (flag that resource slot cannot be held beyond 3 weeks without deposit) |
| Post-delivery warranty | 30 days included | 30 days | 14 days (below 14, we add a support retainer line item instead) |

---

## Closing Moves

### Closing with the Buying Committee (Okafor + Tanaka + IT)

Offer a **no-cost pre-contract kickoff call** (45 min):

> *"Before you make a final decision, we'd like 45 minutes with your IT rep and Tanaka — just to walk through our approach and let them ask questions directly. No cost, no obligation. If after that call you're not confident, we part ways as friends. We'd rather you make the right decision than the fast one."*

This call almost always closes the deal. It demonstrates confidence, builds direct trust with IT and Tanaka, and surfaces any final concerns before they become post-award problems.

### Closing with Tanaka (Direct)

> *"Ms. Tanaka, I have one ask before we conclude. When your team opens the Restocking view for the first time, what would make you feel like we got it right? Not the technical spec — what would your team say to each other?"*

This question signals that you care about the human outcome, not just the contract deliverable. Her answer will tell you exactly what to optimize for in Phase 3 — and she will remember that you asked.

### Closing with the Tokyo Dimension

Send a brief, personal email in Japanese to the Tokyo warehouse manager before contract signing. Three to four sentences. Polite teineigo register. Something like:

> 「株式会社メリディアン東京チームの皆様のために、より使いやすいシステムを構築することを楽しみにしております。まず皆様がどのような言葉・表現を普段お使いかをお聞きしたく、近日中にご連絡させていただければ幸いです。何卒よろしくお願い申し上げます。」

*(Translation: "We look forward to building a system that is easier for the Meridian Tokyo team to use. We would like to first learn what terms and expressions your team uses day-to-day, and we hope to reach out soon. We look forward to working with you.")*

This gesture — reaching out in Japanese, before the contract is signed — is extremely difficult for a competitor to match. It demonstrates cultural fluency, treats Tokyo as a first-class stakeholder, and builds the relationship that will make the D2 review go smoothly.

> **Core closing principle:** In Western deals, you win on logic. In cross-cultural deals, you win on trust. Logic closes Okafor. Competence and directness close Tanaka. Structure and documentation close IT. Respect and precision close Tokyo.
> 
> **You need all four.**
