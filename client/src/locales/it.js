export default {
  // Navigation
  nav: {
    overview: 'Panoramica',
    inventory: 'Magazzino',
    orders: 'Ordini',
    finance: 'Finanza',
    demandForecast: 'Previsione Domanda',
    reports: 'Report',
    restocking: 'Rifornimento',
    companyName: 'Catalyst Components',
    subtitle: 'Sistema di Gestione Magazzino'
  },

  // Restocking
  restocking: {
    title: 'Raccomandazioni di Rifornimento',
    subtitle: 'Raccomandazioni di ordine basate sui livelli di scorta, domanda e budget',
    budgetLabel: 'Tetto di Budget',
    budgetPlaceholder: 'Inserisci importo (0 = nessun limite)',
    apply: 'Applica',
    noItems: 'Nessun articolo sotto-scorta per i filtri selezionati.',
    table: {
      sku: 'SKU',
      name: 'Nome Articolo',
      category: 'Categoria',
      warehouse: 'Magazzino',
      onHand: 'Disponibile',
      reorderPoint: 'Punto di Riordino',
      gap: 'Deficit',
      unitCost: 'Costo Unitario',
      restockCost: 'Costo Rifornimento',
      demandTrend: 'Tendenza Domanda',
      status: 'Stato'
    },
    stats: {
      itemsAtRisk: 'Articoli a Rischio',
      totalRestockCost: 'Costo Totale Rifornimento',
      withinBudget: 'Nel Budget',
      budgetRemaining: 'Budget Residuo'
    },
    trend: {
      increasing: 'In aumento',
      stable: 'Stabile',
      decreasing: 'In calo',
      unknown: 'Sconosciuto'
    },
    status: {
      withinBudget: 'Nel Budget',
      overBudget: 'Fuori Budget'
    }
  },

  // Reports
  reports: {
    title: 'Report di Performance',
    subtitle: 'Visualizza le metriche di performance trimestrali e i trend mensili',
    quarterlyPerformance: 'Performance Trimestrale',
    monthlyTrend: 'Trend Ricavi Mensili',
    monthOverMonth: 'Analisi Mese su Mese',
    table: {
      quarter: 'Trimestre',
      totalOrders: 'Ordini Totali',
      totalRevenue: 'Ricavi Totali',
      avgOrderValue: 'Valore Medio Ordine',
      fulfillmentRate: 'Tasso Evasione',
      month: 'Mese',
      orders: 'Ordini',
      revenue: 'Ricavi',
      change: 'Variazione',
      growthRate: 'Tasso di Crescita'
    },
    stats: {
      totalRevenueYTD: 'Ricavi Totali (YTD)',
      avgMonthlyRevenue: 'Ricavi Medi Mensili',
      totalOrdersYTD: 'Ordini Totali (YTD)',
      bestQuarter: 'Trimestre Migliore'
    }
  },

  // Dashboard
  dashboard: {
    title: 'Panoramica',
    kpi: {
      title: 'Indicatori Chiave di Performance',
      inventoryTurnover: 'Rotazione Magazzino',
      ordersFulfilled: 'Ordini Evasi',
      orderFillRate: 'Tasso di Evasione',
      revenue: 'Ricavi (Ordini)',
      revenueYTD: 'Ricavi (Ordini) YTD',
      revenueMTD: 'Ricavi (Ordini) MTD',
      avgProcessingTime: 'Tempo Medio Elaborazione (Giorni)',
      goal: 'Obiettivo'
    },
    summary: {
      title: 'Riepilogo'
    },
    orderHealth: {
      title: 'Salute Ordini',
      totalOrders: 'Ordini Totali',
      revenue: 'Ricavi',
      avgOrderValue: 'Valore Medio Ordine',
      onTimeRate: 'Tasso Puntualità',
      avgFulfillmentDays: 'Evasione Media (Giorni)',
      total: 'Totale'
    },
    ordersByMonth: {
      title: 'Ordini per Mese'
    },
    inventoryValue: {
      title: 'Valore Magazzino per Categoria'
    },
    inventoryShortages: {
      title: 'Carenze di Magazzino',
      noShortages: 'Nessuna carenza — tutti gli ordini possono essere evasi!',
      noData: 'Nessun dato magazzino per i filtri selezionati',
      orderId: 'ID Ordine',
      sku: 'SKU',
      itemName: 'Nome Articolo',
      quantityNeeded: 'Quantità Necessaria',
      quantityAvailable: 'Quantità Disponibile',
      shortage: 'Carenza',
      daysDelayed: 'Giorni di Ritardo',
      priority: 'Priorità',
      unitsShort: 'unità in deficit',
      days: 'giorni'
    },
    topProducts: {
      title: 'Prodotti Migliori per Ricavi',
      sku: 'SKU',
      product: 'Prodotto',
      category: 'Categoria',
      warehouse: 'Magazzino',
      stockStatus: 'Stato Scorte',
      revenue: 'Ricavi',
      unitsOrdered: 'Unità Ordinate',
      firstOrder: 'Primo Ordine',
      inStock: 'Disponibile',
      lowStock: 'Scorte Basse'
    }
  },

  // Inventory
  inventory: {
    title: 'Magazzino',
    description: 'Monitora e gestisci tutti gli articoli in magazzino',
    stockLevels: 'Livelli di Scorta',
    skus: 'SKU',
    searchPlaceholder: 'Cerca per nome articolo...',
    clearSearch: 'Cancella ricerca',
    totalItems: 'Articoli Totali',
    totalValue: 'Valore Totale',
    lowStockItems: 'Articoli con Scorte Basse',
    warehouses: 'Magazzini',
    table: {
      sku: 'SKU',
      itemName: 'Nome Articolo',
      name: 'Nome',
      category: 'Categoria',
      warehouse: 'Magazzino',
      quantity: 'Quantità',
      quantityOnHand: 'Quantità Disponibile',
      reorderPoint: 'Punto di Riordino',
      unitCost: 'Costo Unitario',
      unitPrice: 'Prezzo Unitario',
      totalValue: 'Valore Totale',
      location: 'Sede',
      status: 'Stato'
    }
  },

  // Orders
  orders: {
    title: 'Ordini',
    description: 'Visualizza e gestisci gli ordini clienti',
    allOrders: 'Tutti gli Ordini',
    totalOrders: 'Ordini Totali',
    totalRevenue: 'Ricavi Totali',
    avgOrderValue: 'Valore Medio Ordine',
    onTimeDelivery: 'Consegna Puntuale',
    itemsCount: '{count} articoli',
    quantity: 'Qtà',
    table: {
      orderNumber: 'Numero Ordine',
      orderId: 'ID Ordine',
      orderDate: 'Data Ordine',
      date: 'Data',
      customer: 'Cliente',
      category: 'Categoria',
      warehouse: 'Magazzino',
      items: 'Articoli',
      value: 'Valore',
      totalValue: 'Valore Totale',
      status: 'Stato',
      expectedDelivery: 'Consegna Prevista',
      actualDelivery: 'Consegna Effettiva'
    }
  },

  // Finance/Spending
  finance: {
    title: 'Dashboard Finanziaria',
    description: 'Monitora ricavi, costi e performance finanziaria',
    totalRevenue: 'Ricavi Totali',
    totalCosts: 'Costi Totali',
    netProfit: 'Profitto Netto',
    avgOrderValue: 'Valore Medio Ordine',
    fromOrders: 'Da {count} ordini',
    costBreakdown: 'Approvvigionamento + Operativo + Lavoro + Spese generali',
    margin: 'margine',
    perOrderRevenue: 'Ricavo per ordine',
    revenueVsCosts: {
      title: 'Ricavi vs Costi Mensili',
      revenue: 'Ricavi',
      costs: 'Costi Totali'
    },
    monthlyCostFlow: {
      title: 'Flusso Costi Mensile',
      procurement: 'Approvvigionamento',
      operational: 'Operativo',
      labor: 'Lavoro',
      overhead: 'Spese Generali'
    },
    categorySpending: {
      title: 'Spesa per Categoria',
      ofTotal: 'del totale'
    },
    transactions: {
      title: 'Transazioni Recenti',
      id: 'ID',
      description: 'Descrizione',
      vendor: 'Fornitore',
      date: 'Data',
      amount: 'Importo'
    }
  },

  // Demand Forecast
  demand: {
    title: 'Previsione Domanda',
    description: 'Analizza i trend e le previsioni della domanda',
    increasingDemand: 'Domanda in Aumento',
    stableDemand: 'Domanda Stabile',
    decreasingDemand: 'Domanda in Calo',
    itemsCount: '{count} articoli',
    more: 'altri...',
    demandForecasts: 'Previsioni Domanda',
    table: {
      sku: 'SKU',
      itemName: 'Nome Articolo',
      currentDemand: 'Domanda Attuale',
      forecastedDemand: 'Domanda Prevista',
      change: 'Variazione',
      trend: 'Tendenza',
      period: 'Periodo'
    }
  },

  // Filters
  filters: {
    timePeriod: 'Periodo',
    location: 'Sede',
    category: 'Categoria',
    orderStatus: 'Stato Ordine',
    all: 'Tutti',
    allMonths: 'Tutti i Mesi'
  },

  // Statuses
  status: {
    delivered: 'Consegnato',
    shipped: 'Spedito',
    processing: 'In Elaborazione',
    backordered: 'In Arretrato',
    inStock: 'Disponibile',
    lowStock: 'Scorte Basse',
    adequate: 'Adeguato'
  },

  // Trends
  trends: {
    increasing: 'in aumento',
    stable: 'stabile',
    decreasing: 'in calo'
  },

  // Priority
  priority: {
    high: 'Alta',
    medium: 'Media',
    low: 'Bassa'
  },

  // Categories
  categories: {
    circuitBoards: 'Circuiti Stampati',
    sensors: 'Sensori',
    actuators: 'Attuatori',
    controllers: 'Controllori',
    powerSupplies: 'Alimentatori'
  },

  // Spending Categories
  spendingCategories: {
    rawMaterials: 'Materie Prime',
    components: 'Componenti',
    equipment: 'Attrezzatura',
    consumables: 'Materiali di Consumo'
  },

  // Warehouses
  warehouses: {
    sanFrancisco: 'San Francisco',
    london: 'Londra',
    tokyo: 'Tokyo'
  },

  // Months
  months: {
    jan: 'Gen',
    feb: 'Feb',
    mar: 'Mar',
    apr: 'Apr',
    may: 'Mag',
    jun: 'Giu',
    jul: 'Lug',
    aug: 'Ago',
    sep: 'Set',
    oct: 'Ott',
    nov: 'Nov',
    dec: 'Dic',
    january: 'Gennaio',
    february: 'Febbraio',
    march: 'Marzo',
    april: 'Aprile',
    june: 'Giugno',
    july: 'Luglio',
    august: 'Agosto',
    september: 'Settembre',
    october: 'Ottobre',
    november: 'Novembre',
    december: 'Dicembre'
  },

  // Profile Menu
  profile: {
    profileDetails: 'Dettagli Profilo',
    myTasks: 'Le Mie Attività',
    logout: 'Esci'
  },

  // Profile Details Modal
  profileDetails: {
    title: 'Dettagli Profilo',
    email: 'Email',
    department: 'Reparto',
    location: 'Sede',
    phone: 'Telefono',
    joinDate: 'Data di Assunzione',
    employeeId: 'Matricola',
    close: 'Chiudi'
  },

  // Tasks Modal
  tasks: {
    title: 'Le Mie Attività',
    taskTitle: 'Titolo Attività',
    taskTitlePlaceholder: 'Inserisci titolo attività...',
    priority: 'Priorità',
    dueDate: 'Scadenza',
    addTask: 'Aggiungi Attività',
    noTasks: 'Nessuna attività. Aggiungi la prima in alto!'
  },

  // Language
  language: {
    english: 'English',
    japanese: '日本語',
    italian: 'Italiano',
    selectLanguage: 'Seleziona Lingua'
  },

  // Common
  common: {
    loading: 'Caricamento...',
    error: 'Errore',
    noData: 'Nessun dato disponibile',
    viewDetails: 'Vedi Dettagli',
    close: 'Chiudi',
    save: 'Salva',
    cancel: 'Annulla',
    search: 'Cerca',
    filter: 'Filtra',
    export: 'Esporta',
    items: 'articoli'
  },

  // Product Names (no translation — use original names)
  productNames: {},

  // Customer Names (no translation — use original names)
  customerNames: {}
}
