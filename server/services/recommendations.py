"""
Restocking recommendation algorithm. Side-effect free; takes data lists in,
returns a list of recommendation dicts ready for Pydantic serialisation.

Algorithm per proposal section 3.2 (technical-approach.md):
    threshold = (forecasted_demand / 30) * lead_time_days + safety_stock
    candidates = items where quantity_on_hand < threshold
    ordered lexicographically by (criticality desc, margin desc, volume desc)
    budget allocation: greedy fill in order; over-budget items flagged 'deferred'
"""

import math
from typing import Optional

from calibration import get_params


# CALIBRATE: forecast period assumption.
# All records in demand_forecasts.json carry period="Next 30 days"; the algorithm
# treats forecasted_demand as a 30-day total. If the forecast horizon ever varies
# per record, this constant collapses into a per-row read.
FORECAST_PERIOD_DAYS = 30.0


def compute_recommendations(
    inventory: list[dict],
    forecasts: list[dict],
    purchase_orders: list[dict],
    budget: Optional[float],
) -> list[dict]:
    forecast_by_sku = {f['item_sku']: f for f in forecasts}
    po_keys = {(po.get('sku'), po.get('warehouse')) for po in purchase_orders if po.get('sku')}

    candidates: list[dict] = []
    for item in inventory:
        cal = get_params(item['sku'], item.get('category', ''))

        forecast = forecast_by_sku.get(item['sku'])
        # CALIBRATE: when a SKU has no forecast row, fall back to reorder_point as a
        # 30-day demand proxy. Real engagement supplies forecasts for every active SKU.
        forecasted_demand = forecast['forecasted_demand'] if forecast else item['reorder_point']
        daily_demand = forecasted_demand / FORECAST_PERIOD_DAYS

        # CALIBRATE: using reorder_point as the safety_stock proxy until VP Ops
        # provides per-SKU service-level targets in week 1.
        safety_stock = item['reorder_point']

        threshold = daily_demand * cal.lead_time_days + safety_stock
        on_hand = item['quantity_on_hand']
        if on_hand >= threshold:
            continue

        shortage_units = threshold - on_hand
        recommended_quantity = max(0, math.ceil(shortage_units))
        unit_cost = float(item['unit_cost'])
        estimated_cost = recommended_quantity * unit_cost

        criticality = cal.cost_of_stockout_per_unit_per_day * shortage_units
        margin = cal.unit_margin_ratio * unit_cost * recommended_quantity

        candidates.append({
            'id': f"REC-{item['sku']}-{item['warehouse']}",
            'sku': item['sku'],
            'name': item['name'],
            'category': item['category'],
            'warehouse': item['warehouse'],
            'quantity_on_hand': on_hand,
            'threshold': round(threshold, 2),
            'shortage_units': round(shortage_units, 2),
            'recommended_quantity': recommended_quantity,
            'unit_cost': unit_cost,
            'estimated_cost': round(estimated_cost, 2),
            'criticality': round(criticality, 4),
            'margin': round(margin, 2),
            'status': 'recommended',
            'po_issued': (item['sku'], item['warehouse']) in po_keys,
            'preferred_supplier': cal.preferred_supplier,
            'lead_time_days': cal.lead_time_days,
        })

    # Strict lexicographic sort per proposal section 3.2:
    # criticality first, unit margin and order volume as tiebreakers.
    candidates.sort(
        key=lambda r: (-r['criticality'], -r['margin'], -r['recommended_quantity'])
    )

    if budget is not None:
        running = 0.0
        for rec in candidates:
            if running + rec['estimated_cost'] <= budget:
                rec['status'] = 'recommended'
                running += rec['estimated_cost']
            else:
                rec['status'] = 'deferred'

    return candidates
