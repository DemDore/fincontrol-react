import { useState, useEffect } from 'react';
import { getTransactions } from '../utils/storage';
import StatsCards from '../components/Dashboard/StatsCards';
import Chart from '../components/Dashboard/Chart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import ExpenseCategories from '../components/Dashboard/ExpenseCategories';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [chartPeriod, setChartPeriod] = useState('all');

    useEffect(() => {
        loadTransactions();
        
        // Слушаем изменения в localStorage (когда добавляются транзакции из других вкладок)
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

    // Обновляем транзакции при изменении (для текущей вкладки)
    const refreshTransactions = () => {
        loadTransactions();
    };

    return (
        <div className="content">
            <StatsCards transactions={transactions} />
            <Chart 
                transactions={transactions} 
                period={chartPeriod}
                onPeriodChange={setChartPeriod}
            />
            <div className="two-columns">
                <RecentTransactions transactions={transactions} />
                <ExpenseCategories transactions={transactions} />
            </div>
        </div>
    );
};

export default Dashboard;