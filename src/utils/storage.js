import { transactionsAPI } from '../services/api';

export async function getTransactions() {
    try {
        return await transactionsAPI.getAll();
    } catch (error) {
        console.error('Ошибка загрузки транзакций:', error);
        return [];
    }
}

export async function addTransaction(transaction) {
    try {
        return await transactionsAPI.create(transaction);
    } catch (error) {
        console.error('Ошибка добавления транзакции:', error);
        throw error;
    }
}

export async function updateTransaction(id, transaction) {
    try {
        return await transactionsAPI.update(id, transaction);
    } catch (error) {
        console.error('Ошибка обновления транзакции:', error);
        throw error;
    }
}

export async function deleteTransaction(id) {
    try {
        return await transactionsAPI.delete(id);
    } catch (error) {
        console.error('Ошибка удаления транзакции:', error);
        throw error;
    }
}

// Временная заглушка для обратной совместимости
export function saveTransactions(transactions) {
    console.warn('saveTransactions устарел, используйте API методы');
}