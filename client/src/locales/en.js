export default {
  // Navigation
  nav: {
    overview: 'Overview',
    inventory: 'Inventory',
    orders: 'Orders',
    finance: 'Finance',
    demandForecast: 'Demand Forecast',
    restocking: 'Restocking',
    companyName: 'Catalyst Components',
    subtitle: 'Inventory Management System'
  },

  // Dashboard
  dashboard: {
    title: 'Overview',
    kpi: {
      title: 'Key Performance Indicators',
      inventoryTurnover: 'Inventory Turnover Rate',
      ordersFulfilled: 'Orders Fulfilled',
      orderFillRate: 'Order Fill Rate',
      revenue: 'Revenue (Orders)',
      revenueYTD: 'Revenue (Orders) YTD',
      revenueMTD: 'Revenue (Orders) MTD',
      avgProcessingTime: 'Avg Processing Time (Days)',
      goal: 'Goal'
    },
    summary: {
      title: 'Summary'
    },
    orderHealth: {
      title: 'Order Health',
      totalOrders: 'Total Orders',
      revenue: 'Revenue',
      avgOrderValue: 'Avg Order Value',
      onTimeRate: 'On-Time Rate',
      avgFulfillmentDays: 'Avg Fulfillment (Days)',
      total: 'Total'
    },
    ordersByMonth: {
      title: 'Orders by Month'
    },
    inventoryValue: {
      title: 'Inventory Value by Category'
    },
    inventoryShortages: {
      title: 'Inventory Shortages',
      noShortages: 'No inventory shortages - all orders can be fulfilled!',
      noData: 'No inventory data for selected filters',
      orderId: 'Order ID',
      sku: 'SKU',
      itemName: 'Item Name',
      quantityNeeded: 'Quantity Needed',
      quantityAvailable: 'Quantity Available',
      shortage: 'Shortage',
      daysDelayed: 'Days Delayed',
      priority: 'Priority',
      unitsShort: 'units short',
      days: 'days'
    },
    topProducts: {
      title: 'Top Products by Revenue',
      sku: 'SKU',
      product: 'Product',
      category: 'Category',
      warehouse: 'Warehouse',
      stockStatus: 'Stock Status',
      revenue: 'Revenue',
      unitsOrdered: 'Units Ordered',
      firstOrder: 'First Order',
      inStock: 'In Stock',
      lowStock: 'Low Stock'
    }
  },

  // Inventory
  inventory: {
    title: 'Inventory',
    description: 'Track and manage all inventory items',
    stockLevels: 'Stock Levels',
    skus: 'SKUs',
    searchPlaceholder: 'Search by item name...',
    clearSearch: 'Clear search',
    totalItems: 'Total Items',
    totalValue: 'Total Value',
    lowStockItems: 'Low Stock Items',
    warehouses: 'Warehouses',
    table: {
      sku: 'SKU',
      itemName: 'Item Name',
      name: 'Name',
      category: 'Category',
      warehouse: 'Warehouse',
      quantity: 'Quantity',
      quantityOnHand: 'Quantity on Hand',
      reorderPoint: 'Reorder Point',
      unitCost: 'Unit Cost',
      unitPrice: 'Unit Price',
      totalValue: 'Total Value',
      location: 'Location',
      status: 'Status'
    }
  },

  // Orders
  orders: {
    title: 'Orders',
    description: 'View and manage customer orders',
    allOrders: 'All Orders',
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    avgOrderValue: 'Avg Order Value',
    onTimeDelivery: 'On-Time Delivery',
    itemsCount: '{count} items',
    quantity: 'Qty',
    table: {
      orderNumber: 'Order Number',
      orderId: 'Order ID',
      orderDate: 'Order Date',
      date: 'Date',
      customer: 'Customer',
      category: 'Category',
      warehouse: 'Warehouse',
      items: 'Items',
      value: 'Value',
      totalValue: 'Total Value',
      status: 'Status',
      expectedDelivery: 'Expected Delivery',
      actualDelivery: 'Actual Delivery'
    }
  },

  // Finance/Spending
  finance: {
    title: 'Finance Dashboard',
    description: 'Track revenue, costs, and financial performance',
    totalRevenue: 'Total Revenue',
    totalCosts: 'Total Costs',
    netProfit: 'Net Profit',
    avgOrderValue: 'Avg Order Value',
    fromOrders: 'From {count} orders',
    costBreakdown: 'Procurement + Operational + Labor + Overhead',
    margin: 'margin',
    perOrderRevenue: 'Per order revenue',
    revenueVsCosts: {
      title: 'Monthly Revenue vs Costs',
      revenue: 'Revenue',
      costs: 'Total Costs'
    },
    monthlyCostFlow: {
      title: 'Monthly Cost Flow',
      procurement: 'Procurement',
      operational: 'Operational',
      labor: 'Labor',
      overhead: 'Overhead'
    },
    categorySpending: {
      title: 'Spending by Category',
      ofTotal: 'of total'
    },
    transactions: {
      title: 'Recent Transactions',
      id: 'ID',
      description: 'Description',
      vendor: 'Vendor',
      date: 'Date',
      amount: 'Amount'
    }
  },

  // Demand Forecast
  demand: {
    title: 'Demand Forecast',
    description: 'Analyze demand trends and forecasts',
    increasingDemand: 'Increasing Demand',
    stableDemand: 'Stable Demand',
    decreasingDemand: 'Decreasing Demand',
    itemsCount: '{count} items',
    more: 'more...',
    demandForecasts: 'Demand Forecasts',
    table: {
      sku: 'SKU',
      itemName: 'Item Name',
      currentDemand: 'Current Demand',
      forecastedDemand: 'Forecasted Demand',
      change: 'Change',
      trend: 'Trend',
      period: 'Period'
    }
  },

  // Filters
  filters: {
    timePeriod: 'Time Period',
    location: 'Location',
    category: 'Category',
    orderStatus: 'Order Status',
    all: 'All',
    allMonths: 'All Months'
  },

  // Statuses
  status: {
    delivered: 'Delivered',
    shipped: 'Shipped',
    processing: 'Processing',
    backordered: 'Backordered',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    adequate: 'Adequate'
  },

  // Trends
  trends: {
    increasing: 'increasing',
    stable: 'stable',
    decreasing: 'decreasing'
  },

  // Priority
  priority: {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  },

  // Categories
  categories: {
    circuitBoards: 'Circuit Boards',
    sensors: 'Sensors',
    actuators: 'Actuators',
    controllers: 'Controllers',
    powerSupplies: 'Power Supplies'
  },

  // Spending Categories
  spendingCategories: {
    rawMaterials: 'Raw Materials',
    components: 'Components',
    equipment: 'Equipment',
    consumables: 'Consumables'
  },

  // Warehouses
  warehouses: {
    sanFrancisco: 'San Francisco',
    london: 'London',
    tokyo: 'Tokyo'
  },

  // Months
  months: {
    jan: 'Jan',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'May',
    jun: 'Jun',
    jul: 'Jul',
    aug: 'Aug',
    sep: 'Sep',
    oct: 'Oct',
    nov: 'Nov',
    dec: 'Dec',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December'
  },

  // Profile Menu
  profile: {
    profileDetails: 'Profile Details',
    myTasks: 'My Tasks',
    logout: 'Logout'
  },

  // Profile Details Modal
  profileDetails: {
    title: 'Profile Details',
    email: 'Email',
    department: 'Department',
    location: 'Location',
    phone: 'Phone',
    joinDate: 'Join Date',
    employeeId: 'Employee ID',
    close: 'Close'
  },

  // Tasks Modal
  tasks: {
    title: 'My Tasks',
    taskTitle: 'Task Title',
    taskTitlePlaceholder: 'Enter task title...',
    priority: 'Priority',
    dueDate: 'Due Date',
    addTask: 'Add Task',
    noTasks: 'No tasks yet. Add your first task above!'
  },

  // Language
  language: {
    english: 'English',
    japanese: 'Japanese',
    selectLanguage: 'Select Language'
  },

  // Restocking
  restocking: {
    title: 'Restocking Recommendations',
    description: 'Purchase order recommendations based on stock levels, demand forecasts, and budget',
    budgetLabel: 'Budget Ceiling',
    budgetPlaceholder: 'No limit',
    itemsRecommended: 'Items Recommended',
    totalCost: 'Total Cost',
    budgetRemaining: 'Budget Remaining',
    noBudgetSet: 'No limit',
    noItems: 'No items are currently at or below their reorder point.',
    noItemsBudget: 'No items fit within the specified budget.',
    table: {
      sku: 'SKU',
      itemName: 'Item Name',
      warehouse: 'Warehouse',
      category: 'Category',
      stockVsReorder: 'Stock / Reorder',
      recommendedQty: 'Recommended Qty',
      unitCost: 'Unit Cost',
      lineTotal: 'Line Total',
      trend: 'Demand Trend',
      urgency: 'Urgency'
    }
  },

  // Reports
  reports: {
    title: 'Performance Reports',
    description: 'View quarterly performance metrics and monthly trends',
    quarterlyPerformance: 'Quarterly Performance',
    monthlyRevenueTrend: 'Monthly Revenue Trend',
    momAnalysis: 'Month-over-Month Analysis',
    table: {
      quarter: 'Quarter',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      avgOrderValue: 'Avg Order Value',
      fulfillmentRate: 'Fulfillment Rate',
      month: 'Month',
      orders: 'Orders',
      revenue: 'Revenue',
      change: 'Change',
      growthRate: 'Growth Rate'
    },
    stats: {
      totalRevenueYTD: 'Total Revenue (YTD)',
      avgMonthlyRevenue: 'Avg Monthly Revenue',
      totalOrdersYTD: 'Total Orders (YTD)',
      bestQuarter: 'Best Performing Quarter'
    }
  },

  // Product Names
  productNames: {
    'Single Layer PCB Assembly': 'Single Layer PCB Assembly',
    'Dual Layer PCB Assembly': 'Dual Layer PCB Assembly',
    'Multi Layer PCB Assembly': 'Multi Layer PCB Assembly',
    'Temperature Sensor Module': 'Temperature Sensor Module',
    'Humidity Sensor Module': 'Humidity Sensor Module',
    'Pressure Sensor Module': 'Pressure Sensor Module',
    'Proximity Sensor': 'Proximity Sensor',
    'Ultrasonic Distance Sensor': 'Ultrasonic Distance Sensor',
    'Micro Servo Motor': 'Micro Servo Motor',
    'Standard Servo Motor': 'Standard Servo Motor',
    'Stepper Motor NEMA 17': 'Stepper Motor NEMA 17',
    '8-bit Microcontroller': '8-bit Microcontroller',
    '32-bit ARM Microcontroller': '32-bit ARM Microcontroller',
    'Digital Signal Processor': 'Digital Signal Processor',
    '3-Axis Accelerometer': '3-Axis Accelerometer',
    'Gyroscope Module': 'Gyroscope Module',
    'Light Dependent Resistor': 'Light Dependent Resistor',
    'Coil Spring Heavy Duty': 'Coil Spring Heavy Duty',
    'Compression Spring': 'Compression Spring',
    'PWM Motor Controller': 'PWM Motor Controller',
    'H-Bridge Motor Driver': 'H-Bridge Motor Driver',
    'Stepper Motor NEMA 23': 'Stepper Motor NEMA 23',
    'Drive Pulley': 'Drive Pulley',
    'LED Driver IC': 'LED Driver IC',
    '5V 10A Switching Power Supply': '5V 10A Switching Power Supply',
    '12V 5A Power Supply Module': '12V 5A Power Supply Module',
    '24V 3A Industrial Power Supply': '24V 3A Industrial Power Supply',
    'Dual Output ±15V Power Supply': 'Dual Output ±15V Power Supply',
    '48V DC Power Supply Unit': '48V DC Power Supply Unit',
    'USB-C PD 100W Power Supply': 'USB-C PD 100W Power Supply',
    'Battery Backup Power Supply': 'Battery Backup Power Supply',
    'Adjustable Bench Power Supply': 'Adjustable Bench Power Supply'
  },

  // Customer Names
  customerNames: {
    'MegaCorp Industries': 'MegaCorp Industries',
    'Elite Systems Corp': 'Elite Systems Corp',
    'Horizon Technologies': 'Horizon Technologies',
    'FastAssembly Ltd': 'FastAssembly Ltd',
    'TechSolutions Group': 'TechSolutions Group',
    'Apex Engineering': 'Apex Engineering',
    'Superior Manufacturing': 'Superior Manufacturing',
    'Cascade Manufacturing': 'Cascade Manufacturing',
    'Acme Manufacturing Corp': 'Acme Manufacturing Corp',
    'TechBuild Industries': 'TechBuild Industries',
    'Advanced Components Inc': 'Advanced Components Inc',
    'Premier Industries': 'Premier Industries',
    'Stellar Components Ltd': 'Stellar Components Ltd',
    'Dynamic Systems Ltd': 'Dynamic Systems Ltd'
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    noData: 'No data available',
    viewDetails: 'View Details',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    items: 'items'
  }
}
