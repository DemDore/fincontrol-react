import { useState, useEffect } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

const Header = () => {
    const { profile } = useProfile();
    const { unreadCount, toggleDropdown, isOpen, requestPermission } = useNotifications();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const options = { year: 'numeric', month: 'long' };
        const date = new Date().toLocaleDateString('ru-RU', options);
        setCurrentDate(date.charAt(0).toUpperCase() + date.slice(1));
        
        // Запрашиваем разрешение на уведомления при загрузке
        requestPermission();
    }, []);

    return (
        <>
            <header className="header">
                <div className="header-left">
                    <div className="greeting">
                        <span className="greeting-text">Здравствуйте,</span>
                        <span className="greeting-name">{profile.name}</span>
                    </div>
                </div>
                
                <div className="header-right">
                    <div className="date-badge">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{currentDate}</span>
                    </div>
                    
                    <button className="btn-icon notification-btn" onClick={toggleDropdown}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        {unreadCount > 0 && (
                            <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                        )}
                        
                    </button>
                    
                    <div className="avatar">{profile.avatar}</div>
                </div>
            </header>
            
            <NotificationDropdown />
        </>
    );
};

export default Header;