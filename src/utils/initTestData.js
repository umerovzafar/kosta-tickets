// Утилита для инициализации тестовых данных
// Можно вызвать из консоли браузера: window.initTestData()

export const initTestData = () => {
  const testUsers = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'admin',
      email: 'admin@company.com',
      blocked: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'it_user',
      password: 'it123',
      role: 'it',
      email: 'it.user@company.com',
      blocked: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      username: 'user1',
      password: 'user123',
      role: 'user',
      email: 'user1@company.com',
      blocked: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      username: 'user2',
      password: 'user123',
      role: 'user',
      email: 'user2@company.com',
      blocked: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '5',
      username: 'it_support',
      password: 'support123',
      role: 'it',
      email: 'it.support@company.com',
      blocked: false,
      createdAt: new Date().toISOString(),
    },
  ]

  // Сохраняем пользователей
  localStorage.setItem('users', JSON.stringify(testUsers))

  // Создаем несколько тестовых тикетов
  const testTickets = [
    {
      id: '1',
      title: 'Не работает принтер в кабинете 205',
      description: 'Принтер HP LaserJet не печатает. При попытке печати выдает ошибку "Ошибка печати". Проверял подключение - кабель подключен, индикатор питания горит.',
      priority: 'high',
      status: 'open',
      category: 'hardware',
      createdBy: '3',
      createdByName: 'user1',
      createdByEmail: 'user1@company.com',
      assignedTo: null,
      assignedToName: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [],
    },
    {
      id: '2',
      title: 'Нужен доступ к базе данных',
      description: 'Требуется предоставить доступ к базе данных для нового сотрудника. ФИО: Иванов Иван Иванович, отдел: Бухгалтерия.',
      priority: 'medium',
      status: 'in_progress',
      category: 'account',
      createdBy: '4',
      createdByName: 'user2',
      createdByEmail: 'user2@company.com',
      assignedTo: '2',
      assignedToName: 'it_user',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          id: '1',
          text: 'Обработаю заявку в течение дня',
          authorId: '2',
          authorName: 'it_user',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: '3',
      title: 'Медленный интернет',
      description: 'Интернет работает очень медленно последние несколько дней. Скорость загрузки страниц значительно снизилась.',
      priority: 'medium',
      status: 'open',
      category: 'network',
      createdBy: '3',
      createdByName: 'user1',
      createdByEmail: 'user1@company.com',
      assignedTo: null,
      assignedToName: null,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [],
    },
    {
      id: '4',
      title: 'Установка Microsoft Office',
      description: 'Требуется установить Microsoft Office на новый компьютер в кабинете 301.',
      priority: 'low',
      status: 'closed',
      category: 'software',
      createdBy: '4',
      createdByName: 'user2',
      createdByEmail: 'user2@company.com',
      assignedTo: '5',
      assignedToName: 'it_support',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          id: '2',
          text: 'Установка выполнена успешно. Office активирован и готов к использованию.',
          authorId: '5',
          authorName: 'it_support',
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          text: 'Спасибо! Все работает отлично.',
          authorId: '4',
          authorName: 'user2',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      id: '5',
      title: 'Не запускается программа 1С',
      description: 'При попытке запустить программу 1С:Бухгалтерия выдается ошибка "Не удалось подключиться к базе данных".',
      priority: 'high',
      status: 'in_progress',
      category: 'software',
      createdBy: '3',
      createdByName: 'user1',
      assignedTo: '2',
      assignedToName: 'it_user',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      comments: [
        {
          id: '4',
          text: 'Проверяю подключение к серверу базы данных...',
          authorId: '2',
          authorName: 'it_user',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ]

  localStorage.setItem('tickets', JSON.stringify(testTickets))

  // Создаем тестовые данные для инвентаризации
  const testInventory = [
    {
      id: '1',
      name: 'Ноутбук Dell Latitude 5520',
      type: 'Ноутбук',
      serialNumber: 'DL5520-2023-001',
      location: 'Кабинет 205',
      status: 'working',
      description: 'Ноутбук Dell Latitude 5520, Intel Core i7, 16GB RAM, 512GB SSD. Выдан сотруднику Иванову И.И.',
      photo: null,
      responsible: '3', // user1
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      name: 'Принтер HP LaserJet Pro M404dn',
      type: 'Принтер',
      serialNumber: 'HP-M404-2023-045',
      location: 'Кабинет 205',
      status: 'repair',
      description: 'Лазерный принтер HP LaserJet Pro M404dn. Черно-белая печать, двусторонняя печать, сетевой принтер.',
      photo: null,
      responsible: '3', // user1
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      name: 'Монитор LG UltraWide 29WP60G-B',
      type: 'Монитор',
      serialNumber: 'LG-29WP60-2023-012',
      location: 'Кабинет 301',
      status: 'working',
      description: 'Монитор LG UltraWide 29 дюймов, разрешение 2560x1080, IPS матрица. Подключен к рабочей станции.',
      photo: null,
      responsible: '4', // user2
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      name: 'Сервер Dell PowerEdge R740',
      type: 'Сервер',
      serialNumber: 'DELL-R740-2022-001',
      location: 'Серверная комната',
      status: 'working',
      description: 'Сервер Dell PowerEdge R740, 2x Intel Xeon Silver, 64GB RAM, RAID 10. Основной сервер базы данных.',
      photo: null,
      responsible: '1', // admin
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      name: 'МФУ Canon imageRUNNER ADVANCE C5535i',
      type: 'МФУ',
      serialNumber: 'CANON-C5535-2023-078',
      location: 'Кабинет 102',
      status: 'broken',
      description: 'Многофункциональное устройство Canon imageRUNNER ADVANCE C5535i. Печать, сканирование, копирование, факс.',
      photo: null,
      responsible: '2', // it_user
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      name: 'Планшет iPad Pro 12.9"',
      type: 'Планшет',
      serialNumber: 'IPAD-PRO-2023-023',
      location: 'Кабинет 205',
      status: 'working',
      description: 'Планшет Apple iPad Pro 12.9 дюймов, 256GB, Wi-Fi + Cellular. Используется для презентаций.',
      photo: null,
      responsible: '3', // user1
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '7',
      name: 'Маршрутизатор Cisco Catalyst 9300',
      type: 'Сетевое оборудование',
      serialNumber: 'CISCO-9300-2022-005',
      location: 'Серверная комната',
      status: 'working',
      description: 'Коммутатор Cisco Catalyst 9300, 48 портов Gigabit Ethernet, PoE+. Основной коммутатор офиса.',
      photo: null,
      responsible: '2', // it_user
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '8',
      name: 'Проектор Epson EB-X41',
      type: 'Проектор',
      serialNumber: 'EPSON-X41-2023-009',
      location: 'Конференц-зал',
      status: 'working',
      description: 'Проектор Epson EB-X41, XGA разрешение, 3600 люмен. Используется для презентаций в конференц-зале.',
      photo: null,
      responsible: null, // Не назначен
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '9',
      name: 'ИБП APC Smart-UPS 1500VA',
      type: 'ИБП',
      serialNumber: 'APC-SU1500-2023-015',
      location: 'Серверная комната',
      status: 'repair',
      description: 'Источник бесперебойного питания APC Smart-UPS 1500VA. Защита серверного оборудования.',
      photo: null,
      responsible: '5', // it_support
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '10',
      name: 'Веб-камера Logitech C920 HD Pro',
      type: 'Веб-камера',
      serialNumber: 'LOG-C920-2023-042',
      location: 'Кабинет 301',
      status: 'written_off',
      description: 'Веб-камера Logitech C920 HD Pro, Full HD 1080p. Используется для видеоконференций.',
      photo: null,
      responsible: null, // Не назначен (списана)
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  localStorage.setItem('inventory', JSON.stringify(testInventory))

  console.log('✅ Тестовые данные успешно созданы!')
  console.log('\n📋 Данные для входа:')
  console.log('\n👑 Администратор:')
  console.log('   Логин: admin')
  console.log('   Пароль: admin123')
  console.log('\n💻 IT Отдел:')
  console.log('   Логин: it_user')
  console.log('   Пароль: it123')
  console.log('   Логин: it_support')
  console.log('   Пароль: support123')
  console.log('\n👤 Пользователи:')
  console.log('   Логин: user1')
  console.log('   Пароль: user123')
  console.log('   Логин: user2')
  console.log('   Пароль: user123')
  console.log('\n📦 Инвентаризация:')
  console.log(`   Добавлено ${testInventory.length} единиц техники`)

  return {
    users: testUsers,
    tickets: testTickets,
    inventory: testInventory,
  }
}

// Делаем функцию доступной глобально для вызова из консоли
if (typeof window !== 'undefined') {
  window.initTestData = initTestData
}

