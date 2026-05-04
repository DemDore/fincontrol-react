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

// Функция экспорта в CSV (профессиональный отчёт)
const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }

    const now = new Date();
    const periodLabel = {
        month: `${now.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`,
        quarter: `${Math.floor((now.getMonth() + 3) / 3)} квартал ${now.getFullYear()}`,
        year: `${now.getFullYear()} год`,
        all: 'всё время'
    }[period] || 'выбранный период';

    // 1. РАССЧИТЫВАЕМ СТАТИСТИКУ
    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((s, t) => s + t.amount, 0);
    const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const avgIncome = filteredTransactions.filter(t => t.type === 'income').length || 1;
    const avgExpense = filteredTransactions.filter(t => t.type === 'expense').length || 1;
    const avgIncomeAmount = totalIncome / avgIncome;
    const avgExpenseAmount = totalExpense / avgExpense;
    const maxTransaction = filteredTransactions.reduce((max, t) => t.amount > max.amount ? t : max, { amount: 0, type: '', category: '' });
    const minTransaction = filteredTransactions.reduce((min, t) => t.amount < min.amount ? t : min, { amount: Infinity, type: '', category: '' });

    // 2. ГРУППИРОВКА ПО КАТЕГОРИЯМ
    const incomeByCategory = {};
    const expenseByCategory = {};
    filteredTransactions.forEach(t => {
        const catName = t.category?.replace(/^[^\s]+\s/, '') || 'Другое';
        if (t.type === 'income') {
            incomeByCategory[catName] = (incomeByCategory[catName] || 0) + t.amount;
        } else {
            expenseByCategory[catName] = (expenseByCategory[catName] || 0) + t.amount;
        }
    });

    // 3. ФОРМИРУЕМ СОДЕРЖИМОЕ CSV
    const rows = [];

    // Заголовок отчёта
    rows.push(['"ФИНАНСОВЫЙ ОТЧЁТ"']);
    rows.push([`"Период: ${periodLabel}"`]);
    rows.push([`"Дата формирования: ${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU')}"`]);
    rows.push([]); // пустая строка

    // Сводка
    rows.push(['"СВОДКА"']);
    rows.push(['"Показатель"', '"Сумма"' ]);
    rows.push(['"Всего доходов"', totalIncome.toFixed(2)]);
    rows.push(['"Всего расходов"', totalExpense.toFixed(2)]);
    rows.push(['"Чистый баланс"', balance.toFixed(2)]);
    rows.push(['"Количество транзакций"', filteredTransactions.length]);
    rows.push(['"Средний доход"', avgIncomeAmount.toFixed(2)]);
    rows.push(['"Средний расход"', avgExpenseAmount.toFixed(2)]);
    if (maxTransaction.amount > 0) {
        rows.push(['"Максимальная операция"', `${maxTransaction.amount.toFixed(2)} (${maxTransaction.category?.replace(/^[^\s]+\s/, '') || '-'})`]);
    }
    if (minTransaction.amount < Infinity) {
        rows.push(['"Минимальная операция"', `${minTransaction.amount.toFixed(2)} (${minTransaction.category?.replace(/^[^\s]+\s/, '') || '-'})`]);
    }
    rows.push([]);

    // Доходы по категориям
    rows.push(['"ДОХОДЫ ПО КАТЕГОРИЯМ"']);
    rows.push(['"Категория"', '"Сумма"', '"Доля от всех доходов"']);
    const totalIncomeAmount = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
    Object.entries(incomeByCategory)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, sum]) => {
            const percent = totalIncomeAmount > 0 ? ((sum / totalIncomeAmount) * 100).toFixed(1) : 0;
            rows.push([`"${cat}"`, sum.toFixed(2), `"${percent}%"`]);
        });
    if (Object.keys(incomeByCategory).length === 0) {
        rows.push(['"Нет данных"', '0', '0%']);
    }
    rows.push([]);

    // Расходы по категориям
    rows.push(['"РАСХОДЫ ПО КАТЕГОРИЯМ"']);
    rows.push(['"Категория"', '"Сумма"', '"Доля от всех расходов"']);
    const totalExpenseAmount = Object.values(expenseByCategory).reduce((a, b) => a + b, 0);
    Object.entries(expenseByCategory)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, sum]) => {
            const percent = totalExpenseAmount > 0 ? ((sum / totalExpenseAmount) * 100).toFixed(1) : 0;
            rows.push([`"${cat}"`, sum.toFixed(2), `"${percent}%"`]);
        });
    if (Object.keys(expenseByCategory).length === 0) {
        rows.push(['"Нет данных"', '0', '0%']);
    }
    rows.push([]);

    // Детальный список транзакций
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

    // Подвал отчёта
    rows.push([]);
    rows.push(['"Отчёт сгенерирован автоматически в FinControl"']);
    rows.push(['"Данные носят информационный характер."']);

    // Преобразуем в CSV
    const csvContent = rows.map(row => row.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `fincontrol_report_${period}_${now.toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
                <button className="btn-primary export-btn" onClick={handleExportCSV}>
                    📎 Экспорт отчёта в CSV
                </button>
            </div>
        </div>
    );
};

export default Analytics;