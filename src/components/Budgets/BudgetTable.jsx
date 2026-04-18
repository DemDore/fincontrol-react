import { useCurrency } from '../../hooks/useCurrency';
import BudgetProgressBar from './BudgetProgressBar';

const BudgetTable = ({ budgets, onEdit, onDelete }) => {
    const { formatCurrency } = useCurrency();

    if (budgets.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">💰</div>
                <h3>Нет бюджетов</h3>
                <p>Добавьте первый бюджет, чтобы начать отслеживание расходов</p>
            </div>
        );
    }

    return (
        <div className="budget-table-container">
            <table className="budget-table">
                <thead>
                    <tr>
                        <th>Категория</th>
                        <th>Бюджет</th>
                        <th>Потрачено</th>
                        <th>Осталось</th>
                        <th>Прогресс</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.map(budget => {
                        const remaining = budget.budget - budget.spent;
                        const percent = budget.budget > 0 ? (budget.spent / budget.budget) * 100 : 0;
                        const isOverBudget = remaining < 0;
                        
                        return (
                            <tr key={budget.id} className={isOverBudget ? 'over-budget' : ''}>
                                <td className="category-cell">
                                    <span className="category-icon">{budget.category.split(' ')[0]}</span>
                                    <span className="category-name">{budget.category}</span>
                                </td>
                                <td className="budget-cell">{formatCurrency(budget.budget)}</td>
                                <td className={`spent-cell ${isOverBudget ? 'danger' : ''}`}>
                                    {formatCurrency(budget.spent)}
                                    {isOverBudget && <span className="warning-icon">⚠️</span>}
                                </td>
                                <td className={`remaining-cell ${isOverBudget ? 'danger' : 'success'}`}>
                                    {isOverBudget ? '-' : ''}{formatCurrency(Math.abs(remaining))}
                                </td>
                                <td className="progress-cell">
                                    <div className="progress-wrapper">
                                        <BudgetProgressBar percent={percent} isOverBudget={isOverBudget} height="8px" />
                                        <span className="progress-percent">{percent.toFixed(0)}%</span>
                                    </div>
                                </td>
                                <td className="actions-cell">
                                    <div className="action-buttons">
                                        <button className="btn-icon edit" onClick={() => onEdit(budget)} title="Редактировать">
                                            ✏️
                                        </button>
                                        <button className="btn-icon delete" onClick={() => onDelete(budget.id)} title="Удалить">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default BudgetTable;