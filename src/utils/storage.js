const STORAGE_KEYS = {
    TRANSACTIONS: 'fincontrol_transactions'
};

export function getTransactions() {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) return JSON.parse(saved);
    
    // Демо-данные
    return [
        { id: 1, type: 'expense', amount: 1250, category: '🍔 Еда', description: 'Обед в кафе', date: '2024-11-28T14:30:00' },
        { id: 2, type: 'expense', amount: 450, category: '🚗 Транспорт', description: 'Такси', date: '2024-11-27T09:15:00' },
        { id: 3, type: 'income', amount: 45000, category: '💼 Зарплата', description: 'Аванс', date: '2024-11-02T10:00:00' },
        { id: 4, type: 'expense', amount: 4200, category: '🏠 Жильё', description: 'Коммунальные платежи', date: '2024-11-01T12:00:00' },
        { id: 5, type: 'expense', amount: 3500, category: '🛍️ Шопинг', description: 'Новая одежда', date: '2024-10-30T15:45:00' },
        { id: 6, type: 'expense', amount: 299, category: '🎮 Развлечения', description: 'Подписка на игры', date: '2024-10-29T08:00:00' }
    ];
}

export function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}