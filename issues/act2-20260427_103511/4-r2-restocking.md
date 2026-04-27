# 4 — R2 Restocking View
> Files to create: `server/main.py` (endpoint), `client/src/views/Restocking.vue`
> Files to modify: `client/src/api.js`, `client/src/App.vue` (nav entry)
> Use Plan Mode (Shift+Tab) before starting

## Architecture

```
Operator enters budget ceiling + optional filters
    ↓
GET /api/restocking?budget=50000&warehouse=SF&category=Sensors
    ↓
FastAPI:
  1. Filter inventory items below reorder point
  2. Cross-reference with demand forecasts for trend
  3. Calculate priority score per item
  4. Sort by priority score DESC
  5. Trim list to fit within budget ceiling
    ↓
[ { sku, name, qty_to_order, unit_cost, total_cost, priority_score, trend }, ... ]
    ↓
Vue: recommendations table + budget tracker bar
```

## Backend — new endpoint

**File:** `server/main.py`

### Pydantic model
```python
class RestockingRecommendation(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    warehouse: str
    current_stock: int
    reorder_point: int
    qty_to_order: int
    unit_cost: float
    total_cost: float
    priority_score: float
    demand_trend: str          # "increasing" | "stable" | "decreasing"
    days_to_stockout: Optional[int] = None
```

### Priority score logic
```python
TREND_WEIGHT = {"increasing": 1.5, "stable": 1.0, "decreasing": 0.5}

def calc_priority(item, forecast):
    stock_gap = item["reorder_point"] - item["quantity_on_hand"]
    trend_w = TREND_WEIGHT.get(forecast.get("trend", "stable"), 1.0)
    return round(stock_gap * trend_w * item["unit_cost"], 2)
```

### Endpoint signature
```python
@app.get("/api/restocking", response_model=List[RestockingRecommendation])
def get_restocking_recommendations(
    budget: float = Query(..., gt=0),
    warehouse: Optional[str] = None,
    category: Optional[str] = None,
):
```

## Frontend — new view

**File:** `client/src/views/Restocking.vue`

### Layout
```
┌─────────────────────────────────────────┐
│  Budget ceiling: [___________] [Apply]  │
│  Warehouse: [All ▼]  Category: [All ▼]  │
├─────────────────────────────────────────┤
│  Budget used: $32,450 / $50,000 (64%)   │
│  [████████████░░░░░░░]                  │
├─────────────────────────────────────────┤
│  SKU  | Name | Qty | Unit$ | Total$ | P │
│  ···  | ···  | ··· | ····  | ·····  | H │
│  ···  | ···  | ··· | ····  | ·····  | M │
└─────────────────────────────────────────┘
```

### Composition API structure
```javascript
setup() {
  const budget = ref(50000)
  const recommendations = ref([])
  const loading = ref(false)
  const { selectedLocation, selectedCategory } = useFilters()

  const budgetUsed = computed(() =>
    recommendations.value.reduce((sum, r) => sum + r.total_cost, 0)
  )

  const budgetPercent = computed(() =>
    Math.min(100, (budgetUsed.value / budget.value) * 100)
  )

  const loadRecommendations = async () => { ... }

  watch([budget, selectedLocation, selectedCategory], loadRecommendations)
}
```

## api.js — add

```javascript
async getRestockingRecommendations(budget, filters = {}) {
  const params = new URLSearchParams({ budget })
  if (filters.warehouse && filters.warehouse !== 'all')
    params.append('warehouse', filters.warehouse)
  if (filters.category && filters.category !== 'all')
    params.append('category', filters.category)
  const response = await axios.get(`${API_BASE_URL}/restocking?${params}`)
  return response.data
},
```

## App.vue — add nav entry

```javascript
{ path: '/restocking', name: 'Restocking', icon: '📦' }
```

## Suggested prompt

```
[Shift+Tab — Plan Mode]
I want to build the Restocking view for Meridian.
Backend: new GET /api/restocking endpoint in server/main.py
  - params: budget (required), warehouse, category
  - logic: items below reorder point × demand trend → priority score → trim to budget
Frontend: client/src/views/Restocking.vue
  - budget input + filters, recommendations table, budget tracker
Composition API, consistent with existing views.
Propose the plan before writing any code.
```
