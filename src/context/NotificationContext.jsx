import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // Загружаем уведомления из localStorage при старте
    useEffect(() => {
        const saved = localStorage.getItem('fincontrol_notifications');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setNotifications(parsed);
                const unread = parsed.filter(n => !n.read).length;
                setUnreadCount(unread);
            } catch (e) {
                console.error('Ошибка загрузки уведомлений', e);
            }
        }
    }, []);

    // Сохраняем уведомления в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('fincontrol_notifications', JSON.stringify(notifications));
        const unread = notifications.filter(n => !n.read).length;
        setUnreadCount(unread);
    }, [notifications]);

    // Добавить новое уведомление
    const addNotification = (title, message, type = 'info') => {
        const newNotification = {
            id: Date.now(),
            title,
            message,
            type, // 'warning', 'danger', 'info', 'success'
            read: false,
            createdAt: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        // Показываем браузерное уведомление (если разрешено)
        if (Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }
    };

    // Отметить как прочитанное
    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
    };

    // Отметить все как прочитанные
    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };

    // Удалить уведомление
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // Очистить все уведомления
    const clearAll = () => {
        setNotifications([]);
    };

    // Запросить разрешение на браузерные уведомления
    const requestPermission = () => {
        if (Notification && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    };

    const toggleDropdown = () => setIsOpen(!isOpen);
    const closeDropdown = () => setIsOpen(false);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isOpen,
            addNotification,
            markAsRead,
            markAllAsRead,
            removeNotification,
            clearAll,
            toggleDropdown,
            closeDropdown,
            requestPermission
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
}