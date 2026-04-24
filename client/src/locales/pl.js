export default {
  nav: {
    overview: 'Przegląd',
    inventory: 'Magazyn',
    orders: 'Zamówienia',
    finance: 'Finanse',
    demandForecast: 'Prognoza popytu',
    companyName: 'Catalyst Components',
    subtitle: 'System zarządzania magazynem'
  },

  dashboard: {
    title: 'Przegląd',
    kpi: {
      title: 'Kluczowe wskaźniki efektywności',
      inventoryTurnover: 'Rotacja zapasów',
      ordersFulfilled: 'Zrealizowane zamówienia',
      orderFillRate: 'Wskaźnik realizacji',
      revenue: 'Przychody (zamówienia)',
      revenueYTD: 'Przychody od początku roku',
      revenueMTD: 'Przychody w tym miesiącu',
      avgProcessingTime: 'Śr. czas realizacji (dni)',
      goal: 'Cel'
    },
    summary: {
      title: 'Podsumowanie'
    },
    orderHealth: {
      title: 'Stan zamówień',
      totalOrders: 'Wszystkie zamówienia',
      revenue: 'Przychody',
      avgOrderValue: 'Śr. wartość zamówienia',
      onTimeRate: 'Terminowość',
      avgFulfillmentDays: 'Śr. czas realizacji (dni)',
      total: 'Łącznie'
    },
    ordersByMonth: {
      title: 'Zamówienia według miesięcy'
    },
    inventoryValue: {
      title: 'Wartość magazynu według kategorii'
    },
    inventoryShortages: {
      title: 'Braki magazynowe',
      noShortages: 'Brak niedoborów — wszystkie zamówienia mogą być zrealizowane!',
      noData: 'Brak danych dla wybranych filtrów',
      orderId: 'Nr zamówienia',
      sku: 'SKU',
      itemName: 'Nazwa towaru',
      quantityNeeded: 'Potrzebna ilość',
      quantityAvailable: 'Dostępna ilość',
      shortage: 'Niedobór',
      daysDelayed: 'Dni opóźnienia',
      priority: 'Priorytet',
      unitsShort: 'szt. brakuje',
      days: 'dni'
    },
    topProducts: {
      title: 'Najlepsze produkty według przychodów',
      sku: 'SKU',
      product: 'Produkt',
      category: 'Kategoria',
      warehouse: 'Magazyn',
      stockStatus: 'Stan magazynu',
      revenue: 'Przychody',
      unitsOrdered: 'Zamówione szt.',
      firstOrder: 'Pierwsze zamówienie',
      inStock: 'Na stanie',
      lowStock: 'Niski stan'
    }
  },

  inventory: {
    title: 'Magazyn',
    description: 'Śledź i zarządzaj wszystkimi pozycjami magazynowymi',
    stockLevels: 'Stany magazynowe',
    skus: 'SKU',
    searchPlaceholder: 'Szukaj po nazwie towaru...',
    clearSearch: 'Wyczyść wyszukiwanie',
    totalItems: 'Łączna liczba pozycji',
    totalValue: 'Łączna wartość',
    lowStockItems: 'Pozycje z niskim stanem',
    warehouses: 'Magazyny',
    table: {
      sku: 'SKU',
      itemName: 'Nazwa towaru',
      name: 'Nazwa',
      category: 'Kategoria',
      warehouse: 'Magazyn',
      quantity: 'Ilość',
      quantityOnHand: 'Stan magazynowy',
      reorderPoint: 'Punkt ponownego zamówienia',
      unitCost: 'Koszt jednostkowy',
      unitPrice: 'Cena jednostkowa',
      totalValue: 'Wartość całkowita',
      location: 'Lokalizacja',
      status: 'Status'
    }
  },

  orders: {
    title: 'Zamówienia',
    description: 'Przeglądaj i zarządzaj zamówieniami klientów',
    allOrders: 'Wszystkie zamówienia',
    totalOrders: 'Łączna liczba zamówień',
    totalRevenue: 'Łączne przychody',
    avgOrderValue: 'Śr. wartość zamówienia',
    onTimeDelivery: 'Terminowe dostawy',
    itemsCount: '{count} pozycji',
    quantity: 'Ilość',
    table: {
      orderNumber: 'Numer zamówienia',
      orderId: 'ID zamówienia',
      orderDate: 'Data zamówienia',
      date: 'Data',
      customer: 'Klient',
      category: 'Kategoria',
      warehouse: 'Magazyn',
      items: 'Pozycje',
      value: 'Wartość',
      totalValue: 'Wartość całkowita',
      status: 'Status',
      expectedDelivery: 'Planowana dostawa',
      actualDelivery: 'Rzeczywista dostawa'
    }
  },

  finance: {
    title: 'Panel finansowy',
    description: 'Śledź przychody, koszty i wyniki finansowe',
    totalRevenue: 'Łączne przychody',
    totalCosts: 'Łączne koszty',
    netProfit: 'Zysk netto',
    avgOrderValue: 'Śr. wartość zamówienia',
    fromOrders: 'Z {count} zamówień',
    costBreakdown: 'Zakupy + Operacyjne + Praca + Ogólne',
    margin: 'marża',
    perOrderRevenue: 'Przychód na zamówienie',
    revenueVsCosts: {
      title: 'Miesięczne przychody a koszty',
      revenue: 'Przychody',
      costs: 'Łączne koszty'
    },
    monthlyCostFlow: {
      title: 'Miesięczne przepływy kosztów',
      procurement: 'Zakupy',
      operational: 'Operacyjne',
      labor: 'Praca',
      overhead: 'Ogólne'
    },
    categorySpending: {
      title: 'Wydatki według kategorii',
      ofTotal: 'łącznych'
    },
    transactions: {
      title: 'Ostatnie transakcje',
      id: 'ID',
      description: 'Opis',
      vendor: 'Dostawca',
      date: 'Data',
      amount: 'Kwota'
    }
  },

  demand: {
    title: 'Prognoza popytu',
    description: 'Analizuj trendy i prognozy popytu',
    increasingDemand: 'Rosnący popyt',
    stableDemand: 'Stabilny popyt',
    decreasingDemand: 'Malejący popyt',
    itemsCount: '{count} pozycji',
    more: 'więcej...',
    demandForecasts: 'Prognozy popytu',
    table: {
      sku: 'SKU',
      itemName: 'Nazwa towaru',
      currentDemand: 'Bieżący popyt',
      forecastedDemand: 'Prognozowany popyt',
      change: 'Zmiana',
      trend: 'Trend',
      period: 'Okres'
    }
  },

  filters: {
    timePeriod: 'Okres',
    location: 'Lokalizacja',
    category: 'Kategoria',
    orderStatus: 'Status zamówienia',
    all: 'Wszystkie',
    allMonths: 'Wszystkie miesiące'
  },

  status: {
    delivered: 'Dostarczone',
    shipped: 'Wysłane',
    processing: 'W realizacji',
    backordered: 'Zaległe',
    inStock: 'Na stanie',
    lowStock: 'Niski stan',
    adequate: 'Wystarczający'
  },

  trends: {
    increasing: 'rosnący',
    stable: 'stabilny',
    decreasing: 'malejący'
  },

  priority: {
    high: 'Wysoki',
    medium: 'Średni',
    low: 'Niski'
  },

  categories: {
    circuitBoards: 'Płyty drukowane',
    sensors: 'Czujniki',
    actuators: 'Siłowniki',
    controllers: 'Sterowniki',
    powerSupplies: 'Zasilacze'
  },

  spendingCategories: {
    rawMaterials: 'Surowce',
    components: 'Komponenty',
    equipment: 'Sprzęt',
    consumables: 'Materiały eksploatacyjne'
  },

  warehouses: {
    sanFrancisco: 'San Francisco',
    london: 'Londyn',
    tokyo: 'Tokio'
  },

  months: {
    jan: 'Sty',
    feb: 'Lut',
    mar: 'Mar',
    apr: 'Kwi',
    may: 'Maj',
    jun: 'Cze',
    jul: 'Lip',
    aug: 'Sie',
    sep: 'Wrz',
    oct: 'Paź',
    nov: 'Lis',
    dec: 'Gru',
    january: 'Styczeń',
    february: 'Luty',
    march: 'Marzec',
    april: 'Kwiecień',
    june: 'Czerwiec',
    july: 'Lipiec',
    august: 'Sierpień',
    september: 'Wrzesień',
    october: 'Październik',
    november: 'Listopad',
    december: 'Grudzień'
  },

  profile: {
    profileDetails: 'Szczegóły profilu',
    myTasks: 'Moje zadania',
    logout: 'Wyloguj'
  },

  profileDetails: {
    title: 'Szczegóły profilu',
    email: 'E-mail',
    department: 'Dział',
    location: 'Lokalizacja',
    phone: 'Telefon',
    joinDate: 'Data dołączenia',
    employeeId: 'ID pracownika',
    close: 'Zamknij'
  },

  tasks: {
    title: 'Moje zadania',
    taskTitle: 'Tytuł zadania',
    taskTitlePlaceholder: 'Wpisz tytuł zadania...',
    priority: 'Priorytet',
    dueDate: 'Termin',
    addTask: 'Dodaj zadanie',
    noTasks: 'Brak zadań. Dodaj pierwsze zadanie powyżej!'
  },

  language: {
    english: 'Angielski',
    japanese: 'Japoński',
    polish: 'Polski',
    selectLanguage: 'Wybierz język'
  },

  common: {
    loading: 'Ładowanie...',
    error: 'Błąd',
    noData: 'Brak danych',
    viewDetails: 'Szczegóły',
    close: 'Zamknij',
    save: 'Zapisz',
    cancel: 'Anuluj',
    search: 'Szukaj',
    filter: 'Filtruj',
    export: 'Eksportuj',
    items: 'pozycji'
  }
}
