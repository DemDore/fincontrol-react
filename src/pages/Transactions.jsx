import { useState, useEffect } from 'react';
import { getTransactions, saveTransactions, deleteTransaction } from '../utils/storage';
import { formatNumber } from '../utils/formatters';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionModal from '../components/Transactions/TransactionModal';
import TransactionsTable from '../components/Transactions/TransactionsTable';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filters, setFilters] = useState({ type: 'all', category: 'all', search: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [transactions, filters]);

    const loadTransactions = () => {
        setTransactions(getTransactions());
    };

    const applyFilters = () => {
        let filtered = [...transactions];
        
        if (filters.type !== 'all') {
            filtered = filtered.filter(t => t.type === filters.type);
        }
        if (filters.category !== 'all') {
            filtered = filtered.filter(t => t.category === filters.category);
        }
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(t => 
                t.description?.toLowerCase().includes(searchLower) ||
                t.category.toLowerCase().includes(searchLower)
            );
        }
        
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredTransactions(filtered);
    };

    const handleSave = (transactionData) => {
        let newTransactions;
        
        if (editingTransaction) {
            // Обновление существующей
            newTransactions = transactions.map(t =>
                t.id === editingTransaction.id
                    ? { ...transactionData, id: t.id }
                    : t
            );
        } else {
            // Добавление новой
            const newId = Math.max(0, ...transactions.map(t => t.id), 0) + 1;
            newTransactions = [{ ...transactionData, id: newId }, ...transactions];
        }
        
        saveTransactions(newTransactions);
        setTransactions(newTransactions);
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Удалить эту транзакцию?')) {
            deleteTransaction(id);
            loadTransactions();
        }
    };

    const handleResetFilters = () => {
        setFilters({ type: 'all', category: 'all', search: '' });
    };

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="content">
            <div className="page-header">
                <h1>Все транзакции</h1>
                <button className="btn-primary" onClick={() => {
                    setEditingTransaction(null);
                    setIsModalOpen(true);
                }}>
                    ➕ Добавить транзакцию
                </button>
            </div>

            <TransactionFilters 
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
            />

            <div className="transactions-stats">
                <div className="stat-badge">
                    <span>Всего транзакций:</span>
                    <strong>{filteredTransactions.length}</strong>
                </div>
                <div className="stat-badge income">
                    <span>Доходы:</span>
                    <strong>{formatNumber(totalIncome)} ₽</strong>
                </div>
                <div className="stat-badge expense">
                    <span>Расходы:</span>
                    <strong>{formatNumber(totalExpense)} ₽</strong>
                </div>
            </div>

            <TransactionsTable 
                transactions={filteredTransactions}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <TransactionModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
                onSave={handleSave}
                transaction={editingTransaction}
            />
        </div>
    );
};

export default Transactions;