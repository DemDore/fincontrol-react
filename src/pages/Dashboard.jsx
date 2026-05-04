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

    useEffect(() => {
        loadTransactions();
        setBudgets(getBudgets());
        
        const handleStorageChange = () => {
            loadTransactions();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const loadTransactions = () => {
        const allTransactions = getTransactions();
        setTransactions(allTransactions);
    };

    return (
        <div className="content dashboard-page">   {/* ← ТОЛЬКО ЭТУ СТРОКУ ИЗМЕНИТЬ */}
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