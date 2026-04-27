"""
Tests for Reports and Restocking API endpoints.
"""
import pytest


class TestReportsEndpoints:
    """Test suite for reports-related endpoints."""

    def test_get_quarterly_reports(self, client):
        """Test getting all quarterly reports."""
        response = client.get("/api/reports/quarterly")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

        first = data[0]
        assert "quarter" in first
        assert "total_orders" in first
        assert "total_revenue" in first
        assert "avg_order_value" in first
        assert "fulfillment_rate" in first

    def test_quarterly_reports_data_types(self, client):
        """Test that quarterly report fields have correct types."""
        response = client.get("/api/reports/quarterly")
        data = response.json()

        for q in data:
            assert isinstance(q["total_orders"], int)
            assert isinstance(q["total_revenue"], (int, float))
            assert isinstance(q["avg_order_value"], (int, float))
            assert isinstance(q["fulfillment_rate"], (int, float))
            assert q["total_orders"] > 0
            assert q["total_revenue"] > 0
            assert 0 <= q["fulfillment_rate"] <= 100

    def test_quarterly_reports_filter_by_warehouse(self, client):
        """Test filtering quarterly reports by warehouse."""
        response_all = client.get("/api/reports/quarterly")
        response_sf = client.get("/api/reports/quarterly?warehouse=San Francisco")

        assert response_sf.status_code == 200
        data_all = response_all.json()
        data_sf = response_sf.json()

        # Filtered revenue should be <= total revenue
        total_all = sum(q["total_revenue"] for q in data_all)
        total_sf = sum(q["total_revenue"] for q in data_sf)
        assert total_sf <= total_all

    def test_quarterly_reports_filter_by_category(self, client):
        """Test filtering quarterly reports by category."""
        response = client.get("/api/reports/quarterly?category=Sensors")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)

    def test_quarterly_reports_sorted_by_quarter(self, client):
        """Test that quarterly reports are sorted by quarter."""
        response = client.get("/api/reports/quarterly")
        data = response.json()

        quarters = [q["quarter"] for q in data]
        assert quarters == sorted(quarters)

    def test_get_monthly_trends(self, client):
        """Test getting monthly trend data."""
        response = client.get("/api/reports/monthly-trends")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

        first = data[0]
        assert "month" in first
        assert "order_count" in first
        assert "revenue" in first
        assert "delivered_count" in first

    def test_monthly_trends_data_types(self, client):
        """Test that monthly trend fields have correct types."""
        response = client.get("/api/reports/monthly-trends")
        data = response.json()

        for m in data:
            assert isinstance(m["order_count"], int)
            assert isinstance(m["revenue"], (int, float))
            assert isinstance(m["delivered_count"], int)
            assert m["order_count"] >= 0
            assert m["revenue"] >= 0
            assert m["delivered_count"] >= 0
            assert m["delivered_count"] <= m["order_count"]

    def test_monthly_trends_sorted_by_month(self, client):
        """Test that monthly trends are sorted chronologically."""
        response = client.get("/api/reports/monthly-trends")
        data = response.json()

        months = [m["month"] for m in data]
        assert months == sorted(months)

    def test_monthly_trends_filter_by_warehouse(self, client):
        """Test filtering monthly trends by warehouse."""
        response_all = client.get("/api/reports/monthly-trends")
        response_london = client.get("/api/reports/monthly-trends?warehouse=London")

        assert response_london.status_code == 200
        data_all = response_all.json()
        data_london = response_london.json()

        total_all = sum(m["revenue"] for m in data_all)
        total_london = sum(m["revenue"] for m in data_london)
        assert total_london <= total_all

    def test_monthly_trends_january_has_data(self, client):
        """Test that January 2025 has data."""
        response = client.get("/api/reports/monthly-trends")
        data = response.json()

        jan = next((m for m in data if m["month"] == "2025-01"), None)
        assert jan is not None
        assert jan["order_count"] > 0
        assert jan["revenue"] > 0


class TestRestockingEndpoints:
    """Test suite for restocking recommendations endpoint."""

    def test_get_restocking_recommendations(self, client):
        """Test getting restocking recommendations."""
        response = client.get("/api/restocking")
        assert response.status_code == 200

        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_restocking_item_structure(self, client):
        """Test that restocking items have required fields."""
        response = client.get("/api/restocking")
        data = response.json()

        for item in data:
            assert "sku" in item
            assert "name" in item
            assert "category" in item
            assert "warehouse" in item
            assert "current_stock" in item
            assert "reorder_point" in item
            assert "unit_cost" in item
            assert "recommended_qty" in item
            assert "estimated_cost" in item
            assert "days_of_coverage" in item
            assert "demand_trend" in item

    def test_restocking_only_below_reorder_point(self, client):
        """Test that all items returned are below reorder point."""
        response = client.get("/api/restocking")
        data = response.json()

        for item in data:
            assert item["current_stock"] < item["reorder_point"]

    def test_restocking_sorted_by_urgency(self, client):
        """Test that items are sorted by days of coverage ascending."""
        response = client.get("/api/restocking")
        data = response.json()

        if len(data) > 1:
            days = [item["days_of_coverage"] for item in data]
            assert days == sorted(days)

    def test_restocking_data_types(self, client):
        """Test that restocking fields have correct types."""
        response = client.get("/api/restocking")
        data = response.json()

        for item in data:
            assert isinstance(item["current_stock"], int)
            assert isinstance(item["reorder_point"], int)
            assert isinstance(item["unit_cost"], (int, float))
            assert isinstance(item["recommended_qty"], int)
            assert isinstance(item["estimated_cost"], (int, float))
            assert isinstance(item["days_of_coverage"], (int, float))
            assert item["recommended_qty"] > 0
            assert item["estimated_cost"] > 0
            assert item["days_of_coverage"] >= 0

    def test_restocking_filter_by_warehouse(self, client):
        """Test filtering restocking by warehouse."""
        response = client.get("/api/restocking?warehouse=Tokyo")
        assert response.status_code == 200

        data = response.json()
        for item in data:
            assert item["warehouse"] == "Tokyo"

    def test_restocking_filter_by_category(self, client):
        """Test filtering restocking by category."""
        response = client.get("/api/restocking?category=Sensors")
        assert response.status_code == 200

        data = response.json()
        for item in data:
            assert item["category"].lower() == "sensors"

    def test_restocking_budget_trims_list(self, client):
        """Test that budget ceiling trims the recommendation list."""
        response_all = client.get("/api/restocking")
        data_all = response_all.json()

        if len(data_all) == 0:
            pytest.skip("No restocking items available")

        # Use a budget equal to the first item only
        first_cost = data_all[0]["estimated_cost"]
        response_budget = client.get(f"/api/restocking?budget={first_cost}")
        assert response_budget.status_code == 200

        data_budget = response_budget.json()
        assert len(data_budget) <= len(data_all)

        # Total cost must not exceed budget
        total_cost = sum(item["estimated_cost"] for item in data_budget)
        assert total_cost <= first_cost + 0.01

    def test_restocking_budget_zero_returns_empty(self, client):
        """Test that a budget of 0 returns no recommendations."""
        response = client.get("/api/restocking?budget=0")
        assert response.status_code == 200

        data = response.json()
        assert len(data) == 0

    def test_restocking_demand_trend_valid_values(self, client):
        """Test that demand_trend has valid values."""
        response = client.get("/api/restocking")
        data = response.json()

        valid_trends = {"increasing", "stable", "decreasing"}
        for item in data:
            assert item["demand_trend"] in valid_trends
