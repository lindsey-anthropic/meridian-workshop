"""
Browser tests for Meridian Components Inventory Dashboard.

Requires app running at http://localhost:3000.

Run from project root:
  uv run --directory server pytest ../tests/e2e/ -v
"""

import re
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def location_select(page: Page):
    """Return the Location filter <select> (2nd .filter-select in the header)."""
    return page.locator("select.filter-select").nth(1)


# ---------------------------------------------------------------------------
# Overview page
# ---------------------------------------------------------------------------

class TestOverviewPage:
    def test_page_loads(self, page: Page):
        page.goto(BASE_URL)
        expect(page.get_by_role("heading", name="Overview")).to_be_visible()

    def test_kpi_cards_render(self, page: Page):
        page.goto(BASE_URL)
        expect(page.get_by_text("Inventory Turnover Rate")).to_be_visible()
        expect(page.get_by_text("Orders Fulfilled")).to_be_visible()
        expect(page.get_by_text("Order Fill Rate")).to_be_visible()

    def test_inventory_shortages_table_has_rows(self, page: Page):
        page.goto(BASE_URL)
        expect(page.get_by_role("heading", name=re.compile(r"Inventory Shortages"))).to_be_visible()
        # Expect at least one shortage row
        rows = page.locator("text=units short")
        assert rows.count() >= 1

    def test_navigation_links_present(self, page: Page):
        page.goto(BASE_URL)
        nav = page.get_by_role("navigation")
        for label in ["Overview", "Inventory", "Orders", "Finance", "Reports", "Restocking"]:
            expect(nav.get_by_role("link", name=label)).to_be_visible()


# ---------------------------------------------------------------------------
# Reports page
# ---------------------------------------------------------------------------

class TestReportsPage:
    def test_page_loads(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        expect(page.get_by_role("heading", name="Performance Reports")).to_be_visible()

    def test_quarterly_table_has_all_quarters(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        # Scope to the quarterly table to avoid matching the "Best Performing Quarter" stat
        quarterly_table = page.locator("table.reports-table").first
        for quarter in ["Q1-2025", "Q2-2025", "Q3-2025", "Q4-2025"]:
            expect(quarterly_table.get_by_text(quarter)).to_be_visible()

    def test_monthly_trend_section(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        expect(page.get_by_role("heading", name="Monthly Revenue Trend")).to_be_visible()
        # Both text appear in chart labels and table — use .first to avoid strict violation
        expect(page.get_by_text("Jan 2025").first).to_be_visible()
        expect(page.get_by_text("Dec 2025").first).to_be_visible()

    def test_summary_stats_render(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        expect(page.get_by_text("Total Revenue (YTD)")).to_be_visible()
        expect(page.get_by_text("Best Performing Quarter")).to_be_visible()

    def test_location_filter_changes_quarterly_data(self, page: Page):
        page.goto(f"{BASE_URL}/reports")

        # Grab Q1 revenue before filtering
        q1_row = page.locator("tbody tr").filter(has_text="Q1-2025")
        initial_revenue = q1_row.locator("td").nth(2).inner_text()

        # Apply London filter
        location_select(page).select_option("London")
        page.wait_for_load_state("networkidle")

        filtered_revenue = q1_row.locator("td").nth(2).inner_text()
        assert initial_revenue != filtered_revenue, \
            "Quarterly revenue should change when location filter is applied"

    def test_reset_button_activates_on_filter(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        reset_btn = page.get_by_role("button", name="Reset all filters")
        expect(reset_btn).to_be_disabled()

        location_select(page).select_option("Tokyo")
        expect(reset_btn).to_be_enabled()

        reset_btn.click()
        expect(reset_btn).to_be_disabled()


# ---------------------------------------------------------------------------
# Restocking page
# ---------------------------------------------------------------------------

class TestRestockingPage:
    def test_page_loads(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        expect(page.get_by_role("heading", name="Restocking Recommendations")).to_be_visible()

    def test_recommendations_table_has_data(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        # The card-level heading (h3) shows "Recommendations N" — scope by level
        expect(page.get_by_role("heading", name="Restocking Recommendations")).to_be_visible()
        # At least one SKU should appear
        expect(page.get_by_text("TMP-201")).to_be_visible()

    def test_no_limit_message_shown_by_default(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        expect(page.get_by_text(re.compile(r"No limit set", re.IGNORECASE))).to_be_visible()

    def test_budget_input_shows_within_budget_stat(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")

        # Default stat label is "All items"
        expect(page.get_by_text("All items")).to_be_visible()

        # Enter a budget
        budget_input = page.locator("input.budget-input")
        budget_input.fill("20000")
        budget_input.press("Tab")
        page.wait_for_timeout(300)

        # "No limit set" should be gone; "Within budget" stat should appear
        expect(page.get_by_text(re.compile(r"No limit set", re.IGNORECASE))).not_to_be_visible()
        expect(page.get_by_text("Within budget", exact=True)).to_be_visible()

    def test_budget_shows_over_budget_badges(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")

        budget_input = page.locator("input.budget-input")
        budget_input.fill("5000")
        budget_input.press("Tab")
        page.wait_for_timeout(300)

        # With $5,000 budget most items are over budget — badges should appear
        expect(page.get_by_text("Over budget").first).to_be_visible()

    def test_summary_stats_render(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        expect(page.get_by_text("Items needing restock")).to_be_visible()
        expect(page.get_by_text("Total estimated cost")).to_be_visible()
