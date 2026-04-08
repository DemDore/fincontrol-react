import { useState, useEffect } from 'react';
import { getTransactions } from '../utils/storage';
import { 
    getTransactionsByPeriod,
    groupByMonth,
    groupByMonthForYear,
    groupByWeek,
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
    const [chartData, setChartData] = useState([]);
    const [chartType, setChartType] = useState('line');
    const [filteredTransactions, setFilteredTransactions] = useState([]);
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
                // Показываем данные по дням текущего месяца
                const dailyData = groupByDay(transactions, currentYear, currentMonth);
                setChartData(dailyData);
                setChartType('bar');
                break;
            case 'quarter':
                // Показываем данные по неделям/месяцам текущего квартала
                const currentQuarter = Math.floor(currentMonth / 3) + 1;
                const weeklyData = groupByWeek(transactions, currentYear, currentQuarter);
                setChartData(weeklyData);
                setChartType('bar');
                break;
            case 'year':
                // Показываем данные по месяцам текущего года
                const monthlyData = groupByMonthForYear(transactions, currentYear);
                setChartData(monthlyData);
                setChartType('line');
                break;
            case 'all':
                // Показываем данные за последние 12 месяцев
                const allMonthsData = groupByMonth(transactions, 12);
                setChartData(allMonthsData);
                setChartType('line');
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
        
        // Сравнение с прошлым периодом
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

    // Получить заголовок графика в зависимости от периода
    const getChartTitle = () => {
        switch(period) {
            case 'month':
                const now = new Date();
                const monthName = now.toLocaleDateString('ru-RU', { month: 'long' });
                return `Динамика доходов и расходов за ${monthName}`;
            case 'quarter':
                return 'Динамика доходов и расходов по месяцам квартала';
            case 'year':
                return 'Динамика доходов и расходов по месяцам года';
            case 'all':
                return 'Динамика доходов и расходов за последние 12 месяцев';
            default:
                return 'Динамика доходов и расходов';
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
                    <IncomeExpenseChart chartData={chartData} chartType={chartType} />
                ) : (
                    <div className="empty-state-small">Нет данных для отображения</div>
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