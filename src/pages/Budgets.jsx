import { useState, useEffect } from 'react';
import { getTransactions } from '../utils/storage';
import { useCurrency } from '../hooks/useCurrency';
import { 
    getBudgets, 
    saveBudgets, 
    getOverallBudget,
    saveOverallBudget,
    updateBudgetsSpent,
    addBudget,
    updateBudget,
    deleteBudget,
    calculateOverallStats,
    getCurrentMonth,
    getCurrentYear
} from '../utils/budgetUtils';
import OverallBudgetCard from '../components/Budgets/OverallBudgetCard';
import BudgetTable from '../components/Budgets/BudgetTable';
import BudgetModal from '../components/Budgets/BudgetModal';
import BudgetAlerts from '../components/Budgets/BudgetAlerts';
import '../styles/budgets.css';

const Budgets = () => {
    const { formatCurrency } = useCurrency();
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [overallBudget, setOverallBudget] = useState(50000);
    const [stats, setStats] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);
    const [dismissedAlerts, setDismissedAlerts] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (transactions.length > 0 && budgets.length > 0) {
            updateBudgetsData();
        }
    }, [transactions]);

    const loadData = () => {
        const allTransactions = getTransactions();
        setTransactions(allTransactions);
        
        const savedBudgets = getBudgets();
        const updatedBudgets = updateBudgetsSpent(savedBudgets, allTransactions);
        setBudgets(updatedBudgets);
        
        const savedOverall = getOverallBudget();
        setOverallBudget(savedOverall);
        
        updateStats(updatedBudgets, savedOverall);
    };

    const updateBudgetsData = () => {
        const updated = updateBudgetsSpent(budgets, transactions);
        setBudgets(updated);
        saveBudgets(updated);
        updateStats(updated, overallBudget);
    };

    const updateStats = (budgetsData, overall) => {
        const newStats = calculateOverallStats(budgetsData, overall);
        setStats(newStats);
    };

    const handleOverallBudgetEdit = (newBudget) => {
        saveOverallBudget(newBudget);
        setOverallBudget(newBudget);
        updateStats(budgets, newBudget);
    };

    const handleSaveBudget = (budgetData) => {
        if (editingBudget) {
            updateBudget(editingBudget.id, budgetData);
            loadData();
        } else {
            addBudget(budgetData);
            loadData();
        }
        setIsModalOpen(false);
        setEditingBudget(null);
    };

    const handleEditBudget = (budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    const handleDeleteBudget = (id) => {
        if (confirm('Удалить этот бюджет?')) {
            deleteBudget(id);
            loadData();
        }
    };

    const handleDismissAlert = (id) => {
        setDismissedAlerts([...dismissedAlerts, id]);
    };

    const filteredBudgets = budgets.filter(b => 
        b.month === getCurrentMonth() && b.year === getCurrentYear()
    );

    const visibleAlerts = filteredBudgets.filter(b => 
        b.spent > b.budget && !dismissedAlerts.includes(b.id)
    );

    return (
        <div className="content budgets-page">
            <div className="page-header">
                <div className="header-left">
                    <h1>Бюджеты</h1>
                    <div className="overall-budget-header">
                        <span className="overall-label">💰 Общий бюджет:</span>
                        <span className="overall-amount">{stats?.totalBudget || 0} ₽</span>
                    </div>
                </div>
                <button className="btn-primary" onClick={() => {
                    setEditingBudget(null);
                    setIsModalOpen(true);
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Добавить бюджет
                </button>
            </div>

            {stats && (
                <OverallBudgetCard 
                    stats={stats}
                    onEdit={handleOverallBudgetEdit}
                />
            )}

            <div className="budgets-section-header">
                <h2>📁 Бюджеты по категориям</h2>
            </div>

            <BudgetTable 
                budgets={filteredBudgets}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
            />

            <BudgetAlerts 
                budgets={visibleAlerts}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
                onDismiss={handleDismissAlert}
            />

            <BudgetModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingBudget(null);
                }}
                onSave={handleSaveBudget}
                budget={editingBudget}
            />
        </div>
    );
};

export default Budgets;