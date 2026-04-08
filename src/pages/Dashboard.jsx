import { useState, useEffect } from 'react';
import { getTransactions } from '../utils/storage';
import StatsCards from '../components/Dashboard/StatsCards';
import Chart from '../components/Dashboard/Chart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import ExpenseCategories from '../components/Dashboard/ExpenseCategories';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    return (
        <div className="content">
            <StatsCards transactions={transactions} />
            <Chart />
            <div className="two-columns">
                <RecentTransactions transactions={transactions} />
                <ExpenseCategories transactions={transactions} />
            </div>
        </div>
    );
};

export default Dashboard;