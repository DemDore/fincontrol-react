import { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const FinancialGoals = ({ transactions }) => {
    const { formatCurrency } = useCurrency();
    const [goals, setGoals] = useState([]);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [contributeAmount, setContributeAmount] = useState('');
    const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });

    // Загрузка целей
    useEffect(() => {
        const saved = localStorage.getItem('fincontrol_goals');
        if (saved) setGoals(JSON.parse(saved));
    }, []);

    // Сохранение целей
    const saveGoals = (newGoals) => {
        setGoals(newGoals);
        localStorage.setItem('fincontrol_goals', JSON.stringify(newGoals));
    };

    // Расчёт баланса и денег в целях
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const totalInGoals = goals.reduce((sum, goal) => sum + goal.saved, 0);
    const freeMoney = balance - totalInGoals;

    // Добавление цели
    const addGoal = () => {
        if (!newGoal.name || !newGoal.target || !newGoal.deadline) return;
        saveGoals([...goals, { 
            id: Date.now(), 
            ...newGoal, 
            target: parseFloat(newGoal.target),
            saved: 0 
        }]);
        setNewGoal({ name: '', target: '', deadline: '' });
        setShowAddGoal(false);
    };

    // Пополнение цели
    const contributeToGoal = () => {
        if (!contributeAmount || contributeAmount <= 0) return;
        const amount = parseFloat(contributeAmount);
        
        if (amount > freeMoney) {
            alert(`Недостаточно свободных средств! Доступно: ${formatCurrency(freeMoney)}`);
            return;
        }
        
        const updatedGoals = goals.map(goal => {
            if (goal.id === selectedGoal.id) {
                const newSaved = Math.min(goal.saved + amount, goal.target);
                return { ...goal, saved: newSaved };
            }
            return goal;
        });
        
        saveGoals(updatedGoals);
        setShowContributeModal(false);
        setContributeAmount('');
        setSelectedGoal(null);
        
        alert(`✅ ${formatCurrency(amount)} добавлено в цель "${selectedGoal.name}"`);
    };

    // Удаление цели
    const deleteGoal = (id) => {
        if (confirm('Удалить эту цель?')) {
            saveGoals(goals.filter(g => g.id !== id));
        }
    };

    // Открыть модалку пополнения
    const openContributeModal = (goal) => {
        setSelectedGoal(goal);
        setContributeAmount('');
        setShowContributeModal(true);
    };

    return (
        <div className="financial-goals">
            <div className="section-header">
                <h2>🎯 Финансовые цели</h2>
                <button className="btn-outline add-goal-btn" onClick={() => setShowAddGoal(true)}>
                    + Добавить цель
                </button>
            </div>

            {/* Блок с балансами */}
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