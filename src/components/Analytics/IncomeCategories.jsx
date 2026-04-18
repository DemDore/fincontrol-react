import { useCurrency } from '../../hooks/useCurrency';

const IncomeCategories = ({ incomes }) => {
    const { formatCurrency } = useCurrency();
    const total = incomes.reduce((sum, i) => sum + i.amount, 0);

    return (
        <div className="income-categories">
            <h3>📈 Доходы по категориям</h3>
            <div className="categories-list">
                {incomes.map((income, index) => {
                    const percent = total > 0 ? (income.amount / total) * 100 : 0;
                    return (
                        <div key={index} className="category-row">
                            <div className="category-info">
                                <span className="category-name">{income.name}</span>
                                <span className="category-amount">{formatCurrency(income.amount)}</span>
                                <span className="category-percent">{percent.toFixed(1)}%</span>
                            </div>
                            <div className="category-bar">
                                <div 
                                    className="category-bar-fill income"
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IncomeCategories;