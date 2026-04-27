export default {
  // Navigation
  nav: {
    overview: 'Panoramica',
    inventory: 'Inventario',
    orders: 'Ordini',
    finance: 'Finanza',
    demandForecast: 'Previsione Domanda',
    reports: 'Report',
    restocking: 'Riassortimento',
    companyName: 'Catalyst Components',
    subtitle: 'Sistema di Gestione Inventario'
  },

  // Dashboard
  dashboard: {
    title: 'Panoramica',
    kpi: {
      title: 'Indicatori Chiave di Prestazione',
      inventoryTurnover: 'Indice di Rotazione Inventario',
      ordersFulfilled: 'Ordini Evasi',
      orderFillRate: 'Tasso di Evasione Ordini',
      revenue: 'Ricavi (Ordini)',
      revenueYTD: 'Ricavi (Ordini) Da Inizio Anno',
      revenueMTD: 'Ricavi (Ordini) Da Inizio Mese',
      avgProcessingTime: 'Tempo Medio di Elaborazione (Giorni)',
      goal: 'Obiettivo'
    },
    summary: {
      title: 'Riepilogo'
    },
    orderHealth: {
      title: 'Stato Ordini',
      totalOrders: 'Ordini Totali',
      revenue: 'Ricavi',
      avgOrderValue: 'Valore Medio Ordine',
      onTimeRate: 'Tasso di Puntualità',
      avgFulfillmentDays: 'Giorni Medi di Evasione',
      total: 'Totale'
    },
    ordersByMonth: {
      title: 'Ordini per Mese'
    },
    inventoryValue: {
      title: 'Valore Inventario per Categoria'
    },
    inventoryShortages: {
      title: 'Carenze di Magazzino',
      noShortages: 'Nessuna carenza — tutti gli ordini possono essere evasi!',
      noData: 'Nessun dato per i filtri selezionati',
      orderId: 'ID Ordine',
      sku: 'SKU',
      itemName: 'Nome Articolo',
      quantityNeeded: 'Quantità Necessaria',
      quantityAvailable: 'Quantità Disponibile',
      shortage: 'Carenza',
      daysDelayed: 'Giorni di Ritardo',
      priority: 'Priorità',
      unitsShort: 'unità mancanti',
      days: 'giorni'
    },
    topProducts: {
      title: 'Prodotti Top per Ricavi',
      sku: 'SKU',
      product: 'Prodotto',
      category: 'Categoria',
      warehouse: 'Magazzino',
      stockStatus: 'Stato Stock',
      revenue: 'Ricavi',
      unitsOrdered: 'Unità Ordinate',
      firstOrder: 'Primo Ordine',
      inStock: 'Disponibile',
      lowStock: 'Stock Basso'
    }
  },

  // Inventory
  inventory: {
    title: 'Inventario',
    description: 'Traccia e gestisci tutti gli articoli in magazzino',
    stockLevels: 'Livelli di Stock',
    skus: 'SKU',
    searchPlaceholder: 'Cerca per nome articolo...',
    clearSearch: 'Cancella ricerca',
    totalItems: 'Articoli Totali',
    totalValue: 'Valore Totale',
    lowStockItems: 'Articoli a Stock Basso',
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
      location: 'Posizione',
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
    title: 'Dashboard Finanziario',
    description: 'Monitora ricavi, costi e performance finanziaria',
    totalRevenue: 'Ricavi Totali',
    totalCosts: 'Costi Totali',
    netProfit: 'Utile Netto',
    avgOrderValue: 'Valore Medio Ordine',
    fromOrders: 'Da {count} ordini',
    costBreakdown: 'Approvvigionamento + Operativo + Lavoro + Spese Generali',
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
    description: 'Analizza le tendenze della domanda e le previsioni future',
    increasingDemand: 'Domanda in Crescita',
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
    location: 'Posizione',
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
    lowStock: 'Stock Basso',
    adequate: 'Adeguato'
  },

  // Trends
  trends: {
    increasing: 'crescente',
    stable: 'stabile',
    decreasing: 'decrescente'
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
    controllers: 'Controller',
    powerSupplies: 'Alimentatori'
  },

  // Spending Categories
  spendingCategories: {
    rawMaterials: 'Materie Prime',
    components: 'Componenti',
    equipment: 'Attrezzature',
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
    employeeId: 'ID Dipendente',
    close: 'Chiudi'
  },

  // Tasks Modal
  tasks: {
    title: 'Le Mie Attività',
    taskTitle: 'Titolo Attività',
    taskTitlePlaceholder: 'Inserisci il titolo...',
    priority: 'Priorità',
    dueDate: 'Scadenza',
    addTask: 'Aggiungi Attività',
    noTasks: 'Nessuna attività. Aggiungine una qui sopra!'
  },

  // Language
  language: {
    english: 'English',
    japanese: 'Giapponese',
    italian: 'Italiano',
    selectLanguage: 'Seleziona Lingua'
  },

  // Restocking
  restocking: {
    title: 'Raccomandazioni Riassortimento',
    description: 'Ordini di acquisto consigliati in base ai livelli di stock e alle previsioni di domanda',
    budgetCeiling: 'Budget Massimo',
    budgetPlaceholder: 'Inserisci il limite di budget (es. 500000)',
    calculate: 'Calcola',
    withinBudget: 'Nei limiti',
    exceedsBudget: 'Fuori budget',
    totalItems: 'Articoli Consigliati',
    budgetUsed: 'Budget Utilizzato',
    totalCost: 'Costo Totale',
    noBudget: 'Inserisci un budget massimo per vedere i consigli',
    noResults: 'Nessun articolo richiede riassortimento per i filtri selezionati',
    table: {
      sku: 'SKU',
      itemName: 'Nome Articolo',
      warehouse: 'Magazzino',
      currentStock: 'Stock Attuale',
      reorderPoint: 'Punto di Riordino',
      forecastedDemand: 'Domanda Prevista',
      trend: 'Tendenza',
      recommendedQty: 'Qtà Consigliata',
      unitCost: 'Costo Unitario',
      estimatedCost: 'Costo Stimato',
      priority: 'Priorità',
      status: 'Stato Budget'
    },
    priority: {
      high: 'Alta',
      medium: 'Media',
      low: 'Bassa'
    },
    trend: {
      increasing: 'Crescente',
      stable: 'Stabile',
      decreasing: 'Decrescente'
    }
  },

  // Reports
  reports: {
    title: 'Report di Performance',
    description: 'Visualizza le metriche trimestrali e le tendenze mensili',
    quarterly: {
      title: 'Performance Trimestrale',
      quarter: 'Trimestre',
      totalOrders: 'Ordini Totali',
      totalRevenue: 'Ricavi Totali',
      avgOrderValue: 'Valore Medio Ordine',
      fulfillmentRate: 'Tasso di Evasione'
    },
    monthlyTrend: {
      title: 'Tendenza Ricavi Mensile'
    },
    monthOverMonth: {
      title: 'Analisi Mese su Mese',
      month: 'Mese',
      orders: 'Ordini',
      revenue: 'Ricavi',
      change: 'Variazione',
      growthRate: 'Tasso di Crescita'
    },
    summary: {
      totalRevenue: 'Ricavi Totali (Da Inizio Anno)',
      avgMonthly: 'Ricavi Medi Mensili',
      totalOrders: 'Ordini Totali (Da Inizio Anno)',
      bestQuarter: 'Miglior Trimestre'
    },
    fulfillment: {
      na: 'N/D'
    }
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
  }
}
