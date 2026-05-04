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
    const [previousPeriodData, setPreviousPeriodData] = useState({ income: 0, expense: 0, savings: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const { formatCurrency } = useCurrency();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            processData();
            updateChartData();
        }
    }, [transactions, period]);

    const loadData = async () => {
        try {
            setLoading(true);
            const allTransactions = await getTransactions();
            setTransactions(allTransactions);
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateChartData = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
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
        const filtered = getTransactionsByPeriod(transactions, period);
        setFilteredTransactions(filtered);
        
        const income = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        setStats({ income, expense, count: filtered.length });
        
        const expenses = groupExpensesByCategory(filtered);
        setExpensesByCategory(expenses);
        
        const incomes = groupIncomeByCategory(filtered);
        setIncomesByCategory(incomes);
        
        const frequent = getTransactionFrequency(filtered);
        setFrequentTransactions(frequent);
        
        // Расчёт данных за предыдущий период для сравнения
        const currentDate = new Date();
        let previousStart = new Date();
        let previousEnd = new Date();

        switch(period) {
            case 'month':
                previousStart.setMonth(currentDate.getMonth() - 2);
                previousEnd.setMonth(currentDate.getMonth() - 1);
                break;
            case 'quarter':
                previousStart.setMonth(currentDate.getMonth() - 6);
                previousEnd.setMonth(currentDate.getMonth() - 3);
                break;
            case 'year':
                previousStart.setFullYear(currentDate.getFullYear() - 2);
                previousEnd.setFullYear(currentDate.getFullYear() - 1);
                break;
            default:
                previousStart = new Date(0);
                previousEnd = new Date(0);
        }

        const previousTransactions = transactions.filter(t => {
            const date = new Date(t.date);
            return date >= previousStart && date < previousEnd;
        });

        const previousIncome = previousTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const previousExpense = previousTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const previousSavings = previousIncome - previousExpense;

        setPreviousPeriodData({
            income: previousIncome,
            expense: previousExpense,
            savings: previousSavings,
            count: previousTransactions.length
        });
        
        const comparisonData = calculateComparison(transactions, filtered, previousTransactions);
        setComparison(comparisonData);
    };

    const getChartTitle = () => {
        const currentDate = new Date();
        const monthName = currentDate.toLocaleDateString('ru-RU', { month: 'long' });
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

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) {
            alert('Нет данных для экспорта');
            return;
        }

        const currentDate = new Date();
        const periodLabel = {
            month: `${currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
            quarter: `${Math.floor((currentDate.getMonth() + 3) / 3)} квартал ${currentDate.getFullYear()}`,
            year: `${currentDate.getFullYear()} год`,
            all: 'всё время'
        }[period] || 'выбранный период';

        const totalIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((s, t) => s + t.amount, 0);
        const totalExpense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((s, t) => s + t.amount, 0);
        const balance = totalIncome - totalExpense;

        const rows = [];
        rows.push(['"ФИНАНСОВЫЙ ОТЧЁТ"']);
        rows.push([`"Период: ${periodLabel}"`]);
        rows.push([`"Дата формирования: ${currentDate.toLocaleDateString('ru-RU')} ${currentDate.toLocaleTimeString('ru-RU')}"`]);
        rows.push([]);
        rows.push(['"СВОДКА"']);
        rows.push(['"Показатель"', '"Сумма"']);
        rows.push(['"Всего доходов"', totalIncome.toFixed(2)]);
        rows.push(['"Всего расходов"', totalExpense.toFixed(2)]);
        rows.push(['"Чистый баланс"', balance.toFixed(2)]);
        rows.push(['"Количество транзакций"', filteredTransactions.length]);
        rows.push([]);
        rows.push(['"ДЕТАЛЬНЫЙ СПИСОК ТРАНЗАКЦИЙ"']);
        rows.push(['"Дата"', '"Тип"', '"Категория"', '"Описание"', '"Сумма"']);
        
        filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .forEach(t => {
                rows.push([
                    `"${new Date(t.date).toLocaleDateString('ru-RU')}"`,
                    `"${t.type === 'income' ? 'Доход' : 'Расход'}"`,
                    `"${t.category?.replace(/^[^\s]+\s/, '') || '-'}"`,
                    `"${t.description || '-'}"`,
                    t.amount.toFixed(2)
                ]);
            });

        const csvContent = rows.map(row => row.join(';')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `fincontrol_report_${period}_${currentDate.toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <div className="content analytics-page">Загрузка аналитики...</div>;
    }

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
                previousPeriodData={previousPeriodData}
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
                <button className="btn-primary export-btn" onClick={handleExportCSV}>
                    📎 Экспорт отчёта в CSV
                </button>
            </div>
        </div>
    );
};

export default Analytics;