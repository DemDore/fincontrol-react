import { formatNumber } from '../../utils/formatters';

const StatsCards = ({ income, expense, transactionCount }) => {
    const savings = income - expense;
    const savingsPercent = income > 0 ? (savings / income) * 100 : 0;

    const cards = [
        {
            title: 'Доходы',
            value: income,
            icon: '📈',
            color: 'income',
            change: '+8%',
            changePositive: true
        },
        {
            title: 'Расходы',
            value: expense,
            icon: '💸',
            color: 'expense',
            change: '-2%',
            changePositive: false
        },
        {
            title: 'Сбережения',
            value: savings,
            icon: '💰',
            color: 'savings',
            change: `+${savingsPercent.toFixed(1)}%`,
            changePositive: true
        },
        {
            title: 'Транзакций',
            value: transactionCount,
            icon: '📊',
            color: 'transactions',
            change: '+15%',
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
                        {card.isCount ? card.value : formatNumber(card.value)} ₽
                    </div>
                    <div className={`stat-change ${card.changePositive ? 'positive' : 'negative'}`}>
                        {card.change} vs прошлый месяц
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;