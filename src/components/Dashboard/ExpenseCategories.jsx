import { formatNumber } from '../../utils/formatters';
import { categoryColors } from '../../data/mockData';

const ExpenseCategories = ({ transactions }) => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals = expenses.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});
    
    const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
    
    const categories = Object.entries(categoryTotals)
        .map(([name, amount]) => ({
            name,
            amount,
            percent: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
            color: categoryColors[name] || '#116466'
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    const monthNames = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
    const currentMonth = monthNames[new Date().getMonth()];

    return (
        <div className="expense-categories">
            <div className="section-header">
                <h2>Расходы по категориям</h2>
                <span className="month-label">{currentMonth} {new Date().getFullYear()}</span>
            </div>
            <div className="categories-list">
                {categories.map(cat => (
                    <div key={cat.name}>
                        <div className="category-item">
                            <div className="category-color" style={{ background: cat.color }}></div>
                            <div className="category-name">{cat.name}</div>
                            <div className="category-amount">{formatNumber(cat.amount)} ₽</div>
                            <div className="category-percent">{cat.percent}%</div>
                        </div>
                        <div className="category-bar">
                            <div 
                                className="category-bar-fill" 
                                style={{ width: `${cat.percent}%`, background: cat.color }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExpenseCategories;