const STORAGE_KEYS = {
    TRANSACTIONS: 'fincontrol_transactions'
};

let updateBudgetsCallback = null;

export function setUpdateBudgetsCallback(callback) {
    updateBudgetsCallback = callback;
}

export function getTransactions() {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) return JSON.parse(saved);
    
    const getDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString();
    };
    
    return [
        { id: 1, type: 'expense', amount: 1250, category: '🍔 Еда', description: 'Обед в кафе', date: getDate(1) },
        { id: 2, type: 'expense', amount: 450, category: '🚗 Транспорт', description: 'Такси', date: getDate(2) },
        { id: 3, type: 'income', amount: 45000, category: '💼 Зарплата', description: 'Аванс', date: getDate(7) },
        { id: 4, type: 'expense', amount: 4200, category: '🏠 Жильё', description: 'Коммунальные платежи', date: getDate(5) },
        { id: 5, type: 'expense', amount: 3500, category: '🛍️ Шопинг', description: 'Новая одежда', date: getDate(10) },
        { id: 6, type: 'expense', amount: 299, category: '🎮 Развлечения', description: 'Подписка на игры', date: getDate(15) },
        { id: 7, type: 'expense', amount: 800, category: '🍔 Еда', description: 'Ужин в ресторане', date: getDate(3) },
        { id: 8, type: 'income', amount: 15000, category: '💸 Фриланс', description: 'Проект', date: getDate(14) },
    ];
}

export function saveTransactions(transactions) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    if (updateBudgetsCallback) {
        updateBudgetsCallback();
    }
}

export function addTransaction(transaction) {
    const transactions = getTransactions();
    const newId = Math.max(0, ...transactions.map(t => t.id), 0) + 1;
    const newTransaction = { ...transaction, id: newId };
    transactions.unshift(newTransaction);
    saveTransactions(transactions);
    return newTransaction;
}

export function updateTransaction(id, updatedData) {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updatedData };
        saveTransactions(transactions);
    }
}

export function deleteTransaction(id) {
    const transactions = getTransactions();
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
}

