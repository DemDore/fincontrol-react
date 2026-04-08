const SettingsTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'profile', icon: '👤', label: 'Профиль' },
        { id: 'currency', icon: '💰', label: 'Валюта' },
        { id: 'notifications', icon: '🔔', label: 'Уведомления' },
        { id: 'data', icon: '💾', label: 'Данные' },
        { id: 'appearance', icon: '🎨', label: 'Внешний вид' }
    ];

    return (
        <div className="settings-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => onTabChange(tab.id)}
                >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default SettingsTabs;