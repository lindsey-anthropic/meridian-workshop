from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from mock_data import inventory_items, orders, demand_forecasts, backlog_items, spending_summary, monthly_spending, category_spending, recent_transactions, purchase_orders

app = FastAPI(title="Factory Inventory Management System")

# Quarter mapping for date filtering
QUARTER_MAP = {
    'Q1-2025': ['2025-01', '2025-02', '2025-03'],
    'Q2-2025': ['2025-04', '2025-05', '2025-06'],
    'Q3-2025': ['2025-07', '2025-08', '2025-09'],
    'Q4-2025': ['2025-10', '2025-11', '2025-12']
}

def filter_by_month(items: list, month: Optional[str]) -> list:
    """Filter items by month/quarter based on order_date field"""
    if not month or month == 'all':
        return items

    if month.startswith('Q'):
        # Handle quarters
        if month in QUARTER_MAP:
            months = QUARTER_MAP[month]
            return [item for item in items if any(m in item.get('order_date', '') for m in months)]
    else:
        # Direct month match
        return [item for item in items if month in item.get('order_date', '')]

    return items

def apply_filters(items: list, warehouse: Optional[str] = None, category: Optional[str] = None,
                 status: Optional[str] = None) -> list:
    """Apply common filters to a list of items"""
    filtered = items

    if warehouse and warehouse != 'all':
        filtered = [item for item in filtered if item.get('warehouse') == warehouse]

    if category and category != 'all':
        filtered = [item for item in filtered if item.get('category', '').lower() == category.lower()]

    if status and status != 'all':
        filtered = [item for item in filtered if item.get('status', '').lower() == status.lower()]

    return filtered

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class InventoryItem(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    warehouse: str
    quantity_on_hand: int
    reorder_point: int
    unit_cost: float
    location: str
    last_updated: str

class Order(BaseModel):
    id: str
    order_number: str
    customer: str
    items: List[dict]
    status: str
    order_date: str
    expected_delivery: str
    total_value: float
    actual_delivery: Optional[str] = None
    warehouse: Optional[str] = None
    category: Optional[str] = None

class DemandForecast(BaseModel):
    id: str
    item_sku: str
    item_name: str
    current_demand: int
    forecasted_demand: int
    trend: str
    period: str

class BacklogItem(BaseModel):
    id: str
    order_id: str
    item_sku: str
    item_name: str
    quantity_needed: int
    quantity_available: int
    days_delayed: int
    priority: str
    has_purchase_order: Optional[bool] = False

class PurchaseOrder(BaseModel):
    id: str
    backlog_item_id: str
    supplier_name: str
    quantity: int
    unit_cost: float
    expected_delivery_date: str
    status: str
    created_date: str
    notes: Optional[str] = None

class CreatePurchaseOrderRequest(BaseModel):
    # Flexible: backlog-driven (Dashboard) or SKU-driven (Restocking)
    backlog_item_id: Optional[str] = None
    sku: Optional[str] = None
    item_name: Optional[str] = None
    supplier_name: Optional[str] = "TBD"
    quantity: int
    unit_cost: float
    expected_delivery_date: Optional[str] = None
    notes: Optional[str] = None

# Purchase-order id counter (store itself lives in mock_data.purchase_orders)
_po_counter = {"value": 0}

class Task(BaseModel):
    id: str
    title: str
    priority: str
    dueDate: str
    status: str

class CreateTaskRequest(BaseModel):
    title: str
    priority: str = "medium"
    dueDate: str

# In-memory task store (resets on restart, consistent with the JSON-file data layer)
tasks_store: List[dict] = []
_task_counter = {"value": 0}

# API endpoints
@app.get("/")
def root():
    return {"message": "Factory Inventory Management System API", "version": "1.0.0"}

@app.get("/api/inventory", response_model=List[InventoryItem])
def get_inventory(
    warehouse: Optional[str] = None,
    category: Optional[str] = None
):
    """Get all inventory items with optional filtering"""
    return apply_filters(inventory_items, warehouse, category)

@app.get("/api/inventory/{item_id}", response_model=InventoryItem)
def get_inventory_item(item_id: str):
    """Get a specific inventory item"""
    item = next((item for item in inventory_items if item["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@app.get("/api/orders", response_model=List[Order])
def get_orders(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    month: Optional[str] = None
):
    """Get all orders with optional filtering"""
    filtered_orders = apply_filters(orders, warehouse, category, status)
    filtered_orders = filter_by_month(filtered_orders, month)
    return filtered_orders

@app.get("/api/orders/{order_id}", response_model=Order)
def get_order(order_id: str):
    """Get a specific order"""
    order = next((order for order in orders if order["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.get("/api/demand", response_model=List[DemandForecast])
def get_demand_forecasts():
    """Get demand forecasts"""
    return demand_forecasts

@app.get("/api/backlog", response_model=List[BacklogItem])
def get_backlog():
    """Get backlog items with purchase order status"""
    # Add has_purchase_order flag to each backlog item
    result = []
    for item in backlog_items:
        item_dict = dict(item)
        # Check if this backlog item has a purchase order
        has_po = any(po["backlog_item_id"] == item["id"] for po in purchase_orders)
        item_dict["has_purchase_order"] = has_po
        result.append(item_dict)
    return result

@app.get("/api/dashboard/summary")
def get_dashboard_summary(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    month: Optional[str] = None
):
    """Get summary statistics for dashboard with optional filtering"""
    # Filter inventory
    filtered_inventory = apply_filters(inventory_items, warehouse, category)

    # Filter orders
    filtered_orders = apply_filters(orders, warehouse, category, status)
    filtered_orders = filter_by_month(filtered_orders, month)

    total_inventory_value = sum(item["quantity_on_hand"] * item["unit_cost"] for item in filtered_inventory)
    low_stock_items = len([item for item in filtered_inventory if item["quantity_on_hand"] <= item["reorder_point"]])
    pending_orders = len([order for order in filtered_orders if order["status"] in ["Processing", "Backordered"]])
    total_backlog_items = len(backlog_items)

    return {
        "total_inventory_value": round(total_inventory_value, 2),
        "low_stock_items": low_stock_items,
        "pending_orders": pending_orders,
        "total_backlog_items": total_backlog_items,
        "total_orders_value": sum(order["total_value"] for order in filtered_orders)
    }

@app.get("/api/spending/summary")
def get_spending_summary():
    """Get spending summary statistics"""
    return spending_summary

@app.get("/api/spending/monthly")
def get_monthly_spending():
    """Get monthly spending breakdown"""
    return monthly_spending

@app.get("/api/spending/categories")
def get_category_spending():
    """Get spending by category"""
    return category_spending

@app.get("/api/spending/transactions")
def get_recent_transactions():
    """Get recent transactions"""
    return recent_transactions

@app.get("/api/reports/quarterly")
def get_quarterly_reports(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    month: Optional[str] = None
):
    """Get quarterly performance reports with optional filtering"""
    # Apply the same filters as the rest of the application
    filtered_orders = apply_filters(orders, warehouse, category, status)
    filtered_orders = filter_by_month(filtered_orders, month)

    # Calculate quarterly statistics from orders
    quarters = {}

    for order in filtered_orders:
        order_date = order.get('order_date', '')
        # Determine quarter
        if '2025-01' in order_date or '2025-02' in order_date or '2025-03' in order_date:
            quarter = 'Q1-2025'
        elif '2025-04' in order_date or '2025-05' in order_date or '2025-06' in order_date:
            quarter = 'Q2-2025'
        elif '2025-07' in order_date or '2025-08' in order_date or '2025-09' in order_date:
            quarter = 'Q3-2025'
        elif '2025-10' in order_date or '2025-11' in order_date or '2025-12' in order_date:
            quarter = 'Q4-2025'
        else:
            continue

        if quarter not in quarters:
            quarters[quarter] = {
                'quarter': quarter,
                'total_orders': 0,
                'total_revenue': 0,
                'delivered_orders': 0,
                'avg_order_value': 0
            }

        quarters[quarter]['total_orders'] += 1
        quarters[quarter]['total_revenue'] += order.get('total_value', 0)
        if order.get('status') == 'Delivered':
            quarters[quarter]['delivered_orders'] += 1

    # Calculate averages and fulfillment rate
    result = []
    for q, data in quarters.items():
        if data['total_orders'] > 0:
            data['avg_order_value'] = round(data['total_revenue'] / data['total_orders'], 2)
            data['fulfillment_rate'] = round((data['delivered_orders'] / data['total_orders']) * 100, 1)
        result.append(data)

    # Sort by quarter
    result.sort(key=lambda x: x['quarter'])
    return result

@app.get("/api/reports/monthly-trends")
def get_monthly_trends(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    status: Optional[str] = None,
    month: Optional[str] = None
):
    """Get month-over-month trends with optional filtering"""
    filtered_orders = apply_filters(orders, warehouse, category, status)
    filtered_orders = filter_by_month(filtered_orders, month)

    months = {}

    for order in filtered_orders:
        order_date = order.get('order_date', '')
        if not order_date:
            continue

        # Extract month (format: YYYY-MM-DD)
        month = order_date[:7]  # Gets YYYY-MM

        if month not in months:
            months[month] = {
                'month': month,
                'order_count': 0,
                'revenue': 0,
                'delivered_count': 0
            }

        months[month]['order_count'] += 1
        months[month]['revenue'] += order.get('total_value', 0)
        if order.get('status') == 'Delivered':
            months[month]['delivered_count'] += 1

    # Convert to list and sort
    result = list(months.values())
    result.sort(key=lambda x: x['month'])
    return result

@app.get("/api/tasks", response_model=List[Task])
def get_tasks():
    """Get all user-created tasks"""
    return tasks_store

@app.post("/api/tasks", response_model=Task)
def create_task(task: CreateTaskRequest):
    """Create a new task"""
    _task_counter["value"] += 1
    new_task = {
        "id": f"api-{_task_counter['value']}",
        "title": task.title,
        "priority": task.priority,
        "dueDate": task.dueDate,
        "status": "pending"
    }
    tasks_store.insert(0, new_task)
    return new_task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    """Delete a task"""
    global tasks_store
    if not any(t["id"] == task_id for t in tasks_store):
        raise HTTPException(status_code=404, detail="Task not found")
    tasks_store = [t for t in tasks_store if t["id"] != task_id]
    return {"success": True}

@app.patch("/api/tasks/{task_id}", response_model=Task)
def toggle_task(task_id: str):
    """Toggle a task's completion status"""
    task = next((t for t in tasks_store if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task["status"] = "completed" if task["status"] == "pending" else "pending"
    return task

@app.get("/api/restocking/recommendations")
def get_restocking_recommendations(
    budget: float = 50000,
    warehouse: Optional[str] = None,
    category: Optional[str] = None
):
    """Recommend purchase orders from stock levels, demand forecast, and a budget ceiling.

    Items are ranked by an urgency score (how far below target, demand trend, and whether
    they are below their reorder point), then greedily selected within the budget.
    """
    # Honor the shared warehouse/category filters
    items = apply_filters(inventory_items, warehouse, category)

    # Index demand forecasts by SKU for an O(1) join
    demand_by_sku = {d["item_sku"]: d for d in demand_forecasts}
    trend_weight = {"increasing": 0.3, "stable": 0.1, "decreasing": 0.0}

    candidates = []
    for item in items:
        forecast = demand_by_sku.get(item["sku"])
        forecasted_demand = forecast["forecasted_demand"] if forecast else 0
        trend = forecast["trend"] if forecast else "stable"

        on_hand = item["quantity_on_hand"]
        reorder_point = item["reorder_point"]
        target = max(reorder_point, forecasted_demand)
        recommended_qty = max(0, target - on_hand)

        # Only items that actually need restocking
        if recommended_qty <= 0:
            continue

        coverage_gap = (1 - (on_hand / target)) if target > 0 else 0
        below_reorder = on_hand <= reorder_point
        score = round(coverage_gap + trend_weight.get(trend, 0.1) + (0.3 if below_reorder else 0), 3)
        urgency = "High" if score >= 0.8 else "Medium" if score >= 0.5 else "Low"

        candidates.append({
            "sku": item["sku"],
            "name": item["name"],
            "category": item["category"],
            "warehouse": item["warehouse"],
            "quantity_on_hand": on_hand,
            "reorder_point": reorder_point,
            "forecasted_demand": forecasted_demand,
            "trend": trend,
            "target_level": target,
            "recommended_qty": recommended_qty,
            "unit_cost": item["unit_cost"],
            "estimated_cost": round(recommended_qty * item["unit_cost"], 2),
            "urgency": urgency,
            "urgency_score": score,
        })

    # Rank by urgency desc, then cheaper first (so remaining budget absorbs more)
    candidates.sort(key=lambda c: (-c["urgency_score"], c["estimated_cost"]))

    # Greedy budget fill
    spent = 0.0
    recommended_count = 0
    for c in candidates:
        if spent + c["estimated_cost"] <= budget:
            c["recommended"] = True
            c["reason"] = "Within budget"
            spent = round(spent + c["estimated_cost"], 2)
            recommended_count += 1
        else:
            c["recommended"] = False
            c["reason"] = "Exceeds remaining budget"

    return {
        "budget": budget,
        "recommendations": candidates,
        "summary": {
            "total_items": len(candidates),
            "recommended_count": recommended_count,
            "deferred_count": len(candidates) - recommended_count,
            "total_cost": round(spent, 2),
            "budget_remaining": round(budget - spent, 2),
        },
    }

@app.get("/api/purchase-orders")
def list_purchase_orders():
    """List all purchase orders created this session."""
    return purchase_orders

@app.post("/api/purchase-orders")
def create_purchase_order(po: CreatePurchaseOrderRequest):
    """Create a purchase order (from a backlog item or a restocking recommendation)."""
    _po_counter["value"] += 1
    new_po = {
        "id": f"po-{_po_counter['value']}",
        "backlog_item_id": po.backlog_item_id,
        "sku": po.sku,
        "item_name": po.item_name,
        "supplier_name": po.supplier_name or "TBD",
        "quantity": po.quantity,
        "unit_cost": po.unit_cost,
        "estimated_cost": round(po.quantity * po.unit_cost, 2),
        "expected_delivery_date": po.expected_delivery_date,
        "status": "Pending",
        "created_date": datetime.now().strftime("%Y-%m-%d"),
        "notes": po.notes,
    }
    purchase_orders.append(new_po)
    return new_po

@app.get("/api/purchase-orders/{backlog_item_id}")
def get_purchase_order_by_backlog_item(backlog_item_id: str):
    """Get the purchase order linked to a given backlog item."""
    po = next((p for p in purchase_orders if p.get("backlog_item_id") == backlog_item_id), None)
    if not po:
        raise HTTPException(status_code=404, detail="Purchase order not found")
    return po

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
