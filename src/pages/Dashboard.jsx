import { useState, useEffect } from 'react';
import { getTransactions } from '../utils/storage';
import { getBudgets } from '../utils/budgetUtils';
import StatsCards from '../components/Dashboard/StatsCards';
import Chart from '../components/Dashboard/Chart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import ExpenseCategories from '../components/Dashboard/ExpenseCategories';
import FinancialGoals from '../components/Dashboard/FinancialGoals';
import Calendar from '../components/Dashboard/Calendar';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [chartPeriod, setChartPeriod] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
        loadBudgets();
        
        const handleStorageChange = () => {
            loadTransactions();
            loadBudgets();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('transactionsUpdated', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('transactionsUpdated', handleStorageChange);
        };
    }, []);

    const loadTransactions = async () => {
        try {
            const allTransactions = await getTransactions();
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Ошибка загрузки транзакций:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadBudgets = async () => {
        try {
            const allBudgets = await getBudgets();
            setBudgets(allBudgets);
        } catch (error) {
            console.error('Ошибка загрузки бюджетов:', error);
        }
    };

    if (loading) {
        return <div className="content dashboard-page">Загрузка...</div>;
    }

    return (
        <div className="content dashboard-page">
            <StatsCards transactions={transactions} />
            
            <div className="dashboard-main-layout">
                <div className="dashboard-main">
                    <Chart 
                        transactions={transactions} 
                        period={chartPeriod}
                        onPeriodChange={setChartPeriod}
                    />
                    
                    <FinancialGoals transactions={transactions} />
                    
                    <div className="two-columns">
                        <RecentTransactions transactions={transactions} />
                        <ExpenseCategories transactions={transactions} />
                    </div>
                </div>
                <div className="dashboard-sidebar">
                    <Calendar />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;