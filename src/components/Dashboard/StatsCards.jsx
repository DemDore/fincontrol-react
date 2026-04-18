import { useCurrency } from '../../hooks/useCurrency';

const StatsCards = ({ transactions }) => {
    const { formatCurrency } = useCurrency();
    
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    const cards = [
        { label: 'Баланс', value: balance, icon: '💰', color: 'blue' },
        { label: 'Доходы', value: totalIncome, icon: '📈', color: 'green' },
        { label: 'Расходы', value: totalExpense, icon: '📉', color: 'orange' },
        { label: 'Норма сбережений', value: savingsRate, icon: '✨', color: 'purple', suffix: '%', isPercent: true },
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
                        <span className="stat-value">
                            {card.isPercent 
                                ? card.value.toFixed(1) + '%'
                                : formatCurrency(card.value)}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;