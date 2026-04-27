"""
Tests for the restocking recommendations endpoint (RFP R2).
"""


class TestRecommendationsEndpoint:
    """Test suite for /api/recommendations."""

    REQUIRED_RECOMMENDATION_FIELDS = [
        "id", "sku", "name", "category", "warehouse",
        "quantity_on_hand", "threshold", "shortage_units",
        "recommended_quantity", "unit_cost", "estimated_cost",
        "criticality", "margin", "status", "po_issued",
        "preferred_supplier", "lead_time_days",
    ]

    REQUIRED_ENVELOPE_FIELDS = [
        "recommendations", "budget",
        "total_recommended_cost", "total_deferred_cost",
        "budget_utilization", "warehouse", "category",
    ]

    def test_get_recommendations_returns_envelope(self, client):
        response = client.get("/api/recommendations")
        assert response.status_code == 200

        data = response.json()
        for key in self.REQUIRED_ENVELOPE_FIELDS:
            assert key in data, f"missing envelope field: {key}"
        assert isinstance(data["recommendations"], list)

    def test_recommendation_required_fields(self, client):
        response = client.get("/api/recommendations")
        data = response.json()
        if not data["recommendations"]:
            return  # nothing to validate
        rec = data["recommendations"][0]
        for field in self.REQUIRED_RECOMMENDATION_FIELDS:
            assert field in rec, f"missing recommendation field: {field}"

    def test_recommendations_filtered_by_warehouse(self, client):
        response = client.get("/api/recommendations?warehouse=Tokyo")
        assert response.status_code == 200
        for rec in response.json()["recommendations"]:
            assert rec["warehouse"] == "Tokyo"

    def test_recommendations_filtered_by_category_case_insensitive(self, client):
        response = client.get("/api/recommendations?category=circuit boards")
        assert response.status_code == 200
        for rec in response.json()["recommendations"]:
            assert rec["category"].lower() == "circuit boards"

    def test_recommendations_excludes_well_stocked_skus(self, client):
        response = client.get("/api/recommendations")
        for rec in response.json()["recommendations"]:
            # Every returned recommendation must be below its threshold —
            # well-stocked SKUs must not appear at all.
            assert rec["quantity_on_hand"] < rec["threshold"]
            assert rec["recommended_quantity"] > 0

    def test_no_budget_recommends_all(self, client):
        response = client.get("/api/recommendations")
        for rec in response.json()["recommendations"]:
            assert rec["status"] == "recommended"

    def test_budget_zero_defers_all(self, client):
        response = client.get("/api/recommendations?budget=0")
        data = response.json()
        if not data["recommendations"]:
            return
        for rec in data["recommendations"]:
            assert rec["status"] == "deferred"
        assert data["total_recommended_cost"] == 0

    def test_budget_classifies_deferred_items(self, client):
        # Pull total cost first, then choose a budget below it.
        full = client.get("/api/recommendations").json()
        total = sum(r["estimated_cost"] for r in full["recommendations"])
        if total == 0:
            return  # no candidates exist; nothing to classify
        budget = total / 2

        response = client.get(f"/api/recommendations?budget={budget}")
        data = response.json()
        statuses = {r["status"] for r in data["recommendations"]}
        assert "deferred" in statuses, "expected at least one deferred item under half-budget"

        recommended_cost = sum(
            r["estimated_cost"] for r in data["recommendations"] if r["status"] == "recommended"
        )
        assert recommended_cost <= budget + 0.01  # float tolerance
        assert data["total_recommended_cost"] == round(recommended_cost, 2)

    def test_priority_sort_lexicographic(self, client):
        response = client.get("/api/recommendations")
        recs = response.json()["recommendations"]
        # Sort key per proposal section 3.2: criticality desc, margin desc, qty desc.
        for prev, curr in zip(recs, recs[1:]):
            prev_key = (prev["criticality"], prev["margin"], prev["recommended_quantity"])
            curr_key = (curr["criticality"], curr["margin"], curr["recommended_quantity"])
            assert prev_key >= curr_key, f"lex order violated: {prev_key} -> {curr_key}"

    def test_po_issued_flag_after_post(self, client):
        recs = client.get("/api/recommendations").json()["recommendations"]
        if not recs:
            return  # nothing to test against
        target = recs[0]

        post_resp = client.post("/api/purchase-orders", json={
            "sku": target["sku"],
            "warehouse": target["warehouse"],
            "quantity": target["recommended_quantity"],
            "unit_cost": target["unit_cost"],
            "supplier_name": target["preferred_supplier"],
            "expected_delivery_date": "2026-05-21",
            "notes": "test"
        })
        assert post_resp.status_code == 201

        refresh = client.get("/api/recommendations").json()
        match = next(
            (r for r in refresh["recommendations"]
             if r["sku"] == target["sku"] and r["warehouse"] == target["warehouse"]),
            None,
        )
        assert match is not None, "target SKU disappeared after POST"
        assert match["po_issued"] is True

    def test_budget_utilization_when_budget_set(self, client):
        full = client.get("/api/recommendations").json()
        total = sum(r["estimated_cost"] for r in full["recommendations"])
        if total == 0:
            return
        budget = total * 2  # generous, all should fit
        data = client.get(f"/api/recommendations?budget={budget}").json()
        assert data["budget"] == budget
        assert data["budget_utilization"] is not None
        assert 0 <= data["budget_utilization"] <= 1

    def test_no_budget_utilization_is_none(self, client):
        data = client.get("/api/recommendations").json()
        assert data["budget"] is None
        assert data["budget_utilization"] is None
