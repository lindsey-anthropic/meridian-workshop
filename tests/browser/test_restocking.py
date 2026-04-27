"""
Browser tests for the Restocking Recommendations page.
Covers: page load, data rendering, warehouse filter, budget ceiling, priority badges.
"""
import pytest
from playwright.sync_api import Page, expect


BASE_URL = "http://localhost:3000"


@pytest.fixture(autouse=True)
def go_to_restocking(page: Page):
    page.goto(f"{BASE_URL}/restocking")
    expect(page.get_by_role("heading", name="Restocking Recommendations")).to_be_visible()
    expect(page.locator(".loading")).to_have_count(0, timeout=5000)


def test_restocking_page_title(page: Page):
    """Restocking page renders the correct h2 heading."""
    expect(page.locator("h2", has_text="Restocking Recommendations")).to_be_visible()


def test_budget_input_visible(page: Page):
    """Budget ceiling input is present and accepts numeric input."""
    budget_input = page.locator("input[type='number']")
    expect(budget_input).to_be_visible()
    budget_input.fill("50000")
    assert budget_input.input_value() == "50000"


def test_recommendations_table_renders(page: Page):
    """Recommendations table renders with at least one item."""
    rows = page.locator("table tbody tr")
    assert rows.count() > 0


def test_priority_badges_present(page: Page):
    """Priority badges (high/medium/low) are shown in the table."""
    badges = page.locator(".badge.high, .badge.medium, .badge.low")
    assert badges.count() > 0


def test_summary_stats_visible(page: Page):
    """Summary stat cards show items needing restock, total cost, and within-budget count."""
    stat_cards = page.locator(".stat-card")
    assert stat_cards.count() == 3
    for i in range(3):
        value = stat_cards.nth(i).locator(".stat-value").inner_text().strip()
        assert value != "" and value != "0" or i == 2  # within-budget may be 0 when no budget set


def test_warehouse_filter_changes_items(page: Page):
    """Selecting a warehouse filter updates the recommendations list."""
    all_rows = page.locator("table tbody tr").count()

    page.locator("select").nth(1).select_option("Tokyo")
    page.wait_for_timeout(800)

    tokyo_rows = page.locator("table tbody tr").count()
    assert tokyo_rows != all_rows or tokyo_rows == 0  # different count or empty


def test_budget_ceiling_marks_excluded_items(page: Page):
    """Setting a very low budget marks some items as excluded."""
    page.locator("input[type='number']").fill("1")
    page.wait_for_timeout(500)

    excluded = page.locator(".badge.danger", has_text="Excluded")
    assert excluded.count() > 0


def test_budget_ceiling_marks_included_items(page: Page):
    """Setting a high budget marks items as included."""
    page.locator("input[type='number']").fill("9999999")
    page.wait_for_timeout(500)

    included = page.locator(".badge.success", has_text="Included")
    assert included.count() > 0


def test_high_priority_items_appear_first(page: Page):
    """High priority items are sorted before medium and low priority items."""
    badges = page.locator("table tbody tr .badge.high, table tbody tr .badge.medium, table tbody tr .badge.low")
    count = badges.count()
    if count < 2:
        pytest.skip("Not enough items to verify sort order")

    priorities = [badges.nth(i).inner_text().strip().lower() for i in range(count)]
    order = {"high": 0, "medium": 1, "low": 2}
    sorted_priorities = sorted(priorities, key=lambda p: order.get(p, 3))
    assert priorities == sorted_priorities


def test_zero_budget_hides_budget_status(page: Page):
    """With budget set to 0, the budget status column shows dashes."""
    page.locator("input[type='number']").fill("0")
    page.wait_for_timeout(500)

    dashes = page.locator(".no-budget")
    assert dashes.count() > 0


def test_no_console_errors(page: Page):
    """Restocking page produces no console errors under normal operation."""
    known_preexisting = {"Failed to load tasks", "Failed to load resource"}
    errors = []
    page.on("console", lambda msg: errors.append(msg.text)
            if msg.type == "error" and not any(k in msg.text for k in known_preexisting)
            else None)
    page.reload()
    page.wait_for_timeout(2000)
    assert errors == [], f"Unexpected console errors: {errors}"
