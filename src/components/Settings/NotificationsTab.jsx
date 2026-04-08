import { useState } from 'react';
import { getNotificationSettings, saveNotificationSettings } from '../../utils/settingsUtils';

const NotificationsTab = () => {
    const [settings, setSettings] = useState(getNotificationSettings());

    const handleSave = () => {
        saveNotificationSettings(settings);
        alert('Настройки уведомлений сохранены!');
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <button 
            className={`toggle-switch ${checked ? 'active' : ''}`}
            onClick={onChange}
        >
            <span className="toggle-knob" />
        </button>
    );

    return (
        <div className="settings-card">
            <h2>🔔 Настройки уведомлений</h2>
            
            <div className="settings-section">
                <div className="setting-row">
                    <div className="setting-info">
                        <label>📧 Email-уведомления</label>
                        <p className="setting-description">Получать уведомления на email</p>
                    </div>
                    <ToggleSwitch 
                        checked={settings.emailEnabled}
                        onChange={() => setSettings({ ...settings, emailEnabled: !settings.emailEnabled })}
                    />
                </div>
                {settings.emailEnabled && (
                    <div className="setting-sub">
                        <input 
                            type="email"
                            value={settings.email}
                            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                            placeholder="Email для уведомлений"
                        />
                    </div>
                )}
            </div>

            <div className="settings-section">
                <div className="setting-row">
                    <div className="setting-info">
                        <label>💰 Бюджетные оповещения</label>
                        <p className="setting-description">Уведомлять при превышении бюджета</p>
                    </div>
                    <ToggleSwitch 
                        checked={settings.budgetOverspend}
                        onChange={() => setSettings({ ...settings, budgetOverspend: !settings.budgetOverspend })}
                    />
                </div>
            </div>

            <div className="settings-section">
                <div className="setting-row">
                    <div className="setting-info">
                        <label>⚠️ Предупреждение о лимите</label>
                        <p className="setting-description">Уведомлять при достижении 80% бюджета</p>
                    </div>
                    <ToggleSwitch 
                        checked={settings.budgetWarning}
                        onChange={() => setSettings({ ...settings, budgetWarning: !settings.budgetWarning })}
                    />
                </div>
            </div>

            <div className="settings-section">
                <div className="setting-row">
                    <div className="setting-info">
                        <label>📊 Еженедельный отчёт</label>
                        <p className="setting-description">Присылать отчёт по воскресеньям</p>
                    </div>
                    <ToggleSwitch 
                        checked={settings.weeklyReport}
                        onChange={() => setSettings({ ...settings, weeklyReport: !settings.weeklyReport })}
                    />
                </div>
            </div>

            <div className="settings-actions">
                <button className="btn-primary" onClick={handleSave}>
                    💾 Сохранить настройки
                </button>
            </div>
        </div>
    );
};

export default NotificationsTab;