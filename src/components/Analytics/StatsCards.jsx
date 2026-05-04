import { useCurrency } from '../../hooks/useCurrency';

const StatsCards = ({ income, expense, transactionCount, previousPeriodData = {} }) => {
    const { formatCurrency } = useCurrency();
    const savings = income - expense;
    const savingsPercent = income > 0 ? (savings / income) * 100 : 0;
    
    // Расчёт изменений по сравнению с прошлым периодом
    const incomeChange = previousPeriodData.income ? ((income - previousPeriodData.income) / previousPeriodData.income) * 100 : 0;
    const expenseChange = previousPeriodData.expense ? ((expense - previousPeriodData.expense) / previousPeriodData.expense) * 100 : 0;
    const savingsChange = previousPeriodData.savings ? ((savings - previousPeriodData.savings) / previousPeriodData.savings) * 100 : 0;

    const cards = [
        {
            title: 'Доходы',
            value: income,
            icon: '📈',
            color: 'income',
            change: incomeChange,
            changePositive: incomeChange >= 0
        },
        {
            title: 'Расходы',
            value: expense,
            icon: '💸',
            color: 'expense',
            change: expenseChange,
            changePositive: expenseChange <= 0
        },
        {
            title: 'Сбережения',
            value: savings,
            icon: '💰',
            color: 'savings',
            change: savingsPercent,
            changePositive: savingsPercent >= 0
        },
        {
            title: 'Транзакций',
            value: transactionCount,
            icon: '📊',
            color: 'transactions',
            change: previousPeriodData.count ? ((transactionCount - previousPeriodData.count) / previousPeriodData.count) * 100 : 0,
            changePositive: true,
            isCount: true
        }
    ];

    return (
        <div className="analytics-stats-grid">
            {cards.map((card, index) => (
                <div key={index} className={`analytics-stat-card ${card.color}`}>
                    <div className="stat-card-header">
                        <span className="stat-icon">{card.icon}</span>
                        <span className="stat-title">{card.title}</span>
                    </div>
                    <div className="stat-value">
                        {card.isCount ? card.value : formatCurrency(card.value)}
                    </div>
                    <div className={`stat-change ${card.changePositive ? 'positive' : 'negative'}`}>
                        {card.change > 0 ? '▲' : card.change < 0 ? '▼' : '•'} {Math.abs(card.change).toFixed(1)}% vs прошлый месяц
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;