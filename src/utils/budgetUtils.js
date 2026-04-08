import { getTransactions } from './storage';

// Ключи для localStorage
export const STORAGE_KEYS = {
    BUDGETS: 'fincontrol_budgets',
    OVERALL_BUDGET: 'fincontrol_overall_budget'
};

// Получить все бюджеты
export function getBudgets() {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (saved) return JSON.parse(saved);
    
    // Бюджеты по умолчанию
    return [
        { id: 1, category: '🍔 Еда', budget: 15000, spent: 12300, month: getCurrentMonth(), year: getCurrentYear() },
        { id: 2, category: '🚗 Транспорт', budget: 5000, spent: 4250, month: getCurrentMonth(), year: getCurrentYear() },
        { id: 3, category: '🏠 Жильё', budget: 20000, spent: 18000, month: getCurrentMonth(), year: getCurrentYear() },
        { id: 4, category: '🛍️ Шопинг', budget: 10000, spent: 12500, month: getCurrentMonth(), year: getCurrentYear() },
        { id: 5, category: '🎮 Развлечения', budget: 5000, spent: 3150, month: getCurrentMonth(), year: getCurrentYear() },
        { id: 6, category: '💊 Здоровье', budget: 3000, spent: 1200, month: getCurrentMonth(), year: getCurrentYear() },
        { id: 7, category: '📚 Образование', budget: 5000, spent: 2500, month: getCurrentMonth(), year: getCurrentYear() }
    ];
}

// Сохранить все бюджеты
export function saveBudgets(budgets) {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
}

// Получить общий бюджет
export function getOverallBudget() {
    const saved = localStorage.getItem(STORAGE_KEYS.OVERALL_BUDGET);
    if (saved) return JSON.parse(saved);
    return 50000; // Бюджет по умолчанию
}

// Сохранить общий бюджет
export function saveOverallBudget(budget) {
    localStorage.setItem(STORAGE_KEYS.OVERALL_BUDGET, JSON.stringify(budget));
}

// Получить текущий месяц
export function getCurrentMonth() {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return months[new Date().getMonth()];
}

// Получить текущий год
export function getCurrentYear() {
    return new Date().getFullYear();
}

// Обновить потраченные суммы для всех бюджетов на основе транзакций
export function updateBudgetsSpent(budgets, transactions) {
    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();
    
    // Фильтруем транзакции за текущий месяц
    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const month = date.toLocaleDateString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        return month === currentMonth && year === currentYear && t.type === 'expense';
    });
    
    // Группируем расходы по категориям
    const spentByCategory = {};
    monthlyTransactions.forEach(t => {
        if (!spentByCategory[t.category]) {
            spentByCategory[t.category] = 0;
        }
        spentByCategory[t.category] += t.amount;
    });
    
    // Обновляем бюджеты
    return budgets.map(budget => ({
        ...budget,
        spent: spentByCategory[budget.category] || 0
    }));
}

// Добавить новый бюджет
export function addBudget(budget) {
    const budgets = getBudgets();
    const newId = Math.max(0, ...budgets.map(b => b.id), 0) + 1;
    const newBudget = { ...budget, id: newId, spent: 0 };
    budgets.push(newBudget);
    saveBudgets(budgets);
    return newBudget;
}

// Обновить бюджет
export function updateBudget(id, updatedData) {
    const budgets = getBudgets();
    const index = budgets.findIndex(b => b.id === id);
    if (index !== -1) {
        budgets[index] = { ...budgets[index], ...updatedData };
        saveBudgets(budgets);
    }
}

// Удалить бюджет
export function deleteBudget(id) {
    const budgets = getBudgets();
    const filtered = budgets.filter(b => b.id !== id);
    saveBudgets(filtered);
}

// Рассчитать общую статистику
export function calculateOverallStats(budgets, overallBudget) {
    const totalBudget = overallBudget;
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    const percent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Прогноз на конец месяца (дней осталось ~30)
    const daysLeft = 30 - new Date().getDate();
    const dailyLimit = daysLeft > 0 ? remaining / daysLeft : remaining;
    
    return {
        totalBudget,
        totalSpent,
        remaining,
        percent: Math.min(percent, 100),
        dailyLimit: dailyLimit > 0 ? dailyLimit : 0,
        isOverBudget: totalSpent > totalBudget
    };
}