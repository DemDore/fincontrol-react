import { formatNumber } from '../../utils/formatters';

const BudgetAlerts = ({ budgets, onEdit, onDelete, onDismiss }) => {
    const overBudgetItems = budgets.filter(b => b.spent > b.budget);
    
    if (overBudgetItems.length === 0) return null;

    return (
        <div className="budget-alerts">
            <div className="alerts-header">
                <span className="alerts-icon">⚠️</span>
                <h3>Превышение бюджета</h3>
            </div>
            <div className="alerts-list">
                {overBudgetItems.map(budget => {
                    const overspent = budget.spent - budget.budget;
                    const percent = (budget.spent / budget.budget) * 100;
                    return (
                        <div key={budget.id} className="alert-item">
                            <div className="alert-icon">{budget.category.split(' ')[0]}</div>
                            <div className="alert-content">
                                <div className="alert-title">{budget.category}</div>
                                <div className="alert-message">
                                    Превышен на <strong>{formatNumber(overspent)} ₽</strong> ({percent.toFixed(0)}%)
                                </div>
                            </div>
                            <div className="alert-actions">
                                <button className="edit-btn" onClick={() => onEdit(budget)} title="Редактировать">
                                    ✏️
                                </button>
                                <button className="delete-btn" onClick={() => onDelete(budget.id)} title="Удалить">
                                    🗑️
                                </button>
                                <button className="dismiss-btn" onClick={() => onDismiss(budget.id)} title="Скрыть">
                                    ✕
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BudgetAlerts;