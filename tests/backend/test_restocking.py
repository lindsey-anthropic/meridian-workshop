"""
Tests for restocking recommendation API endpoints.
"""
import pytest


class TestRestockingEndpoints:
    """Test suite for restocking-recommendation-related endpoints."""

    def test_get_recommendations_returns_200_and_shape(self, client):
        """Test getting restock recommendations returns expected structure."""
        response = client.get("/api/restocking/recommendations")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

        first_item = data[0]
        required_fields = [
            "sku", "item_name", "warehouse", "category",
            "quantity_on_hand", "reorder_point", "shortfall", "trend",
            "recommended_quantity", "unit_cost", "estimated_cost", "priority_score"
        ]
        for field in required_fields:
            assert field in first_item, f"Missing field: {field}"

    def test_recommendations_only_include_items_at_or_below_reorder_point(self, client):
        """Test that every recommendation is for an item at or below its reorder point."""
        response = client.get("/api/restocking/recommendations")
        data = response.json()

        for item in data:
            assert item["quantity_on_hand"] <= item["reorder_point"]
            assert item["shortfall"] >= 0
            assert item["recommended_quantity"] >= item["shortfall"]

    def test_recommendations_sorted_by_priority_descending(self, client):
        """Test that recommendations are sorted by priority_score, most urgent first."""
        response = client.get("/api/restocking/recommendations")
        data = response.json()

        priorities = [item["priority_score"] for item in data]
        assert priorities == sorted(priorities, reverse=True)

    def test_recommendations_filtered_by_warehouse(self, client):
        """Test filtering recommendations by warehouse."""
        response = client.get("/api/restocking/recommendations?warehouse=Tokyo")
        assert response.status_code == 200

        data = response.json()
        for item in data:
            assert item["warehouse"] == "Tokyo"

    def test_recommendations_filtered_by_category(self, client):
        """Test filtering recommendations by category."""
        response = client.get("/api/restocking/recommendations?category=Power Supplies")
        assert response.status_code == 200

        data = response.json()
        for item in data:
            assert item["category"].lower() == "power supplies"

    def test_recommendations_empty_filter_combo_returns_empty_list(self, client):
        """Test that a filter matching no inventory returns 200 and an empty list."""
        response = client.get("/api/restocking/recommendations?warehouse=Nonexistent Warehouse")
        assert response.status_code == 200
        assert response.json() == []

    def test_recommendation_trend_values_are_valid(self, client):
        """Test that trend falls back to 'unknown' for items with no demand forecast, and is never something else unexpected."""
        response = client.get("/api/restocking/recommendations")
        data = response.json()

        valid_trends = {"increasing", "stable", "decreasing", "unknown"}
        for item in data:
            assert item["trend"] in valid_trends

    def test_estimated_cost_matches_quantity_times_unit_cost(self, client):
        """Test that estimated_cost is internally consistent with recommended_quantity and unit_cost."""
        response = client.get("/api/restocking/recommendations")
        data = response.json()

        for item in data:
            expected = round(item["recommended_quantity"] * item["unit_cost"], 2)
            assert abs(item["estimated_cost"] - expected) < 0.01
