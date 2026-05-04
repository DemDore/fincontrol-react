import { categoriesAPI } from '../services/api';

export async function getExpenseCategories() {
    try {
        const categories = await categoriesAPI.getAll('expense');
        return categories;
    } catch (error) {
        console.error('Ошибка загрузки категорий расходов:', error);
        return [];
    }
}

export async function getIncomeCategories() {
    try {
        const categories = await categoriesAPI.getAll('income');
        return categories;
    } catch (error) {
        console.error('Ошибка загрузки категорий доходов:', error);
        return [];
    }
}

export async function getExpenseCategoryNames() {
    const categories = await getExpenseCategories();
    return categories.map(c => c.name);
}

export async function getIncomeCategoryNames() {
    const categories = await getIncomeCategories();
    return categories.map(c => c.name);
}

export async function addExpenseCategory(category) {
    try {
        return await categoriesAPI.create('expense', category);
    } catch (error) {
        console.error('Ошибка добавления категории расхода:', error);
        throw error;
    }
}

export async function addIncomeCategory(category) {
    try {
        return await categoriesAPI.create('income', category);
    } catch (error) {
        console.error('Ошибка добавления категории дохода:', error);
        throw error;
    }
}

export async function updateExpenseCategory(id, category) {
    try {
        return await categoriesAPI.update(id, category);
    } catch (error) {
        console.error('Ошибка обновления категории расхода:', error);
        throw error;
    }
}

export async function updateIncomeCategory(id, category) {
    try {
        return await categoriesAPI.update(id, category);
    } catch (error) {
        console.error('Ошибка обновления категории дохода:', error);
        throw error;
    }
}

export async function deleteExpenseCategory(id) {
    try {
        return await categoriesAPI.delete(id);
    } catch (error) {
        console.error('Ошибка удаления категории расхода:', error);
        throw error;
    }
}

export async function deleteIncomeCategory(id) {
    try {
        return await categoriesAPI.delete(id);
    } catch (error) {
        console.error('Ошибка удаления категории дохода:', error);
        throw error;
    }
}

// Для обратной совместимости с компонентами
export function saveExpenseCategories(categories) {
    console.warn('saveExpenseCategories устарел, используйте API методы');
}

export function saveIncomeCategories(categories) {
    console.warn('saveIncomeCategories устарел, используйте API методы');
}