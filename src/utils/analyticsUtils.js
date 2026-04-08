import { getTransactions } from './storage';

// Получить транзакции за период
export function getTransactionsByPeriod(transactions, period) {
    const now = new Date();
    const startDate = new Date();
    
    switch(period) {
        case 'month':
            startDate.setMonth(now.getMonth() - 1);
            break;
        case 'quarter':
            startDate.setMonth(now.getMonth() - 3);
            break;
        case 'year':
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        case 'all':
        default:
            return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= startDate);
}

// НОВАЯ ФУНКЦИЯ: Группировка транзакций по дням для выбранного месяца
export function groupByDay(transactions, year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            day: i,
            date: `${i}.${month + 1}`,
            income: 0,
            expense: 0
        });
    }
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() === year && date.getMonth() === month) {
            const dayIndex = date.getDate() - 1;
            if (dayIndex >= 0 && dayIndex < days.length) {
                if (t.type === 'income') {
                    days[dayIndex].income += t.amount;
                } else {
                    days[dayIndex].expense += t.amount;
                }
            }
        }
    });
    
    return days;
}

// НОВАЯ ФУНКЦИЯ: Группировка транзакций по неделям для выбранного квартала
export function groupByWeek(transactions, year, quarter) {
    const weeks = [];
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    
    // Создаём массив недель (упрощённо — по месяцам)
    for (let month = startMonth; month <= endMonth; month++) {
        const monthName = new Date(year, month, 1).toLocaleDateString('ru-RU', { month: 'short' });
        weeks.push({
            name: monthName,
            income: 0,
            expense: 0
        });
    }
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() === year) {
            const month = date.getMonth();
            if (month >= startMonth && month <= endMonth) {
                const weekIndex = month - startMonth;
                if (t.type === 'income') {
                    weeks[weekIndex].income += t.amount;
                } else {
                    weeks[weekIndex].expense += t.amount;
                }
            }
        }
    });
    
    return weeks;
}

// НОВАЯ ФУНКЦИЯ: Группировка транзакций по месяцам для выбранного года
export function groupByMonthForYear(transactions, year) {
    const months = [];
    
    for (let i = 0; i < 12; i++) {
        const monthName = new Date(year, i, 1).toLocaleDateString('ru-RU', { month: 'short' });
        months.push({
            name: monthName,
            month: i,
            income: 0,
            expense: 0
        });
    }
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() === year) {
            const monthIndex = date.getMonth();
            if (t.type === 'income') {
                months[monthIndex].income += t.amount;
            } else {
                months[monthIndex].expense += t.amount;
            }
        }
    });
    
    return months;
}

// ОБНОВЛЁННАЯ ФУНКЦИЯ: Группировка транзакций по месяцам (для all period)
export function groupByMonth(transactions, monthsCount = 12) {
    const months = [];
    const now = new Date();
    
    for (let i = monthsCount - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
        months.push({
            name: monthName,
            year: date.getFullYear(),
            month: date.getMonth(),
            income: 0,
            expense: 0
        });
    }
    
    transactions.forEach(t => {
        const date = new Date(t.date);
        const monthIndex = months.findIndex(m => m.year === date.getFullYear() && m.month === date.getMonth());
        if (monthIndex !== -1) {
            if (t.type === 'income') {
                months[monthIndex].income += t.amount;
            } else {
                months[monthIndex].expense += t.amount;
            }
        }
    });
    
    return months;
}

// Группировка расходов по категориям
export function groupExpensesByCategory(transactions) {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categories = {};
    
    expenses.forEach(t => {
        if (!categories[t.category]) {
            categories[t.category] = 0;
        }
        categories[t.category] += t.amount;
    });
    
    return Object.entries(categories)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
}

// Группировка доходов по категориям
export function groupIncomeByCategory(transactions) {
    const incomes = transactions.filter(t => t.type === 'income');
    const categories = {};
    
    incomes.forEach(t => {
        if (!categories[t.category]) {
            categories[t.category] = 0;
        }
        categories[t.category] += t.amount;
    });
    
    return Object.entries(categories)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
}

// Подсчёт частоты транзакций по категориям
export function getTransactionFrequency(transactions) {
    const frequency = {};
    
    transactions.forEach(t => {
        if (!frequency[t.category]) {
            frequency[t.category] = 0;
        }
        frequency[t.category]++;
    });
    
    return Object.entries(frequency)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
}

// Расчёт изменений по сравнению с прошлым периодом
export function calculateComparison(transactions, currentPeriod, previousPeriod) {
    const currentIncome = currentPeriod.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const currentExpense = currentPeriod.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const currentSavings = currentIncome - currentExpense;
    
    const previousIncome = previousPeriod.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const previousExpense = previousPeriod.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const previousSavings = previousIncome - previousExpense;
    
    return {
        income: {
            current: currentIncome,
            previous: previousIncome,
            change: previousIncome ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0,
            diff: currentIncome - previousIncome
        },
        expense: {
            current: currentExpense,
            previous: previousExpense,
            change: previousExpense ? ((currentExpense - previousExpense) / previousExpense) * 100 : 0,
            diff: currentExpense - previousExpense
        },
        savings: {
            current: currentSavings,
            previous: previousSavings,
            change: previousSavings ? ((currentSavings - previousSavings) / previousSavings) * 100 : 0,
            diff: currentSavings - previousSavings
        }
    };
}

// Форматирование чисел для отображения
export function formatNumberShort(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return num.toString();
}