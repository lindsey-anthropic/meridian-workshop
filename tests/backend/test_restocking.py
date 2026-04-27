"""Tests for the restocking recommendation endpoint."""


def test_returns_200_with_valid_budget(client):
    response = client.get("/api/restocking/recommend?budget=500000")
    assert response.status_code == 200
    body = response.json()
    assert set(body.keys()) == {
        "budget", "total_recommended_cost", "remaining_budget", "recommendations", "skipped"
    }


def test_total_cost_does_not_exceed_budget(client):
    response = client.get("/api/restocking/recommend?budget=100000")
    body = response.json()
    assert body["total_recommended_cost"] <= body["budget"] + 0.01
    assert body["remaining_budget"] >= -0.01


def test_recommendations_ranked_by_risk_score_descending(client):
    response = client.get("/api/restocking/recommend?budget=10000000")
    body = response.json()
    scores = [r["risk_score"] for r in body["recommendations"]]
    assert scores == sorted(scores, reverse=True)


def test_recommendation_shape(client):
    response = client.get("/api/restocking/recommend?budget=500000")
    body = response.json()
    assert len(body["recommendations"]) > 0, "Sample data should produce at least one recommendation"
    rec = body["recommendations"][0]
    assert set(rec.keys()) == {
        "sku", "name", "category", "warehouse",
        "current_stock", "reorder_point", "forecasted_demand",
        "recommended_quantity", "unit_cost", "line_total",
        "risk_score", "rationale_key",
    }
    assert rec["rationale_key"] in {
        "below_reorder_with_demand", "below_reorder", "forecast_only"
    }
    # line_total should equal qty * unit_cost (within float tolerance)
    assert abs(rec["line_total"] - rec["recommended_quantity"] * rec["unit_cost"]) < 0.01


def test_missing_budget_returns_422(client):
    response = client.get("/api/restocking/recommend")
    assert response.status_code == 422


def test_zero_or_negative_budget_returns_422(client):
    assert client.get("/api/restocking/recommend?budget=0").status_code == 422
    assert client.get("/api/restocking/recommend?budget=-100").status_code == 422


def test_warehouse_filter_narrows_input(client):
    full = client.get("/api/restocking/recommend?budget=10000000").json()
    london = client.get("/api/restocking/recommend?budget=10000000&warehouse=London").json()

    london_warehouses = {r["warehouse"] for r in london["recommendations"]}
    assert london_warehouses.issubset({"London"})

    # The London-only result should never produce more recommendations than the full set.
    assert len(london["recommendations"]) <= len(full["recommendations"])


def test_category_filter_narrows_input(client):
    response = client.get("/api/restocking/recommend?budget=10000000&category=Sensors").json()
    cats = {r["category"] for r in response["recommendations"]}
    assert cats.issubset({"Sensors"})


def test_low_budget_skips_some_lines(client):
    # A very low budget should produce at least one skipped item if the unfiltered
    # recommendation set has more than one risk-positive SKU.
    full = client.get("/api/restocking/recommend?budget=10000000").json()
    if len(full["recommendations"]) <= 1:
        return  # Not enough variation in sample data to test budget pressure

    low = client.get("/api/restocking/recommend?budget=100").json()
    assert len(low["skipped"]) >= 1
    for s in low["skipped"]:
        assert s["reason_key"] == "insufficient_remaining_budget"


def test_recommendation_quantity_brings_stock_to_target(client):
    """A recommended quantity should be enough to reach max(reorder_point, forecast)."""
    response = client.get("/api/restocking/recommend?budget=10000000").json()
    for rec in response["recommendations"]:
        target = max(rec["reorder_point"], rec["forecasted_demand"])
        assert rec["current_stock"] + rec["recommended_quantity"] >= target


def test_skus_with_no_forecast_can_still_appear(client):
    """SKUs with no demand forecast should still be scored on shortage alone."""
    response = client.get("/api/restocking/recommend?budget=10000000").json()
    # If any recommendation has forecasted_demand == 0, it must use the below_reorder rationale
    for rec in response["recommendations"]:
        if rec["forecasted_demand"] == 0:
            assert rec["rationale_key"] == "below_reorder"
