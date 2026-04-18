import { useState, useEffect } from 'react';
import { getTransactions, saveTransactions, deleteTransaction } from '../utils/storage';
import { getExpenseCategoryNames, getIncomeCategoryNames } from '../utils/categoriesUtils';
import { useCurrency } from '../hooks/useCurrency';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionModal from '../components/Transactions/TransactionModal';
import TransactionsTable from '../components/Transactions/TransactionsTable';

const Transactions = () => {
    const { formatCurrency } = useCurrency();
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filters, setFilters] = useState({ 
        type: 'all', 
        category: 'all', 
        search: '',
        periodType: 'all',
        month: null,
        year: null,
        startDate: null,
        endDate: null
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);

    useEffect(() => {
        loadTransactions();
        loadCategories();
        
        const handleCategoriesUpdate = () => {
            loadCategories();
        };
        
        window.addEventListener('categoriesUpdated', handleCategoriesUpdate);
        return () => window.removeEventListener('categoriesUpdated', handleCategoriesUpdate);
    }, []);

    useEffect(() => {
        applyFilters();
    }, [transactions, filters]);

    const loadTransactions = () => {
        setTransactions(getTransactions());
    };

    const loadCategories = () => {
        setExpenseCategories(getExpenseCategoryNames());
        setIncomeCategories(getIncomeCategoryNames());
    };

    // Функция для фильтрации по периоду
    const filterByPeriod = (transaction) => {
        const date = new Date(transaction.date);
        const now = new Date();
        
        switch(filters.periodType) {
            case 'currentMonth':
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            case 'specificMonth':
                if (!filters.month || !filters.year) return true;
                const monthIndex = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
                                    .indexOf(filters.month);
                return date.getMonth() === monthIndex && date.getFullYear() === filters.year;
            case 'specificYear':
                if (!filters.year) return true;
                return date.getFullYear() === filters.year;
            case 'dateRange':
                if (filters.startDate && filters.endDate) {
                    const start = new Date(filters.startDate);
                    const end = new Date(filters.endDate);
                    return date >= start && date <= end;
                }
                return true;
            default:
                return true;
        }
    };

    const applyFilters = () => {
        let filteredData = [...transactions];
        
        // Фильтр по типу
        if (filters.type !== 'all') {
            filteredData = filteredData.filter(t => t.type === filters.type);
        }
        
        // Фильтр по категории
        if (filters.category !== 'all') {
            filteredData = filteredData.filter(t => t.category === filters.category);
        }
        
        // Фильтр по периоду
        filteredData = filteredData.filter(t => filterByPeriod(t));
        
        // Фильтр по поиску
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredData = filteredData.filter(t => 
                t.description?.toLowerCase().includes(searchLower) ||
                t.category.toLowerCase().includes(searchLower)
            );
        }
        
        filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
        setFilteredTransactions(filteredData);
    };

    const handleSave = (transactionData) => {
        let newTransactions;
        
        if (editingTransaction) {
            newTransactions = transactions.map(t =>
                t.id === editingTransaction.id
                    ? { ...transactionData, id: t.id }
                    : t
            );
        } else {
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
        setFilters({ 
            type: 'all', 
            category: 'all', 
            search: '',
            periodType: 'all',
            month: null,
            year: null,
            startDate: null,
            endDate: null
        });
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
                <div className="header-buttons">
                    <button className="btn-primary" onClick={() => {
                        setEditingTransaction(null);
                        setIsModalOpen(true);
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        Добавить транзакцию
                    </button>
                    <button className="btn-secondary" onClick={handleResetFilters}>
                        Сбросить фильтры
                    </button>
                </div>
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
                    <strong>{formatCurrency(totalIncome)}</strong>
                </div>
                <div className="stat-badge expense">
                    <span>Расходы:</span>
                    <strong>{formatCurrency(totalExpense)}</strong>
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
                expenseCategories={expenseCategories}
                incomeCategories={incomeCategories}
            />
        </div>
    );
};

export default Transactions;