import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', icon: '📊', label: 'Главная' },
        { path: '/transactions', icon: '💸', label: 'Транзакции' },
        { path: '/categories', icon: '🏷️', label: 'Категории' },
        { path: '/analytics', icon: '📈', label: 'Аналитика' },
        { path: '/budgets', icon: '🎯', label: 'Бюджеты' },
        { path: '/loan-calculator', icon: '🏦', label: 'Кредитный калькулятор' },
        { path: '/notes', icon: '📝', label: 'Заметки' },      
        { path: '/settings', icon: '⚙️', label: 'Настройки' },
    ];

    const handleLogout = () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            logout();
        }
    };

    return (
        <aside className="sidebar">
            <div className="logo">
                <span className="logo-icon">💰</span>
                <span className="logo-text">FinControl</span>
            </div>
            
            <nav className="nav-menu">
                {navItems.map(item => (
                    <NavLink 
                        key={item.path} 
                        to={item.path} 
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
            
            <div className="user-section">
                <div className="user-info">
                    <div className="user-avatar">👤</div>
                    <div className="user-details">
                        <div className="user-name">{user?.name || 'Пользователь'}</div>
                        <div className="user-email">{user?.email || ''}</div>
                    </div>
                    <button 
                        className="logout-btn" 
                        title="Выйти"
                        onClick={handleLogout}
                    >
                        🚪
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;