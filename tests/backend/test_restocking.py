"""
Tests for the Restocking recommendations endpoint (R2).

Covers the business logic IT will scrutinize: response shape, input validation
(422s), urgency classification, budget funding, and filter behavior. Assertions
are RELATIVE (more budget -> more funded; longer lead time -> more urgent) rather
than tied to exact recommended quantities, because the demand model (forecast /
30-day window) is an unconfirmed domain assumption.
"""
import pytest

ENDPOINT = "/api/restocking/recommendations"
REQUIRED_ITEM_FIELDS = {
    "sku", "name", "category", "warehouse", "quantity_on_hand", "reorder_point",
    "unit_cost", "forecasted_demand", "has_forecast", "daily_demand",
    "lead_time_days", "demand_during_lead_time", "days_of_cover",
    "projected_stock_at_arrival", "will_stock_out", "recommended_qty",
    "line_cost", "urgency", "within_budget", "cumulative_cost",
}
REQUIRED_SUMMARY_FIELDS = {
    "budget", "lead_time_days", "total_recommended_cost", "total_proposed_cost",
    "items_total", "items_within_budget", "items_deferred", "critical_count",
    "critical_within_budget", "budget_remaining", "budget_utilization",
}


class TestRestockingResponseShape:
    """Response structure and defaults."""

    def test_defaults_return_200_with_summary_and_recommendations(self, client):
        response = client.get(ENDPOINT)
        assert response.status_code == 200
        data = response.json()
        assert "summary" in data
        assert "recommendations" in data
        assert isinstance(data["recommendations"], list)

    def test_summary_has_all_fields(self, client):
        data = client.get(ENDPOINT).json()
        assert REQUIRED_SUMMARY_FIELDS.issubset(data["summary"].keys())

    def test_each_recommendation_has_all_fields(self, client):
        data = client.get(ENDPOINT).json()
        assert len(data["recommendations"]) > 0, "default scenario should recommend items"
        for item in data["recommendations"]:
            assert REQUIRED_ITEM_FIELDS.issubset(item.keys())

    def test_only_items_needing_restock_are_returned(self, client):
        data = client.get(ENDPOINT).json()
        # Every returned item must actually need an order.
        for item in data["recommendations"]:
            assert item["recommended_qty"] > 0


class TestRestockingValidation:
    """Invalid query params return a clean 422 instead of wrong recommendations."""

    @pytest.mark.parametrize("budget", [0, -1, -1000])
    def test_non_positive_budget_returns_422(self, client, budget):
        assert client.get(ENDPOINT, params={"budget": budget}).status_code == 422

    @pytest.mark.parametrize("lead_time", [0, -5])
    def test_non_positive_lead_time_returns_422(self, client, lead_time):
        assert client.get(ENDPOINT, params={"lead_time_days": lead_time}).status_code == 422

    def test_valid_params_return_200(self, client):
        assert client.get(ENDPOINT, params={"budget": 25000, "lead_time_days": 7}).status_code == 200


class TestRestockingUrgency:
    """Urgency classification and the stock-out-before-arrival signal."""

    def test_urgency_values_are_valid(self, client):
        data = client.get(ENDPOINT).json()
        for item in data["recommendations"]:
            assert item["urgency"] in {"critical", "high", "medium"}

    def test_critical_items_are_flagged_will_stock_out(self, client):
        data = client.get(ENDPOINT, params={"lead_time_days": 60}).json()
        for item in data["recommendations"]:
            if item["urgency"] == "critical":
                assert item["will_stock_out"] is True

    def test_longer_lead_time_does_not_reduce_critical_count(self, client):
        short = client.get(ENDPOINT, params={"lead_time_days": 14}).json()["summary"]["critical_count"]
        long = client.get(ENDPOINT, params={"lead_time_days": 60}).json()["summary"]["critical_count"]
        # A longer lead time means more items stock out before a PO arrives.
        assert long >= short


class TestRestockingBudget:
    """Budget funding logic and the funded-first ordering invariant."""

    def test_funded_cost_stays_within_budget(self, client):
        budget = 50000
        data = client.get(ENDPOINT, params={"budget": budget}).json()
        summary = data["summary"]
        assert summary["total_recommended_cost"] <= budget
        # remaining + spent == budget (within rounding).
        assert abs(summary["budget_remaining"] + summary["total_recommended_cost"] - budget) < 0.01

    def test_funded_items_appear_before_deferred(self, client):
        items = client.get(ENDPOINT, params={"budget": 50000}).json()["recommendations"]
        seen_deferred = False
        for item in items:
            if not item["within_budget"]:
                seen_deferred = True
            elif seen_deferred:
                pytest.fail("a funded item appeared after a deferred item")

    def test_higher_budget_funds_at_least_as_many_items(self, client):
        low = client.get(ENDPOINT, params={"budget": 20000}).json()["summary"]
        high = client.get(ENDPOINT, params={"budget": 5000000}).json()["summary"]
        assert high["items_within_budget"] >= low["items_within_budget"]
        assert high["items_deferred"] <= low["items_deferred"]

    def test_ample_budget_defers_nothing(self, client):
        summary = client.get(ENDPOINT, params={"budget": 100000000}).json()["summary"]
        assert summary["items_deferred"] == 0
        assert summary["items_within_budget"] == summary["items_total"]

    def test_summary_counts_are_consistent(self, client):
        data = client.get(ENDPOINT).json()
        summary = data["summary"]
        assert summary["items_total"] == len(data["recommendations"])
        assert summary["items_within_budget"] + summary["items_deferred"] == summary["items_total"]


class TestRestockingFilters:
    """Warehouse/category filtering matches the rest of the dashboard."""

    def test_warehouse_filter_narrows_results(self, client):
        all_items = client.get(ENDPOINT).json()["summary"]["items_total"]
        sf_items = client.get(ENDPOINT, params={"warehouse": "San Francisco"}).json()["summary"]["items_total"]
        assert sf_items <= all_items

    def test_healthy_warehouse_returns_no_recommendations(self, client):
        # San Francisco stock is above target -> a clean, empty recommendation set.
        data = client.get(ENDPOINT, params={"warehouse": "San Francisco"}).json()
        assert data["summary"]["items_total"] == 0
        assert data["recommendations"] == []
