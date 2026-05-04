import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { icon: '➕', label: 'Добавить доход', path: '/transactions', type: 'income', color: '#116466' },
        { icon: '➖', label: 'Добавить расход', path: '/transactions', type: 'expense', color: '#e85d5d' },
        { icon: '🏷️', label: 'Новая категория', path: '/categories', color: '#FFCB9A' },
        { icon: '📊', label: 'Полный отчёт', path: '/analytics', color: '#D9B08C' },
        { icon: '🎯', label: 'Бюджеты', path: '/budgets', color: '#148a8c' },
        { icon: '📝', label: 'Новая заметка', path: '/notes', color: '#6B7A6F' },
    ];

    const handleAction = (action) => {
        if (action.type) {
            // Для добавления транзакции с предустановленным типом
            localStorage.setItem('quick_action_type', action.type);
        }
        navigate(action.path);
    };

    return (
        <div className="quick-actions">
            <div className="quick-actions-header">
                <span className="header-icon">⚡</span>
                <h4>Быстрые действия</h4>
            </div>
            <div className="quick-actions-grid">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className="quick-action-btn"
                        onClick={() => handleAction(action)}
                        style={{ '--action-color': action.color }}
                    >
                        <span className="action-icon">{action.icon}</span>
                        <span className="action-label">{action.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;