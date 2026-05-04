import { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';
import { goalsAPI } from '../../services/api';

const FinancialGoals = ({ transactions }) => {
    const { formatCurrency } = useCurrency();
    const [goals, setGoals] = useState([]);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [contributeAmount, setContributeAmount] = useState('');
    const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            setLoading(true);
            const saved = await goalsAPI.getAll();
            setGoals(saved);
        } catch (error) {
            console.error('Ошибка загрузки целей:', error);
            setGoals([]);
        } finally {
            setLoading(false);
        }
    };

    const saveGoals = async (newGoals) => {
        // Эта функция больше не нужна, используем API напрямую
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const totalInGoals = goals.reduce((sum, goal) => sum + goal.saved, 0);
    const freeMoney = balance - totalInGoals;

    const addGoal = async () => {
        if (!newGoal.name || !newGoal.target || !newGoal.deadline) return;
        try {
            await goalsAPI.create({ 
                ...newGoal, 
                target: parseFloat(newGoal.target),
                saved: 0 
            });
            await loadGoals();
            setNewGoal({ name: '', target: '', deadline: '' });
            setShowAddGoal(false);
        } catch (error) {
            console.error('Ошибка добавления цели:', error);
            alert('Ошибка при создании цели');
        }
    };

    const contributeToGoal = async () => {
        if (!contributeAmount || contributeAmount <= 0) return;
        const amount = parseFloat(contributeAmount);
        
        if (amount > freeMoney) {
            alert(`Недостаточно свободных средств! Доступно: ${formatCurrency(freeMoney)}`);
            return;
        }
        
        try {
            const newSaved = Math.min(selectedGoal.saved + amount, selectedGoal.target);
            await goalsAPI.update(selectedGoal.id, { saved: newSaved });
            await loadGoals();
            setShowContributeModal(false);
            setContributeAmount('');
            setSelectedGoal(null);
            alert(`✅ ${formatCurrency(amount)} добавлено в цель "${selectedGoal.name}"`);
        } catch (error) {
            console.error('Ошибка пополнения цели:', error);
            alert('Ошибка при пополнении цели');
        }
    };

    const deleteGoal = async (id) => {
        if (confirm('Удалить эту цель?')) {
            try {
                await goalsAPI.delete(id);
                await loadGoals();
            } catch (error) {
                console.error('Ошибка удаления цели:', error);
                alert('Ошибка при удалении цели');
            }
        }
    };

    const openContributeModal = (goal) => {
        setSelectedGoal(goal);
        setContributeAmount('');
        setShowContributeModal(true);
    };

    if (loading) {
        return (
            <div className="financial-goals">
                <div className="section-header">
                    <h2>🎯 Финансовые цели</h2>
                </div>
                <div className="empty-goals">Загрузка целей...</div>
            </div>
        );
    }

    return (
        <div className="financial-goals">
            <div className="section-header">
                <h2>🎯 Финансовые цели</h2>
                <button className="btn-outline add-goal-btn" onClick={() => setShowAddGoal(true)}>
                    + Добавить цель
                </button>
            </div>

            <div className="balances-info">
                <div className="balance-item">
                    <span className="balance-label">💰 Баланс:</span>
                    <span className="balance-value">{formatCurrency(balance)}</span>
                </div>
                <div className="balance-item">
                    <span className="balance-label">🏦 В целях:</span>
                    <span className="balance-value">{formatCurrency(totalInGoals)}</span>
                </div>
                <div className="balance-item free">
                    <span className="balance-label">💸 Свободно:</span>
                    <span className="balance-value">{formatCurrency(freeMoney)}</span>
                </div>
            </div>
            
            {goals.length === 0 ? (
                <div className="empty-goals">
                    <p>Нет активных целей</p>
                    <p className="empty-hint">Добавьте цель, например "Накопить на машину"</p>
                </div>
            ) : (
                goals.map(goal => {
                    const percent = Math.min((goal.saved / goal.target) * 100, 100);
                    const monthsLeft = Math.max(1, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30)));
                    const neededPerMonth = (goal.target - goal.saved) / monthsLeft;
                    const isCompleted = goal.saved >= goal.target;
                    
                    return (
                        <div key={goal.id} className={`goal-card ${isCompleted ? 'completed' : ''}`}>
                            <div className="goal-header">
                                <span className="goal-name">
                                    {isCompleted && '🎉 '}{goal.name}
                                </span>
                                <button className="goal-delete" onClick={() => deleteGoal(goal.id)}>🗑️</button>
                            </div>
                            <div className="goal-progress">
                                <div className="goal-bar" style={{ width: `${percent}%` }}></div>
                            </div>
                            <div className="goal-stats">
                                <span>{formatCurrency(goal.saved)} из {formatCurrency(goal.target)}</span>
                                <span>{percent.toFixed(0)}%</span>
                            </div>
                            <div className="goal-deadline">
                                📅 До {new Date(goal.deadline).toLocaleDateString('ru-RU')} · 
                                Нужно откладывать ≈{formatCurrency(neededPerMonth)}/мес
                            </div>
                            {!isCompleted && (
                                <button 
                                    className="btn-primary contribute-btn"
                                    onClick={() => openContributeModal(goal)}
                                    disabled={freeMoney <= 0}
                                >
                                    💰 Пополнить цель
                                </button>
                            )}
                            {isCompleted && (
                                <div className="goal-completed-badge">
                                    🎉 Цель достигнута! Поздравляем!
                                </div>
                            )}
                        </div>
                    );
                })
            )}

            {/* Модальное окно добавления цели */}
            {showAddGoal && (
                <div className="modal active" onClick={() => setShowAddGoal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Новая цель</h2>
                            <button className="modal-close" onClick={() => setShowAddGoal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Название цели</label>
                                <input type="text" placeholder="Например: Накопить на машину" 
                                    value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Целевая сумма</label>
                                <input type="number" placeholder="500000" 
                                    value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
                            </div>
                            <div className="form-group">
                                <label>Дата достижения</label>
                                <input type="date" 
                                    value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => setShowAddGoal(false)}>Отмена</button>
                            <button className="btn-primary" onClick={addGoal}>Создать цель</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно пополнения цели */}
            {showContributeModal && selectedGoal && (
                <div className="modal active" onClick={() => setShowContributeModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>💰 Пополнение цели</h2>
                            <button className="modal-close" onClick={() => setShowContributeModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p><strong>{selectedGoal.name}</strong></p>
                            <p>Накоплено: {formatCurrency(selectedGoal.saved)} из {formatCurrency(selectedGoal.target)}</p>
                            <p>Свободно доступно: <strong>{formatCurrency(freeMoney)}</strong></p>
                            <div className="form-group">
                                <label>Сумма пополнения</label>
                                <input 
                                    type="number" 
                                    placeholder="Введите сумму"
                                    value={contributeAmount}
                                    onChange={e => setContributeAmount(e.target.value)}
                                    max={freeMoney}
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn-secondary" onClick={() => setShowContributeModal(false)}>Отмена</button>
                            <button className="btn-primary" onClick={contributeToGoal}>Пополнить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinancialGoals;