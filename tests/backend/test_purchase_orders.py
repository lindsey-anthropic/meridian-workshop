"""
Tests for purchase order API endpoints.
"""
import pytest


class TestPurchaseOrderEndpoints:
    """Test suite for purchase-order-related endpoints."""

    def _base_payload(self, **overrides):
        payload = {
            "item_sku": "PSU-508",
            "supplier_name": "Acme Supply Co",
            "quantity": 25,
            "unit_cost": 185.5,
            "expected_delivery_date": "2026-08-01",
            "notes": "Created by test"
        }
        payload.update(overrides)
        return payload

    def test_create_purchase_order_with_item_sku(self, client):
        """Test creating a purchase order from a restocking recommendation (item_sku)."""
        response = client.post("/api/purchase-orders", json=self._base_payload())
        assert response.status_code == 200

        data = response.json()
        assert "id" in data
        assert data["item_sku"] == "PSU-508"
        assert data["backlog_item_id"] is None
        assert data["status"] == "Pending"
        assert "created_date" in data
        assert data["quantity"] == 25
        assert data["unit_cost"] == 185.5

    def test_create_purchase_order_requires_exactly_one_source(self, client):
        """Test that providing both or neither of item_sku/backlog_item_id is rejected."""
        both = self._base_payload(backlog_item_id="1")
        response = client.post("/api/purchase-orders", json=both)
        assert response.status_code == 400

        neither = self._base_payload(item_sku=None)
        response = client.post("/api/purchase-orders", json=neither)
        assert response.status_code == 400

    def test_create_purchase_order_from_backlog_item(self, client):
        """Test creating a purchase order from a backlog item still works."""
        payload = self._base_payload(item_sku=None, backlog_item_id="1")
        response = client.post("/api/purchase-orders", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert data["backlog_item_id"] == "1"
        assert data["item_sku"] is None

    def test_create_purchase_order_missing_required_field(self, client):
        """Test that omitting a required field returns a validation error."""
        payload = self._base_payload()
        del payload["quantity"]

        response = client.post("/api/purchase-orders", json=payload)
        assert response.status_code == 422

    def test_get_purchase_orders_reflects_created_order(self, client):
        """Test that a newly created purchase order shows up in the list endpoint."""
        before = client.get("/api/purchase-orders").json()
        before_ids = {po["id"] for po in before}

        create_response = client.post(
            "/api/purchase-orders",
            json=self._base_payload(notes="unique-marker-for-list-test")
        )
        created = create_response.json()

        after = client.get("/api/purchase-orders").json()
        after_ids = {po["id"] for po in after}

        assert len(after_ids) == len(before_ids) + 1
        assert created["id"] in after_ids

        matching = [po for po in after if po["id"] == created["id"]]
        assert len(matching) == 1
        assert matching[0]["notes"] == "unique-marker-for-list-test"

    def test_created_purchase_order_ids_are_unique(self, client):
        """Test that sequential purchase order creations get distinct ids."""
        first = client.post("/api/purchase-orders", json=self._base_payload()).json()
        second = client.post("/api/purchase-orders", json=self._base_payload()).json()

        assert first["id"] != second["id"]
