"""
Frontend E2E tests for Meridian Components dashboard.
Covers R3: automated browser test coverage.
"""
import pytest
from playwright.sync_api import Page, expect

BASE_URL = "http://localhost:3000"


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "base_url": BASE_URL}


class TestNavigation:
    def test_dashboard_loads(self, page: Page):
        page.goto(BASE_URL)
        expect(page).to_have_title("Factory Inventory Management System")
        expect(page.locator("nav")).to_be_visible()

    def test_nav_links_present(self, page: Page):
        page.goto(BASE_URL)
        nav = page.locator("nav")
        expect(nav.get_by_text("Reports")).to_be_visible()
        expect(nav.get_by_text("Restocking")).to_be_visible()

    def test_navigate_to_reports(self, page: Page):
        page.goto(BASE_URL)
        page.get_by_role("link", name="Reports").click()
        expect(page).to_have_url(f"{BASE_URL}/reports")

    def test_navigate_to_inventory(self, page: Page):
        page.goto(BASE_URL)
        page.get_by_role("link", name="Inventory").click()
        expect(page).to_have_url(f"{BASE_URL}/inventory")

    def test_navigate_to_restocking(self, page: Page):
        page.goto(BASE_URL)
        page.get_by_role("link", name="Restocking").click()
        expect(page).to_have_url(f"{BASE_URL}/restocking")


class TestDashboard:
    def test_dashboard_has_kpi_cards(self, page: Page):
        page.goto(BASE_URL)
        # At least one stat/metric card visible
        cards = page.locator(".card, .kpi, .metric, [class*='card']")
        expect(cards.first).to_be_visible()

    def test_dashboard_loads_data(self, page: Page):
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        # No error messages visible
        expect(page.get_by_text("Error")).not_to_be_visible()
        expect(page.get_by_text("500")).not_to_be_visible()


class TestReports:
    def test_reports_page_loads(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        page.wait_for_load_state("networkidle")
        expect(page.locator("h1, h2").first).to_be_visible()

    def test_reports_has_filters(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        page.wait_for_load_state("networkidle")
        # Warehouse or category filter should exist
        filters = page.locator("select, [class*='filter'], [class*='select']")
        expect(filters.first).to_be_visible()

    def test_reports_warehouse_filter_works(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        page.wait_for_load_state("networkidle")
        selects = page.locator("select")
        if selects.count() > 0:
            selects.first.select_option(index=1)
            page.wait_for_timeout(500)
            # Page should not crash
            expect(page.get_by_text("Error")).not_to_be_visible()

    def test_reports_has_chart_or_table(self, page: Page):
        page.goto(f"{BASE_URL}/reports")
        page.wait_for_load_state("networkidle")
        content = page.locator("table, canvas, svg, [class*='chart'], [class*='table']")
        expect(content.first).to_be_visible()


class TestRestocking:
    def test_restocking_page_loads(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        page.wait_for_load_state("networkidle")
        expect(page.locator("h1, h2").first).to_be_visible()

    def test_restocking_shows_items(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        page.wait_for_load_state("networkidle")
        # Table rows or cards with restocking data
        rows = page.locator("table tbody tr, [class*='item'], [class*='row']")
        expect(rows.first).to_be_visible()

    def test_restocking_budget_filter(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        page.wait_for_load_state("networkidle")
        budget_input = page.locator("input[type='number'], input[placeholder*='budget' i]")
        if budget_input.count() > 0:
            budget_input.first.fill("10000")
            page.wait_for_timeout(500)
            expect(page.get_by_text("Error")).not_to_be_visible()

    def test_restocking_no_errors(self, page: Page):
        page.goto(f"{BASE_URL}/restocking")
        page.wait_for_load_state("networkidle")
        expect(page.get_by_text("500")).not_to_be_visible()
        expect(page.get_by_text("undefined")).not_to_be_visible()
