import { NavLink } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useState, useEffect } from 'react';

const Sidebar = () => {
    const { profile } = useProfile();
    const [forceUpdate, setForceUpdate] = useState(0);
    
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

    useEffect(() => {
        const handleProfileUpdate = () => {
            setForceUpdate(Date.now());
        };
        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
    }, []);

    if (!profile) {
        return (
            <aside className="sidebar">
                <div className="logo">
                    <span className="logo-icon">💰</span>
                    <span className="logo-text">FinControl</span>
                </div>
                <div className="user-section">
                    <div className="user-info">Загрузка...</div>
                </div>
            </aside>
        );
    }

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
                    <div className="user-avatar">{profile.avatar}</div>
                    <div className="user-details">
                        <div className="user-name">{profile.name}</div>
                        <div className="user-email">{profile.email}</div>
                    </div>
                    <button 
                        className="logout-btn" 
                        title="Выйти"
                        onClick={() => {
                            if (confirm('Вы уверены, что хотите выйти?')) {
                                // В демо-режиме просто показываем сообщение
                                alert('Демо-режим: выход не требует авторизации');
                                // При желании можно очистить данные сессии
                                // localStorage.clear();
                                // window.location.reload();
                            }
                        }}
                    >
                        🚪
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;