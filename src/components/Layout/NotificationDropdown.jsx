import { useNotifications } from '../../context/NotificationContext';

const NotificationDropdown = () => {
    const { 
        notifications, 
        unreadCount, 
        isOpen, 
        closeDropdown,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
    } = useNotifications();

    if (!isOpen) return null;

    const getTypeIcon = (type) => {
        switch(type) {
            case 'warning': return '⚠️';
            case 'danger': return '🔴';
            case 'success': return '✅';
            default: return 'ℹ️';
        }
    };

    const getTypeColor = (type) => {
        switch(type) {
            case 'warning': return '#FFCB9A';
            case 'danger': return '#FF6B6B';
            case 'success': return '#116466';
            default: return '#A8B3B0';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Только что';
        if (diffMins < 60) return `${diffMins} мин назад`;
        if (diffHours < 24) return `${diffHours} ч назад`;
        return `${diffDays} дн назад`;
    };

    return (
        <>
            {/* Затемняющий фон при клике */}
            <div className="notification-overlay" onClick={closeDropdown}></div>
            
            <div className="notification-dropdown">
                <div className="notification-header">
                    <h3>Уведомления</h3>
                    <div className="notification-header-actions">
                        {notifications.length > 0 && (
                            <>
                                <button 
                                    className="notification-action-btn"
                                    onClick={markAllAsRead}
                                    title="Отметить все как прочитанные"
                                >
                                    ✅
                                </button>
                                <button 
                                    className="notification-action-btn"
                                    onClick={clearAll}
                                    title="Очистить все"
                                >
                                    🗑️
                                </button>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="notification-list">
                    {notifications.length === 0 ? (
                        <div className="notification-empty">
                            <span className="empty-icon">🔔</span>
                            <p>Нет уведомлений</p>
                            <span className="empty-hint">Здесь будут появляться важные события</span>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                className={`notification-item ${!notif.read ? 'unread' : ''}`}
                                onClick={() => markAsRead(notif.id)}
                            >
                                <div 
                                    className="notification-icon"
                                    style={{ background: getTypeColor(notif.type) }}
                                >
                                    {getTypeIcon(notif.type)}
                                </div>
                                <div className="notification-content">
                                    <div className="notification-title">{notif.title}</div>
                                    <div className="notification-message">{notif.message}</div>
                                    <div className="notification-time">{formatDate(notif.createdAt)}</div>
                                </div>
                                <button 
                                    className="notification-close"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeNotification(notif.id);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .notification-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 99;
                }
                
                .notification-dropdown {
                    position: absolute;
                    top: 70px;
                    right: 20px;
                    width: 380px;
                    max-height: 500px;
                    background: var(--bg-card);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--border-light);
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--border-light);
                }
                
                .notification-header h3 {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                
                .notification-header-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .notification-action-btn {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 4px 8px;
                    border-radius: var(--radius-sm);
                    transition: all 0.2s;
                }
                
                .notification-action-btn:hover {
                    background: var(--bg-hover);
                }
                
                .notification-list {
                    flex: 1;
                    overflow-y: auto;
                    max-height: 420px;
                }
                
                .notification-empty {
                    text-align: center;
                    padding: 40px 20px;
                    color: var(--text-muted);
                }
                
                .notification-empty .empty-icon {
                    font-size: 48px;
                    display: block;
                    margin-bottom: 12px;
                    opacity: 0.5;
                }
                
                .notification-empty p {
                    margin-bottom: 8px;
                }
                
                .notification-empty .empty-hint {
                    font-size: 12px;
                }
                
                .notification-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 14px 20px;
                    border-bottom: 1px solid var(--border-light);
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .notification-item:hover {
                    background: var(--bg-hover);
                }
                
                .notification-item.unread {
                    background: rgba(17, 100, 102, 0.05);
                }
                
                .notification-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    flex-shrink: 0;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }
                
                .notification-message {
                    font-size: 13px;
                    color: var(--text-secondary);
                    margin-bottom: 4px;
                }
                
                .notification-time {
                    font-size: 11px;
                    color: var(--text-muted);
                }
                
                .notification-close {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 14px;
                    color: var(--text-muted);
                    padding: 4px;
                    border-radius: var(--radius-sm);
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                
                .notification-item:hover .notification-close {
                    opacity: 1;
                }
                
                .notification-close:hover {
                    background: var(--bg-hover);
                    color: var(--danger);
                }
            `}</style>
        </>
    );
};

export default NotificationDropdown;