"""
Tests for the purchase-orders endpoints (RFP R2 + closes orphan-route findings).
"""


class TestPurchaseOrderEndpoints:
    """Test suite for POST and GET /api/purchase-orders."""

    RECOMMENDATION_PAYLOAD = {
        "sku": "PCB-001",
        "warehouse": "San Francisco",
        "quantity": 50,
        "unit_cost": 24.99,
        "supplier_name": "ElectroSource Ltd.",
        "expected_delivery_date": "2026-05-21",
        "notes": "test recommendation-driven PO",
    }

    BACKLOG_PAYLOAD = {
        "backlog_item_id": "BL-001",
        "supplier_name": "Generic Supplier Co.",
        "quantity": 10,
        "unit_cost": 99.0,
        "expected_delivery_date": "2026-05-15",
        "notes": "test backlog-driven PO",
    }

    def test_create_po_from_recommendation(self, client):
        response = client.post("/api/purchase-orders", json=self.RECOMMENDATION_PAYLOAD)
        assert response.status_code == 201
        data = response.json()
        assert data["sku"] == "PCB-001"
        assert data["warehouse"] == "San Francisco"
        assert data["backlog_item_id"] is None
        assert data["status"] == "Pending"
        assert data["id"].startswith("PO-")

    def test_create_po_from_backlog(self, client):
        response = client.post("/api/purchase-orders", json=self.BACKLOG_PAYLOAD)
        assert response.status_code == 201
        data = response.json()
        assert data["backlog_item_id"] == "BL-001"
        assert data["sku"] is None
        assert data["warehouse"] is None
        assert data["status"] == "Pending"

    def test_create_po_invalid_payload_neither(self, client):
        response = client.post("/api/purchase-orders", json={
            "supplier_name": "Whoever",
            "quantity": 1,
            "unit_cost": 1.0,
            "expected_delivery_date": "2026-05-21",
        })
        assert response.status_code == 400

    def test_create_po_recommendation_missing_required_field(self, client):
        bad = {**self.RECOMMENDATION_PAYLOAD}
        del bad["supplier_name"]
        response = client.post("/api/purchase-orders", json=bad)
        # Pydantic validation kicks in before append; expect 422 (FastAPI default for validation).
        assert response.status_code == 422

    def test_get_po_by_id(self, client):
        post_resp = client.post("/api/purchase-orders", json=self.RECOMMENDATION_PAYLOAD)
        po_id = post_resp.json()["id"]

        get_resp = client.get(f"/api/purchase-orders/{po_id}")
        assert get_resp.status_code == 200
        assert get_resp.json()["id"] == po_id

    def test_get_po_by_backlog_id_fallback(self, client):
        client.post("/api/purchase-orders", json=self.BACKLOG_PAYLOAD)

        get_resp = client.get("/api/purchase-orders/BL-001")
        assert get_resp.status_code == 200
        assert get_resp.json()["backlog_item_id"] == "BL-001"

    def test_get_po_not_found(self, client):
        get_resp = client.get("/api/purchase-orders/PO-DOES-NOT-EXIST")
        assert get_resp.status_code == 404
