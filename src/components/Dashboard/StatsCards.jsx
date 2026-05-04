import { useCurrency } from '../../hooks/useCurrency';
import balanceIcon from '../../assets/business_16626761.png';
import incomeIcon from '../../assets/coins_15904486.png';
import expenseIcon from '../../assets/money-value-decrease_17072428.png';
import savingsIcon from '../../assets/free-icon-piggy-bank-584093.png';

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
        { label: 'Баланс', value: balance, icon: incomeIcon, color: 'blue' },
        { label: 'Доходы', value: totalIncome, icon: balanceIcon, color: 'green' },
        { label: 'Расходы', value: totalExpense, icon: expenseIcon, color: 'orange' },
        { label: 'Норма сбережений', value: savingsRate, icon: savingsIcon, color: 'purple', suffix: '%', isPercent: true },
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, index) => (
                <div key={index} className="stat-card">
                    {/* ВОТ ЗДЕСЬ МЕНЯЕМ: span на img */}
                    <div className={`stat-icon ${card.color}`}>
                        <img 
                            src={card.icon} 
                            alt={card.label} 
                            className="stat-icon-img" 
                        />
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