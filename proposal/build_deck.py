#!/usr/bin/env python3
"""Generate capabilities-deck.pptx — Northbeam x Meridian (dark boardroom theme).

Mirrors proposal/capabilities-deck.html. Run with python-pptx installed.
"""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml.ns import qn

# ---- Theme tokens -------------------------------------------------------------
BG       = RGBColor(0x0A, 0x0F, 0x1E)   # dark navy
PANEL    = RGBColor(0x10, 0x1A, 0x33)   # card surface
PANEL_2  = RGBColor(0x0E, 0x17, 0x30)
LINE     = RGBColor(0x1E, 0x2A, 0x47)
INK      = RGBColor(0xE8, 0xEE, 0xFC)   # primary text
INK_SOFT = RGBColor(0xB8, 0xC4, 0xDE)
MUTED    = RGBColor(0x7E, 0x8C, 0xAB)
BRAND    = RGBColor(0x3B, 0x82, 0xF6)   # royal blue
BRAND2   = RGBColor(0x06, 0xB6, 0xD4)   # cyan
OK       = RGBColor(0x34, 0xD3, 0x99)
TAGBG    = RGBColor(0x16, 0x2A, 0x4D)

FONT = "Calibri"

# 16:9
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
SW, SH = prs.slide_width, prs.slide_height
BLANK = prs.slide_layouts[6]


def slide():
    s = prs.slides.add_slide(BLANK)
    bg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SW, SH)
    bg.fill.solid(); bg.fill.fore_color.rgb = BG
    bg.line.fill.background()
    bg.shadow.inherit = False
    # send to back
    sp = bg._element
    sp.getparent().remove(sp)
    s.shapes._spTree.insert(2, sp)
    return s


def _set_font(run, size, color, bold=False, italic=False):
    run.font.size = Pt(size)
    run.font.color.rgb = color
    run.font.bold = bold
    run.font.italic = italic
    run.font.name = FONT


def textbox(s, x, y, w, h, lines, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
            space_after=6, line_spacing=1.0):
    """lines: list of list-of-(text, size, color, bold, italic) segments (each list = paragraph)."""
    tb = s.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    for i, segs in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(space_after)
        p.space_before = Pt(0)
        p.line_spacing = line_spacing
        for (text, size, color, bold, italic) in segs:
            r = p.add_run(); r.text = text
            _set_font(r, size, color, bold, italic)
    return tb


def card(s, x, y, w, h, fill=PANEL, border=LINE, border_w=1.0):
    c = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    c.adjustments[0] = 0.06
    c.fill.solid(); c.fill.fore_color.rgb = fill
    c.line.color.rgb = border; c.line.width = Pt(border_w)
    c.shadow.inherit = False
    return c


def tag(s, x, y, text, w=Inches(1.4)):
    t = s.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, Inches(0.34))
    t.adjustments[0] = 0.5
    t.fill.solid(); t.fill.fore_color.rgb = TAGBG
    t.line.color.rgb = BRAND; t.line.width = Pt(0.75)
    t.shadow.inherit = False
    tf = t.text_frame; tf.word_wrap = False
    tf.margin_top = Pt(1); tf.margin_bottom = Pt(1)
    p = tf.paragraphs[0]; p.alignment = PP_ALIGN.CENTER
    r = p.add_run(); r.text = text
    _set_font(r, 10, RGBColor(0xCF, 0xE2, 0xFF), bold=True)
    return t


def brand_dot(s, x, y):
    d = s.shapes.add_shape(MSO_SHAPE.DIAMOND, x, y, Inches(0.22), Inches(0.22))
    d.fill.solid(); d.fill.fore_color.rgb = BRAND
    d.line.fill.background(); d.shadow.inherit = False


def eyebrow(s, text, x=Inches(0.9), y=Inches(0.7)):
    textbox(s, x, y, Inches(11), Inches(0.4),
            [[(text.upper(), 13, BRAND2, True, False)]])


def heading(s, segs, x=Inches(0.9), y=Inches(1.15), size=30, w=Inches(11.5)):
    """segs: list of (text, color) -> single paragraph heading with mixed color."""
    tb = s.shapes.add_textbox(x, y, w, Inches(1.4))
    tf = tb.text_frame; tf.word_wrap = True
    p = tf.paragraphs[0]; p.line_spacing = 1.05
    for (text, color) in segs:
        r = p.add_run(); r.text = text
        _set_font(r, size, color, bold=True)
    return tb


# COLUMN HELPERS ---------------------------------------------------------------
def three_cols(s, items, top=Inches(2.5), h=Inches(2.7)):
    margin = Inches(0.9); gap = Inches(0.4)
    total_w = SW - margin * 2
    cw = int((total_w - gap * 2) / 3)
    for i, (tg, title, body) in enumerate(items):
        x = margin + i * (cw + gap)
        card(s, x, top, cw, h)
        tag(s, x + Inches(0.3), top + Inches(0.3), tg, w=Inches(1.7))
        textbox(s, x + Inches(0.3), top + Inches(0.8), cw - Inches(0.6), Inches(0.6),
                [[(title, 16, INK, True, False)]])
        textbox(s, x + Inches(0.3), top + Inches(1.35), cw - Inches(0.6), h - Inches(1.5),
                [[(body, 12.5, MUTED, False, False)]], line_spacing=1.15)


def two_cols(s, items, top=Inches(2.5), h=Inches(2.3)):
    margin = Inches(0.9); gap = Inches(0.4)
    total_w = SW - margin * 2
    cw = int((total_w - gap) / 2)
    for i, (tg, title, body) in enumerate(items):
        x = margin + i * (cw + gap)
        card(s, x, top, cw, h)
        tag(s, x + Inches(0.3), top + Inches(0.3), tg, w=Inches(1.7))
        textbox(s, x + Inches(0.3), top + Inches(0.8), cw - Inches(0.6), Inches(0.5),
                [[(title, 17, INK, True, False)]])
        textbox(s, x + Inches(0.3), top + Inches(1.3), cw - Inches(0.6), h - Inches(1.4),
                [[(body, 13, MUTED, False, False)]], line_spacing=1.15)


# ============================== SLIDES ========================================

# 1 — Title
s = slide()
brand_dot(s, Inches(0.9), Inches(0.95))
textbox(s, Inches(1.25), Inches(0.9), Inches(10), Inches(0.4),
        [[("NORTHBEAM", 14, INK, True, False), ("   ·   Capabilities Presentation", 14, MUTED, False, False)]])
eyebrow(s, "RFP MC-2026-0417", y=Inches(2.2))
heading(s, [("Modernizing Meridian's ", INK)], y=Inches(2.65), size=42)
heading(s, [("Inventory Dashboard", BRAND2)], y=Inches(3.5), size=42)
textbox(s, Inches(0.9), Inches(4.7), Inches(9.5), Inches(1.3),
        [[("A plan to restore trust in the system your operations team uses every day — "
           "and to extend it with the capability they've been waiting for.", 18, INK_SOFT, False, False)]],
        line_spacing=1.25)
textbox(s, Inches(0.9), Inches(6.4), Inches(11), Inches(0.5),
        [[("Prepared for Meridian Components, Inc.  ·  Director of Procurement, J. Okafor", 12, MUTED, False, False)]])

# 2 — Understanding
s = slide()
eyebrow(s, "Our understanding")
heading(s, [("The real problem isn't one bug — it's ", INK), ("consistency and safe change", BRAND2)])
three_cols(s, [
    ("SYMPTOM", "Reports can't be trusted",
     "Built to a different standard than the rest of the dashboard: no filters, bypasses the shared data layer, leaks diagnostics, non-localized formatting."),
    ("CONSTRAINT", "Change is frozen",
     "With no automated tests, IT won't approve releases — which blocks every other improvement the team needs."),
    ("GAP", "Restocking doesn't exist",
     "The capability operations leadership most wants — budget-aware reorder guidance — was never started."),
])
textbox(s, Inches(0.9), Inches(5.6), Inches(11.5), Inches(0.8),
        [[("Fix the shape, not just the symptoms: ", 15, MUTED, False, False),
          ("restore consistency, make change safe, then extend.", 15, INK, True, False)]])

# 3 — Why us
s = slide()
eyebrow(s, "Why Northbeam")
heading(s, [("We've done all three — together, in the right order", INK)])
three_cols(s, [
    ("REMEDIATION", "Inherited systems",
     "We raise the weakest module to the standard of the best — without rewriting what already works."),
    ("UNBLOCKING", "Test-driven confidence",
     "We've turned “can't safely change it” into “change with confidence” for frozen, business-critical systems."),
    ("DELIVERY", "Budget-aware features",
     "We've shipped exactly this kind of demand-driven, budget-bounded recommendation tool."),
])
textbox(s, Inches(0.9), Inches(5.6), Inches(11.5), Inches(0.8),
        [[("Meridian needs all three at once, on one inherited codebase, without destabilizing it. ", 15, MUTED, False, False),
          ("That's our core competency.", 15, INK, True, False)]])

# 4 — The ask
s = slide()
eyebrow(s, "Scope of work · Meridian's priority order")
heading(s, [("Four required outcomes", INK)])
margin = Inches(0.9); gap = Inches(0.4)
cw = int((SW - margin * 2 - gap) / 2); ch = Inches(1.55)
asks = [
    ("R1", "Reports remediation", "Audit and resolve all defects — and bring Reports to full parity with the rest of the dashboard."),
    ("R2", "Restocking recommendations", "A new view that turns stock, demand, and a budget ceiling into actionable purchase orders."),
    ("R3", "Automated browser testing", "End-to-end coverage of critical flows so IT can safely approve future change."),
    ("R4", "Architecture documentation", "A current-state overview suitable for handoff to Meridian IT."),
]
for i, (tg, title, body) in enumerate(asks):
    col = i % 2; row = i // 2
    x = margin + col * (cw + gap); y = Inches(2.4) + row * (ch + Inches(0.3))
    card(s, x, y, cw, ch)
    tag(s, x + Inches(0.3), y + Inches(0.28), tg, w=Inches(0.95))
    textbox(s, x + Inches(1.4), y + Inches(0.28), cw - Inches(1.7), Inches(0.5),
            [[(title, 17, INK, True, False)]])
    textbox(s, x + Inches(0.3), y + Inches(0.85), cw - Inches(0.6), Inches(0.6),
            [[(body, 12.5, MUTED, False, False)]], line_spacing=1.1)
textbox(s, Inches(0.9), Inches(6.55), Inches(11.5), Inches(0.6),
        [[("Plus desired items — UI modernization, internationalization, dark mode — scoped as opt-in enhancements.", 13, MUTED, False, False)]])

# 5 — Approach / sequencing
s = slide()
eyebrow(s, "Our approach")
heading(s, [("We sequence the work to ", INK), ("de-risk it", BRAND2)])
steps = [
    ("01", "Document", "Architecture review (R4)"),
    ("02", "Test", "Coverage (R3) — make change safe"),
    ("03", "Remediate", "Reports (R1) — restore trust"),
    ("04", "Build", "Restocking (R2)"),
    ("05", "Enhance", "D1–D3 — opt-in"),
]
margin = Inches(0.9); n = len(steps); gap = Inches(0.25)
sw = int((SW - margin * 2 - gap * (n - 1)) / n); sy = Inches(2.9); shh = Inches(1.9)
for i, (num, t, d) in enumerate(steps):
    x = margin + i * (sw + gap)
    card(s, x, sy, sw, shh)
    textbox(s, x, sy + Inches(0.25), sw, Inches(0.35), [[(num, 12, BRAND2, True, False)]], align=PP_ALIGN.CENTER)
    textbox(s, x, sy + Inches(0.65), sw, Inches(0.45), [[(t, 15, INK, True, False)]], align=PP_ALIGN.CENTER)
    textbox(s, x + Inches(0.12), sy + Inches(1.15), sw - Inches(0.24), Inches(0.7),
            [[(d, 10.5, MUTED, False, False)]], align=PP_ALIGN.CENTER, line_spacing=1.1)
textbox(s, Inches(0.9), Inches(5.3), Inches(11.5), Inches(0.9),
        [[("Documentation and tests come ", 15, MUTED, False, False),
          ("first", 15, INK, True, False),
          (" — unknowns surfaced and a safety net in place before we change a line of production behavior.", 15, MUTED, False, False)]],
        line_spacing=1.2)

# 6 — R1
s = slide()
eyebrow(s, "R1 · Reports remediation")
heading(s, [("Raise the weakest module to the standard of the best", INK)])
textbox(s, Inches(0.9), Inches(2.2), Inches(11.3), Inches(0.7),
        [[("We reviewed the code: the backend reporting endpoints are sound, so the defects are concentrated in the frontend. We will —", 14, INK_SOFT, False, False)]],
        line_spacing=1.2)
checks = [
    "Restore filter parity with the rest of the dashboard",
    "Route through the shared data layer instead of hard-coded calls",
    "Remove diagnostic logging that reaches production",
    "Replace hand-rolled formatting with locale-aware output",
    "Align the module to the project's framework standard",
]
y = Inches(3.1)
for c in checks:
    textbox(s, Inches(1.0), y, Inches(11), Inches(0.5),
            [[("✓  ", 16, BRAND2, True, False), (c, 16, INK_SOFT, False, False)]])
    y += Inches(0.62)

# 7 — R2
s = slide()
eyebrow(s, "R2 · Restocking recommendations")
heading(s, [("From stock + demand + budget → ", INK), ("ranked purchase orders", BRAND2)])
flow = [
    ("INPUT", "Budget ceiling", "Operator sets the spend limit"),
    ("COMPUTE", "Reorder need", "Demand & reorder point vs. on-hand, by SKU"),
    ("RANK", "By urgency", "Costed using unit cost & trend"),
    ("OUTPUT", "Actionable POs", "Max coverage within budget"),
]
margin = Inches(0.9); n = len(flow); gap = Inches(0.3)
sw = int((SW - margin * 2 - gap * (n - 1)) / n); sy = Inches(2.8); shh = Inches(1.9)
for i, (num, t, d) in enumerate(flow):
    x = margin + i * (sw + gap)
    card(s, x, sy, sw, shh)
    textbox(s, x, sy + Inches(0.25), sw, Inches(0.35), [[(num, 11, BRAND2, True, False)]], align=PP_ALIGN.CENTER)
    textbox(s, x, sy + Inches(0.65), sw, Inches(0.45), [[(t, 15, INK, True, False)]], align=PP_ALIGN.CENTER)
    textbox(s, x + Inches(0.12), sy + Inches(1.15), sw - Inches(0.24), Inches(0.7),
            [[(d, 10.5, MUTED, False, False)]], align=PP_ALIGN.CENTER, line_spacing=1.1)
textbox(s, Inches(0.9), Inches(5.2), Inches(11.5), Inches(1.0),
        [[("The data ingredients already exist in the system. We confirm prioritization with operations early — "
           "recommendations match how the team actually thinks — and cover it with tests from day one.", 14, MUTED, False, False)]],
        line_spacing=1.25)

# 8 — R3
s = slide()
eyebrow(s, "R3 · Automated testing")
heading(s, [("The requirement that ", INK), ("unblocks all the others", BRAND2)])
two_cols(s, [
    ("COVERAGE", "Comprehensive, by design",
     "Core navigation, filtering, the remediated Reports page, the new Restocking flow, plus Spending & Orders — including error and empty states."),
    ("OWNERSHIP", "Runnable by IT",
     "Delivered as a Playwright suite with clear run instructions, ready for CI — so IT can adopt it as the gate for every future release."),
])
textbox(s, Inches(0.9), Inches(5.3), Inches(11.5), Inches(0.7),
        [[("Today, “no tests” is why the system is frozen. We turn that into ", 15, MUTED, False, False),
          ("change with confidence.", 15, INK, True, False)]])

# 9 — R4
s = slide()
eyebrow(s, "R4 · Architecture documentation")
heading(s, [("Our first deliverable — and our own first step", INK)])
two_cols(s, [
    ("WHAT", "Current-state overview",
     "Frontend, backend, data layer, request/response flow, the API surface, and where the codebase deviates from its own patterns."),
    ("WHY FIRST", "De-risk everything after it",
     "Surfaces unknowns before they affect estimates, and becomes the reference the tests and remediation are written against. Durable handoff for IT."),
], h=Inches(2.5))

# 10 — Timeline
s = slide()
eyebrow(s, "Timeline · 8 weeks, required scope")
heading(s, [("Acceptance-gated phases", INK)])
rows = [
    ("Phase", "Weeks", "Item", "Exit deliverable", True),
    ("Onboarding & Architecture", "1–2", "R4", "Architecture overview accepted by IT", False),
    ("Test Foundation", "2–4", "R3", "Passing suite accepted by IT", False),
    ("Reports Remediation", "4–6", "R1", "Remediated Reports, regression-tested", False),
    ("Restocking Build", "6–8", "R2", "Restocking view in operators' hands", False),
]
tx = Inches(0.9); tw = SW - Inches(1.8); ty = Inches(2.4)
colw = [Inches(3.4), Inches(1.2), Inches(1.2), tw - Inches(5.8)]
rh = Inches(0.62)
for ri, (a, b, c, d, header) in enumerate(rows):
    y = ty + Emu(int(rh) * ri)
    if not header:
        rowbg = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, tx, y, tw, rh)
        rowbg.fill.solid(); rowbg.fill.fore_color.rgb = PANEL if ri % 2 else PANEL_2
        rowbg.line.fill.background(); rowbg.shadow.inherit = False
    cells = [a, b, c, d]
    cx = tx
    for ci, val in enumerate(cells):
        col = MUTED if header else (INK if ci != 3 else INK_SOFT)
        sz = 11 if header else 13
        textbox(s, cx + Inches(0.15), y, colw[ci], rh,
                [[(val, sz, col, header, False)]], anchor=MSO_ANCHOR.MIDDLE)
        cx += colw[ci]
textbox(s, Inches(0.9), Inches(5.6), Inches(11.5), Inches(0.7),
        [[("Front-loaded de-risking; every phase ends in a defined, accepted deliverable tied to a payment milestone.", 13, MUTED, False, False)]])

# 11 — Pricing
s = slide()
eyebrow(s, "Pricing · predictable where it matters")
heading(s, [("Fixed on the required. ", INK), ("Capped", BRAND2), (" on the optional.", INK)])
prices = [
    ("REQUIRED SCOPE · R1–R4", "$96,000",
     "Fixed fee, invoiced on acceptance milestones. The risks we identified are ours to manage within it — not change orders waiting to happen.", True, BRAND2),
    ("DESIRED SCOPE · D1–D3", "≤ $30,500",
     "T&M with a hard not-to-exceed ceiling. Commission any, all, or none — without touching the required fee or schedule.", False, INK),
    ("DESIGN SYSTEM & TOOLING", "$0",
     "Included. Reusable components that make the whole engagement faster — and cheaper.", False, OK),
]
margin = Inches(0.9); gap = Inches(0.4); n = 3
cw = int((SW - margin * 2 - gap * (n - 1)) / n); cy = Inches(2.5); chh = Inches(3.0)
for i, (k, v, sub, feature, vcolor) in enumerate(prices):
    x = margin + i * (cw + gap)
    card(s, x, cy, cw, chh, border=(BRAND if feature else LINE), border_w=(2.0 if feature else 1.0))
    textbox(s, x + Inches(0.3), cy + Inches(0.3), cw - Inches(0.6), Inches(0.5),
            [[(k, 11, MUTED, True, False)]])
    textbox(s, x + Inches(0.3), cy + Inches(0.75), cw - Inches(0.6), Inches(0.9),
            [[(v, 34, vcolor, True, False)]])
    textbox(s, x + Inches(0.3), cy + Inches(1.7), cw - Inches(0.6), Inches(1.2),
            [[(sub, 12, INK_SOFT, False, False)]], line_spacing=1.2)
textbox(s, Inches(0.9), Inches(5.8), Inches(11.5), Inches(0.8),
        [[("A known number for what Meridian needs; a hard ceiling on what's optional. ", 13, MUTED, False, False),
          ("Figures firm for required scope, confirmed after the architecture review.", 13, INK_SOFT, False, True)]])

# 12 — Design system advantage
s = slide()
eyebrow(s, "The Northbeam advantage")
heading(s, [("Our design system makes us ", INK), ("faster, cheaper, and safer", BRAND2)])
three_cols(s, [
    ("LOWER COST", "Savings passed through",
     "We assemble UI from proven, production-ready components instead of building each from scratch. The desired-scope price reflects that — the saving is yours."),
    ("DE-RISKED", "“Current standards,” solved",
     "The system already meets a modern accessibility and consistency baseline — so the UI refresh (D1) starts from a mature foundation, not an undefined target."),
    ("BETTER REQUIRED WORK", "Quality, at no extra cost",
     "The same tooling keeps the codebase consistent during R1 remediation and underpins the R3 test suite."),
], h=Inches(2.6))
textbox(s, Inches(0.9), Inches(5.7), Inches(6), Inches(0.9),
        [[("$0", 30, BRAND2, True, False), ("   added cost — folded into the prices, in Meridian's favor", 13, MUTED, False, False)]])
textbox(s, Inches(7.0), Inches(5.7), Inches(5.5), Inches(0.9),
        [[("8 wks", 30, OK, True, False), ("   to deliver the full required scope", 13, MUTED, False, False)]])

# 13 — Close
s = slide()
brand_dot(s, Inches(0.9), Inches(0.95))
textbox(s, Inches(1.25), Inches(0.9), Inches(10), Inches(0.4), [[("NORTHBEAM", 14, INK, True, False)]])
eyebrow(s, "Next step", y=Inches(2.4))
heading(s, [("Let's make the dashboard", INK)], y=Inches(2.85), size=40)
heading(s, [("something the team ", INK), ("reaches for.", BRAND2)], y=Inches(3.7), size=40)
textbox(s, Inches(0.9), Inches(4.9), Inches(10), Inches(1.2),
        [[("We've scoped this from Meridian's actual codebase, not a template. We're confident in the plan, the timeline, and the result.", 18, INK_SOFT, False, False)]],
        line_spacing=1.25)
textbox(s, Inches(0.9), Inches(6.4), Inches(11.5), Inches(0.5),
        [[("Thank you · Questions welcome — procurement@meridiancomponents.example", 12, MUTED, False, False)]])

out = "proposal/capabilities-deck.pptx"
prs.save(out)
print("saved", out, "with", len(prs.slides._sldIdLst), "slides")
