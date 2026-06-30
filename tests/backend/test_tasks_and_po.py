"""
Tests for the task and purchase-order write endpoints.

These endpoints are in-memory (no persistence across restarts), so tests assert
relative effects (create -> appears, delete -> gone) and are self-contained by
keying on the ids they create rather than on global counts.
"""
import pytest


class TestTaskEndpoints:
    """In-memory task CRUD."""

    def test_get_tasks_returns_list(self, client):
        response = client.get("/api/tasks")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_create_task_returns_stored_task(self, client):
        payload = {"title": "Audit Q4 stock", "priority": "high", "dueDate": "2026-07-15"}
        response = client.post("/api/tasks", json=payload)
        assert response.status_code == 200
        task = response.json()
        assert task["id"]
        assert task["title"] == "Audit Q4 stock"
        assert task["priority"] == "high"
        assert task["status"] == "pending"

        # The created task is retrievable via GET.
        ids = [t["id"] for t in client.get("/api/tasks").json()]
        assert task["id"] in ids

    def test_create_task_requires_title(self, client):
        assert client.post("/api/tasks", json={"priority": "low"}).status_code == 422

    def test_toggle_task_flips_status(self, client):
        task = client.post("/api/tasks", json={"title": "Toggle me", "dueDate": "2026-07-01"}).json()
        toggled = client.patch(f"/api/tasks/{task['id']}").json()
        assert toggled["status"] == "completed"
        again = client.patch(f"/api/tasks/{task['id']}").json()
        assert again["status"] == "pending"

    def test_delete_task_removes_it(self, client):
        task = client.post("/api/tasks", json={"title": "Delete me", "dueDate": "2026-07-01"}).json()
        assert client.delete(f"/api/tasks/{task['id']}").status_code == 200
        ids = [t["id"] for t in client.get("/api/tasks").json()]
        assert task["id"] not in ids

    def test_toggle_missing_task_returns_404(self, client):
        assert client.patch("/api/tasks/does-not-exist").status_code == 404

    def test_delete_missing_task_returns_404(self, client):
        assert client.delete("/api/tasks/does-not-exist").status_code == 404


class TestPurchaseOrderEndpoints:
    """In-memory purchase orders and the backlog has_purchase_order linkage."""

    def _a_backlog_id(self, client):
        backlog = client.get("/api/backlog").json()
        assert backlog, "expected backlog items to exist"
        return backlog[0]["id"]

    def test_create_purchase_order(self, client):
        backlog_id = self._a_backlog_id(client)
        payload = {
            "backlog_item_id": backlog_id,
            "supplier_name": "Acme Supply Co",
            "quantity": 100,
            "unit_cost": 12.5,
            "expected_delivery_date": "2026-08-01",
            "notes": "Rush order",
        }
        response = client.post("/api/purchase-orders", json=payload)
        assert response.status_code == 200
        po = response.json()
        assert po["id"]
        assert po["backlog_item_id"] == backlog_id
        assert po["status"] == "Pending"
        assert po["created_date"]

    def test_create_po_flips_has_purchase_order_flag(self, client):
        backlog_id = self._a_backlog_id(client)
        client.post("/api/purchase-orders", json={
            "backlog_item_id": backlog_id,
            "supplier_name": "Acme Supply Co",
            "quantity": 50,
            "unit_cost": 9.99,
            "expected_delivery_date": "2026-08-01",
        })
        backlog = client.get("/api/backlog").json()
        target = next(b for b in backlog if b["id"] == backlog_id)
        assert target["has_purchase_order"] is True

    def test_get_purchase_order_by_backlog_item(self, client):
        backlog_id = self._a_backlog_id(client)
        client.post("/api/purchase-orders", json={
            "backlog_item_id": backlog_id,
            "supplier_name": "Acme Supply Co",
            "quantity": 25,
            "unit_cost": 5.0,
            "expected_delivery_date": "2026-08-01",
        })
        response = client.get(f"/api/purchase-orders/{backlog_id}")
        assert response.status_code == 200
        assert response.json()["backlog_item_id"] == backlog_id

    def test_get_purchase_order_missing_returns_404(self, client):
        assert client.get("/api/purchase-orders/no-such-backlog-item").status_code == 404

    def test_create_po_requires_fields(self, client):
        # Missing required fields (supplier_name, quantity, ...) -> validation error.
        assert client.post("/api/purchase-orders", json={"backlog_item_id": "x"}).status_code == 422
