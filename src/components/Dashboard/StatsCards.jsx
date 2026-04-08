import { formatNumber } from '../../utils/formatters';

const StatsCards = ({ transactions }) => {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;

    const cards = [
        { label: 'Баланс', value: balance, icon: '💰', color: 'blue', change: '+5.2%', positive: true },
        { label: 'Доходы', value: totalIncome, icon: '📈', color: 'green', change: '+8%', positive: true },
        { label: 'Расходы', value: totalExpense, icon: '📉', color: 'orange', change: '-2%', positive: false },
        { label: 'Свободно', value: balance, icon: '✨', color: 'purple', change: '+12%', positive: true },
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, index) => (
                <div key={index} className="stat-card">
                    <div className={`stat-icon ${card.color}`}>
                        <span>{card.icon}</span>
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">{card.label}</span>
                        <span className="stat-value">{formatNumber(card.value)} ₽</span>
                        <span className={`stat-change ${card.positive ? 'positive' : 'negative'}`}>
                            {card.change}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;