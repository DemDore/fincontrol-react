import { formatNumber } from '../../utils/formatters';

const ComparisonCards = ({ comparison }) => {
    const cards = [
        {
            title: 'Доходы',
            icon: '📈',
            current: comparison.income.current,
            previous: comparison.income.previous,
            change: comparison.income.change,
            diff: comparison.income.diff,
            type: 'income'
        },
        {
            title: 'Расходы',
            icon: '📉',
            current: comparison.expense.current,
            previous: comparison.expense.previous,
            change: comparison.expense.change,
            diff: comparison.expense.diff,
            type: 'expense'
        },
        {
            title: 'Сбережения',
            icon: '💰',
            current: comparison.savings.current,
            previous: comparison.savings.previous,
            change: comparison.savings.change,
            diff: comparison.savings.diff,
            type: 'savings'
        }
    ];

    return (
        <div className="comparison-cards">
            <h3>📊 Сравнение с прошлым периодом</h3>
            <div className="comparison-grid">
                {cards.map((card, index) => {
                    const isPositive = card.type === 'income' ? card.diff >= 0 : card.type === 'expense' ? card.diff <= 0 : card.diff >= 0;
                    return (
                        <div key={index} className="comparison-card">
                            <div className="comparison-header">
                                <span className="comparison-icon">{card.icon}</span>
                                <span className="comparison-title">{card.title}</span>
                            </div>
                            <div className="comparison-current">{formatNumber(card.current)} ₽</div>
                            <div className={`comparison-change ${isPositive ? 'positive' : 'negative'}`}>
                                {card.diff >= 0 ? '▲' : '▼'} {Math.abs(card.change).toFixed(1)}%
                            </div>
                            <div className="comparison-previous">
                                vs {formatNumber(card.previous)} ₽
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ComparisonCards;