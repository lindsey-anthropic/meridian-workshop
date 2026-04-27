from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
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
    backlog_item_id: str
    supplier_name: str
    quantity: int
    unit_cost: float
    expected_delivery_date: str
    notes: Optional[str] = None

class Task(BaseModel):
    id: str
    title: str
    priority: str
    due_date: Optional[str] = None
    status: str = 'pending'

class CreateTaskRequest(BaseModel):
    title: str
    priority: str
    due_date: Optional[str] = None

# In-memory task store (resets on server restart)
_tasks: list = []
_task_counter: list = [0]

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

@app.get("/api/tasks", response_model=List[Task])
def get_tasks():
    return _tasks

@app.post("/api/tasks", response_model=Task, status_code=201)
def create_task(req: CreateTaskRequest):
    _task_counter[0] += 1
    task = {"id": f"task-{_task_counter[0]}", "title": req.title, "priority": req.priority,
            "due_date": req.due_date, "status": "pending"}
    _tasks.append(task)
    return task

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: str):
    global _tasks
    before = len(_tasks)
    _tasks = [t for t in _tasks if t["id"] != task_id]
    if len(_tasks) == before:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"deleted": task_id}

@app.patch("/api/tasks/{task_id}", response_model=Task)
def toggle_task(task_id: str):
    for t in _tasks:
        if t["id"] == task_id:
            t["status"] = "completed" if t["status"] == "pending" else "pending"
            return t
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/reports/quarterly")
def get_quarterly_reports(warehouse: Optional[str] = None, category: Optional[str] = None):
    """Get quarterly performance reports"""
    filtered = apply_filters(orders, warehouse, category)

    quarters = {}
    for order in filtered:
        order_date = order.get('order_date', '')
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

    result = []
    for q, data in quarters.items():
        if data['total_orders'] > 0:
            data['avg_order_value'] = round(data['total_revenue'] / data['total_orders'], 2)
            data['fulfillment_rate'] = round((data['delivered_orders'] / data['total_orders']) * 100, 1)
        result.append(data)

    result.sort(key=lambda x: x['quarter'])
    return result

@app.get("/api/reports/monthly-trends")
def get_monthly_trends(warehouse: Optional[str] = None, category: Optional[str] = None):
    """Get month-over-month trends"""
    filtered = apply_filters(orders, warehouse, category)

    months = {}
    for order in filtered:
        order_date = order.get('order_date', '')
        if not order_date:
            continue

        month = order_date[:7]

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

    result = list(months.values())
    result.sort(key=lambda x: x['month'])
    return result

@app.get("/api/restocking")
def get_restocking_recommendations(
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
    budget: Optional[float] = None
):
    """Recommend purchase orders based on stock levels, demand forecast, and budget."""
    filtered_inventory = apply_filters(inventory_items, warehouse, category)

    # Build SKU → demand lookup
    demand_by_sku = {d['item_sku']: d for d in demand_forecasts}

    recommendations = []
    for item in filtered_inventory:
        sku = item.get('sku')
        demand = demand_by_sku.get(sku)
        if not demand:
            continue

        forecasted = demand.get('forecasted_demand', 0)
        on_hand = item.get('quantity_on_hand', 0)
        unit_cost = item.get('unit_cost', 0)

        qty_to_order = max(0, int(forecasted - on_hand))
        if qty_to_order == 0:
            continue

        daily_demand = forecasted / 30
        days_of_stock = round(on_hand / daily_demand, 1) if daily_demand > 0 else 999

        if days_of_stock >= 30:
            continue

        if days_of_stock < 7:
            urgency = 'high'
        elif days_of_stock < 15:
            urgency = 'medium'
        else:
            urgency = 'low'

        recommendations.append({
            'sku': sku,
            'name': item.get('name'),
            'warehouse': item.get('warehouse'),
            'category': item.get('category'),
            'quantity_on_hand': on_hand,
            'days_of_stock': days_of_stock,
            'forecasted_demand': forecasted,
            'quantity_to_order': qty_to_order,
            'unit_cost': unit_cost,
            'line_total': round(qty_to_order * unit_cost, 2),
            'urgency': urgency,
            'budget_status': 'uncovered',
            'covered_quantity': 0,
            'covered_cost': 0.0
        })

    # Sort by urgency (days_of_stock ascending = most urgent first)
    recommendations.sort(key=lambda x: x['days_of_stock'])

    # Greedy budget allocation
    remaining = budget if budget is not None else None
    total_spend = 0.0
    items_covered = 0
    items_partial = 0
    items_uncovered = 0

    for rec in recommendations:
        line = rec['line_total']
        if remaining is None:
            rec['budget_status'] = 'covered'
            rec['covered_quantity'] = rec['quantity_to_order']
            rec['covered_cost'] = line
            items_covered += 1
            total_spend += line
        elif remaining >= line:
            rec['budget_status'] = 'covered'
            rec['covered_quantity'] = rec['quantity_to_order']
            rec['covered_cost'] = line
            remaining = round(remaining - line, 2)
            items_covered += 1
            total_spend += line
        elif remaining > 0:
            can_afford = int(remaining // rec['unit_cost'])
            if can_afford > 0:
                rec['budget_status'] = 'partial'
                rec['covered_quantity'] = can_afford
                rec['covered_cost'] = round(can_afford * rec['unit_cost'], 2)
                remaining = round(remaining - rec['covered_cost'], 2)
                items_partial += 1
                total_spend += rec['covered_cost']
            else:
                rec['budget_status'] = 'uncovered'
                items_uncovered += 1
            remaining = max(remaining, 0)
        else:
            rec['budget_status'] = 'uncovered'
            items_uncovered += 1

    return {
        'recommendations': recommendations,
        'summary': {
            'total_items_at_risk': len(recommendations),
            'items_covered': items_covered,
            'items_partial': items_partial,
            'items_uncovered': items_uncovered,
            'total_recommended_spend': round(total_spend, 2),
            'budget': budget,
            'budget_remaining': round(remaining, 2) if remaining is not None else None
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
