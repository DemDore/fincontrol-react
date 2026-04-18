import { useState, useEffect } from 'react';
import { getTransactions } from '../utils/storage';
import { useCurrency } from '../hooks/useCurrency';
import { 
    getTransactionsByPeriod,
    groupByMonth,
    groupByMonthForYear,
    groupByDay,
    groupExpensesByCategory,
    groupIncomeByCategory,
    getTransactionFrequency,
    calculateComparison
} from '../utils/analyticsUtils';
import PeriodSelector from '../components/Analytics/PeriodSelector';
import StatsCards from '../components/Analytics/StatsCards';
import IncomeExpenseChart from '../components/Analytics/IncomeExpenseChart';
import ExpensePieChart from '../components/Analytics/ExpensePieChart';
import IncomeCategories from '../components/Analytics/IncomeCategories';
import FrequentTransactions from '../components/Analytics/FrequentTransactions';
import ComparisonCards from '../components/Analytics/ComparisonCards';
import '../styles/analytics.css';

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);
    const [period, setPeriod] = useState('month');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [expensesByCategory, setExpensesByCategory] = useState([]);
    const [incomesByCategory, setIncomesByCategory] = useState([]);
    const [frequentTransactions, setFrequentTransactions] = useState([]);
    const [comparison, setComparison] = useState(null);
    const [stats, setStats] = useState({ income: 0, expense: 0, count: 0 });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            processData();
            updateChartData();
        }
    }, [transactions, period]);

    const loadData = () => {
        const allTransactions = getTransactions();
        setTransactions(allTransactions);
    };

    const updateChartData = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        switch(period) {
            case 'month':
                const dailyData = groupByDay(transactions, currentYear, currentMonth);
                setChartData(dailyData);
                break;
            case 'quarter':
                const quarterlyData = groupByMonthForYear(transactions, currentYear).slice(0, 3);
                setChartData(quarterlyData);
                break;
            case 'year':
                const yearlyData = groupByMonthForYear(transactions, currentYear);
                setChartData(yearlyData);
                break;
            case 'all':
                const allData = groupByMonth(transactions, 12);
                setChartData(allData);
                break;
            default:
                setChartData([]);
        }
    };

    const processData = () => {
        // Фильтрация по периоду для остальных блоков
        const filtered = getTransactionsByPeriod(transactions, period);
        setFilteredTransactions(filtered);
        
        // Статистика
        const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        setStats({ income, expense, count: filtered.length });
        
        // Расходы по категориям
        const expenses = groupExpensesByCategory(filtered);
        setExpensesByCategory(expenses);
        
        // Доходы по категориям
        const incomes = groupIncomeByCategory(filtered);
        setIncomesByCategory(incomes);
        
        // Частота транзакций
        const frequent = getTransactionFrequency(filtered);
        setFrequentTransactions(frequent);
        
        // Сравнение с прошлым периодом (упрощённо)
        const now = new Date();
        let previousStart = new Date();
        let currentStart = new Date();
        
        switch(period) {
            case 'month':
                currentStart.setMonth(now.getMonth() - 1);
                previousStart.setMonth(now.getMonth() - 2);
                break;
            case 'quarter':
                currentStart.setMonth(now.getMonth() - 3);
                previousStart.setMonth(now.getMonth() - 6);
                break;
            case 'year':
                currentStart.setFullYear(now.getFullYear() - 1);
                previousStart.setFullYear(now.getFullYear() - 2);
                break;
            default:
                currentStart = new Date(0);
                previousStart = new Date(0);
        }
        
        const currentPeriod = transactions.filter(t => new Date(t.date) >= currentStart);
        const previousPeriod = transactions.filter(t => new Date(t.date) >= previousStart && new Date(t.date) < currentStart);
        
        const comparisonData = calculateComparison(transactions, currentPeriod, previousPeriod);
        setComparison(comparisonData);
    };

    const getChartTitle = () => {
        const now = new Date();
        const monthName = now.toLocaleDateString('ru-RU', { month: 'long' });
        switch(period) {
            case 'month':
                return `Динамика доходов и расходов за ${monthName}`;
            case 'quarter':
                return 'Динамика доходов и расходов за квартал';
            case 'year':
                return 'Динамика доходов и расходов по месяцам года';
            default:
                return 'Динамика доходов и расходов за последние 12 месяцев';
        }
    };

    return (
        <div className="content analytics-page">
            <div className="page-header">
                <h1>Аналитика</h1>
                <PeriodSelector period={period} onPeriodChange={setPeriod} />
            </div>

            <StatsCards 
                income={stats.income}
                expense={stats.expense}
                transactionCount={stats.count}
            />

            <div className="analytics-section full-width">
                <div className="section-header">
                    <h2>{getChartTitle()}</h2>
                </div>
                {chartData.length > 0 ? (
                    <IncomeExpenseChart monthlyData={chartData} />
                ) : (
                    <div className="empty-chart">Нет данных для отображения</div>
                )}
            </div>

            <div className="analytics-two-columns">
                <div className="analytics-section">
                    <div className="section-header">
                        <h2>Расходы по категориям</h2>
                    </div>
                    {expensesByCategory.length > 0 ? (
                        <ExpensePieChart expenses={expensesByCategory} />
                    ) : (
                        <div className="empty-state-small">Нет данных о расходах</div>
                    )}
                </div>

                <div className="analytics-section">
                    <IncomeCategories incomes={incomesByCategory} />
                </div>
            </div>

            <div className="analytics-section full-width">
                <FrequentTransactions frequent={frequentTransactions} />
            </div>

            {comparison && (
                <div className="analytics-section full-width">
                    <ComparisonCards comparison={comparison} />
                </div>
            )}

            <div className="export-section">
                <button className="btn-primary export-btn" onClick={() => alert('Экспорт данных в разработке')}>
                    📎 Экспорт отчёта в CSV
                </button>
            </div>
        </div>
    );
};

export default Analytics;