// Ключи для localStorage
const STORAGE_KEYS = {
    EXPENSE_CATEGORIES: 'fincontrol_expense_categories',
    INCOME_CATEGORIES: 'fincontrol_income_categories'
};

// Начальные категории расходов
const defaultExpenseCategories = [
    { id: 1, name: '🍔 Еда', icon: '🍔', budget: 15000 },
    { id: 2, name: '🚗 Транспорт', icon: '🚗', budget: 5000 },
    { id: 3, name: '🏠 Жильё', icon: '🏠', budget: 20000 },
    { id: 4, name: '🛍️ Шопинг', icon: '🛍️', budget: 10000 },
    { id: 5, name: '🎮 Развлечения', icon: '🎮', budget: 5000 },
    { id: 6, name: '💊 Здоровье', icon: '💊', budget: 3000 },
    { id: 7, name: '📚 Образование', icon: '📚', budget: 5000 }
];

// Начальные категории доходов
const defaultIncomeCategories = [
    { id: 1, name: '💼 Зарплата', icon: '💼' },
    { id: 2, name: '📈 Инвестиции', icon: '📈' },
    { id: 3, name: '🎁 Подарки', icon: '🎁' },
    { id: 4, name: '💸 Фриланс', icon: '💸' }
];

// Получить категории расходов
export function getExpenseCategories() {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
    if (saved) return JSON.parse(saved);
    return defaultExpenseCategories;
}

// Получить категории доходов
export function getIncomeCategories() {
    const saved = localStorage.getItem(STORAGE_KEYS.INCOME_CATEGORIES);
    if (saved) return JSON.parse(saved);
    return defaultIncomeCategories;
}

// Получить все категории (только названия)
export function getAllCategoryNames() {
    const expenseNames = getExpenseCategories().map(c => c.name);
    const incomeNames = getIncomeCategories().map(c => c.name);
    return [...expenseNames, ...incomeNames];
}

// Получить названия категорий расходов
export function getExpenseCategoryNames() {
    return getExpenseCategories().map(c => c.name);
}

// Получить названия категорий доходов
export function getIncomeCategoryNames() {
    return getIncomeCategories().map(c => c.name);
}

// Сохранить категории расходов
export function saveExpenseCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(categories));
    // Триггерим событие обновления для других компонентов
    window.dispatchEvent(new Event('categoriesUpdated'));
}

// Сохранить категории доходов
export function saveIncomeCategories(categories) {
    localStorage.setItem(STORAGE_KEYS.INCOME_CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new Event('categoriesUpdated'));
}

// Добавить категорию расходов
export function addExpenseCategory(category) {
    const categories = getExpenseCategories();
    const newId = Math.max(0, ...categories.map(c => c.id), 0) + 1;
    const newCategory = { ...category, id: newId };
    categories.push(newCategory);
    saveExpenseCategories(categories);
    return newCategory;
}

// Добавить категорию доходов
export function addIncomeCategory(category) {
    const categories = getIncomeCategories();
    const newId = Math.max(0, ...categories.map(c => c.id), 0) + 1;
    const newCategory = { ...category, id: newId };
    categories.push(newCategory);
    saveIncomeCategories(categories);
    return newCategory;
}

// Обновить категорию расходов
export function updateExpenseCategory(id, updatedData) {
    const categories = getExpenseCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        categories[index] = { ...categories[index], ...updatedData };
        saveExpenseCategories(categories);
    }
}

// Обновить категорию доходов
export function updateIncomeCategory(id, updatedData) {
    const categories = getIncomeCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
        categories[index] = { ...categories[index], ...updatedData };
        saveIncomeCategories(categories);
    }
}

// Удалить категорию расходов
export function deleteExpenseCategory(id) {
    const categories = getExpenseCategories();
    const filtered = categories.filter(c => c.id !== id);
    saveExpenseCategories(filtered);
}

// Удалить категорию доходов
export function deleteIncomeCategory(id) {
    const categories = getIncomeCategories();
    const filtered = categories.filter(c => c.id !== id);
    saveIncomeCategories(filtered);
}