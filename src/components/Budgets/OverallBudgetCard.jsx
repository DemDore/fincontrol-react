import { useState } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import BudgetProgressBar from './BudgetProgressBar';

const OverallBudgetCard = ({ stats, onEdit }) => {
    const { formatCurrency } = useCurrency();
    const [showEditModal, setShowEditModal] = useState(false);
    const [newBudget, setNewBudget] = useState(stats.totalBudget);

    const handleSave = () => {
        if (newBudget > 0) {
            onEdit(newBudget);
            setShowEditModal(false);
        }
    };

    const daysLeft = 30 - new Date().getDate();

    return (
        <>
            <div className="overall-budget-card">
                <div className="overall-budget-header">
                    <div className="overall-budget-title">
                        <span className="title-icon">📊</span>
                        <h2>Общий прогресс бюджета</h2>
                    </div>
                    <button className="edit-budget-btn" onClick={() => setShowEditModal(true)}>
                        ✏️ Редактировать
                    </button>
                </div>
                
                <div className="overall-budget-stats">
                    <div className="stats-row">
                        <span className="stats-label">Потрачено:</span>
                        <span className={`stats-value ${stats.isOverBudget ? 'danger' : ''}`}>
                            {formatCurrency(stats.totalSpent)}
                        </span>
                        <span className="stats-divider">из</span>
                        <span className="stats-value">{formatCurrency(stats.totalBudget)}</span>
                        <span className="stats-percent">({stats.percent.toFixed(1)}%)</span>
                    </div>
                </div>
                
                <BudgetProgressBar 
                    percent={stats.percent} 
                    isOverBudget={stats.isOverBudget}
                    height="12px"
                />
                
                <div className="overall-budget-footer">
                    <div className="footer-item">
                        <span className="footer-label">Осталось:</span>
                        <span className={`footer-value ${stats.remaining < 0 ? 'danger' : 'success'}`}>
                            {formatCurrency(Math.abs(stats.remaining))}
                            {stats.remaining < 0 && ' (перерасход)'}
                        </span>
                    </div>
                    <div className="footer-item">
                        <span className="footer-label">До конца месяца:</span>
                        <span className="footer-value">{daysLeft} дней</span>
                    </div>
                    <div className="footer-item">
                        <span className="footer-label">Дневной лимит:</span>
                        <span className="footer-value">{formatCurrency(Math.round(stats.dailyLimit))}</span>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <div className="modal active" onClick={() => setShowEditModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Редактировать общий бюджет</h2>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <div className="form-group">
                            <label>Общий бюджет на месяц</label>
                            <input 
                                type="number"
                                value={newBudget}
                                onChange={(e) => setNewBudget(Number(e.target.value))}
                                placeholder="Введите сумму"
                            />
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Отмена</button>
                            <button className="btn-primary" onClick={handleSave}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OverallBudgetCard;