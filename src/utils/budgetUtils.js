import { budgetsAPI } from '../services/api';
import { getTransactions } from './storage';

export const STORAGE_KEYS = {
    BUDGETS: 'fincontrol_budgets',
    OVERALL_BUDGET: 'fincontrol_overall_budget'
};

export function getCurrentMonth() {
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return months[new Date().getMonth()];
}

export function getCurrentYear() {
    return new Date().getFullYear();
}

export async function getBudgets() {
    try {
        const currentMonth = getCurrentMonth();
        const currentYear = getCurrentYear();
        const budgets = await budgetsAPI.getAll(currentMonth, currentYear);
        
        // Добавляем поле spent (рассчитываем из транзакций)
        const transactions = await getTransactions();
        const monthlyTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            const month = date.toLocaleDateString('ru-RU', { month: 'long' });
            const year = date.getFullYear();
            return month === currentMonth && year === currentYear && t.type === 'expense';
        });
        
        const spentByCategory = {};
        monthlyTransactions.forEach(t => {
            if (!spentByCategory[t.category]) {
                spentByCategory[t.category] = 0;
            }
            spentByCategory[t.category] += t.amount;
        });
        
        return budgets.map(budget => ({
            ...budget,
            spent: spentByCategory[budget.category] || 0
        }));
    } catch (error) {
        console.error('Ошибка загрузки бюджетов:', error);
        return [];
    }
}

export async function getOverallBudget() {
    const saved = localStorage.getItem(STORAGE_KEYS.OVERALL_BUDGET);
    if (saved) return JSON.parse(saved);
    return 50000;
}

export async function saveOverallBudget(budget) {
    localStorage.setItem(STORAGE_KEYS.OVERALL_BUDGET, JSON.stringify(budget));
}

export async function addBudget(budget) {
    try {
        return await budgetsAPI.create(budget);
    } catch (error) {
        console.error('Ошибка добавления бюджета:', error);
        throw error;
    }
}

export async function updateBudget(id, budget) {
    try {
        return await budgetsAPI.update(id, budget);
    } catch (error) {
        console.error('Ошибка обновления бюджета:', error);
        throw error;
    }
}

export async function deleteBudget(id) {
    try {
        return await budgetsAPI.delete(id);
    } catch (error) {
        console.error('Ошибка удаления бюджета:', error);
        throw error;
    }
}

export async function updateBudgetsSpent(budgets, transactions) {
    const currentMonth = getCurrentMonth();
    const currentYear = getCurrentYear();
    
    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const month = date.toLocaleDateString('ru-RU', { month: 'long' });
        const year = date.getFullYear();
        return month === currentMonth && year === currentYear && t.type === 'expense';
    });
    
    const spentByCategory = {};
    monthlyTransactions.forEach(t => {
        if (!spentByCategory[t.category]) {
            spentByCategory[t.category] = 0;
        }
        spentByCategory[t.category] += t.amount;
    });
    
    return budgets.map(budget => ({
        ...budget,
        spent: spentByCategory[budget.category] || 0
    }));
}

export function calculateOverallStats(budgets, overallBudget) {
    const totalBudget = overallBudget;
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const remaining = totalBudget - totalSpent;
    const percent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
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

// Для обратной совместимости
export function saveBudgets(budgets) {
    console.warn('saveBudgets устарел, используйте API методы');
}