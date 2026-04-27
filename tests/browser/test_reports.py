"""
Browser tests for the Reports page.
Covers: page load, data rendering, filter behaviour, no console errors.
"""
import pytest
from playwright.sync_api import Page, expect


BASE_URL = "http://localhost:3000"


@pytest.fixture(autouse=True)
def go_to_reports(page: Page):
    page.goto(f"{BASE_URL}/reports")
    expect(page.get_by_role("heading", name="Performance Reports")).to_be_visible()
    # Wait for loading to complete
    expect(page.locator(".loading")).to_have_count(0, timeout=5000)


def test_reports_page_title(page: Page):
    """Reports page renders the correct heading."""
    expect(page.get_by_role("heading", name="Performance Reports")).to_be_visible()


def test_quarterly_table_renders(page: Page):
    """Quarterly performance table shows 4 quarters of data."""
    rows = page.locator("table").first.locator("tbody tr")
    expect(rows).to_have_count(4)


def test_quarterly_table_columns(page: Page):
    """Quarterly table has all required columns."""
    headers = page.locator("table").first.locator("th")
    texts = [headers.nth(i).inner_text().upper() for i in range(headers.count())]
    assert "QUARTER" in texts
    assert "TOTAL ORDERS" in texts
    assert "TOTAL REVENUE" in texts
    assert "FULFILLMENT RATE" in texts


def test_monthly_table_renders(page: Page):
    """Month-over-month table shows 12 months of data."""
    tables = page.locator("table")
    monthly_table = tables.nth(1)
    rows = monthly_table.locator("tbody tr")
    expect(rows).to_have_count(12)


def test_summary_stats_visible(page: Page):
    """Summary stat cards are visible and non-empty."""
    stat_values = page.locator(".stat-value")
    count = stat_values.count()
    assert count >= 4
    for i in range(count):
        assert stat_values.nth(i).inner_text().strip() != ""


def test_warehouse_filter_changes_data(page: Page):
    """Selecting a warehouse filter updates the quarterly data."""
    # Get initial Q1 order count
    first_row = page.locator("table").first.locator("tbody tr").first
    initial_orders = first_row.locator("td").nth(1).inner_text()

    # Apply Tokyo filter
    page.locator("select").nth(1).select_option("Tokyo")
    page.wait_for_timeout(800)

    # Data should have changed
    new_orders = first_row.locator("td").nth(1).inner_text()
    assert new_orders != initial_orders


def test_category_filter_changes_data(page: Page):
    """Selecting a category filter updates the data."""
    first_row = page.locator("table").first.locator("tbody tr").first
    initial_orders = first_row.locator("td").nth(1).inner_text()

    page.locator("select").nth(2).select_option("sensors")
    page.wait_for_timeout(800)

    new_orders = first_row.locator("td").nth(1).inner_text()
    assert new_orders != initial_orders


def test_reset_filter_button_activates(page: Page):
    """Reset button becomes enabled when a filter is active."""
    reset_btn = page.get_by_title("Reset all filters")
    expect(reset_btn).to_be_disabled()

    page.locator("select").nth(1).select_option("London")
    expect(reset_btn).to_be_enabled()


def test_reset_filter_restores_data(page: Page):
    """Resetting filters restores the original data."""
    first_row = page.locator("table").first.locator("tbody tr").first
    initial_orders = first_row.locator("td").nth(1).inner_text()

    page.locator("select").nth(1).select_option("Tokyo")
    page.wait_for_timeout(800)

    page.get_by_title("Reset all filters").click()
    page.wait_for_timeout(800)

    restored_orders = first_row.locator("td").nth(1).inner_text()
    assert restored_orders == initial_orders


def test_no_console_errors(page: Page):
    """Reports page produces no console errors under normal operation."""
    # Exclude the pre-existing tasks 404 which originates from App.vue, not this page
    known_preexisting = {"Failed to load tasks", "Failed to load resource"}
    errors = []
    page.on("console", lambda msg: errors.append(msg.text)
            if msg.type == "error" and not any(k in msg.text for k in known_preexisting)
            else None)
    page.reload()
    page.wait_for_timeout(2000)
    assert errors == [], f"Unexpected console errors: {errors}"
