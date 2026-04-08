import { useState } from 'react';
import { getAppearanceSettings, saveAppearanceSettings, availableAccents } from '../../utils/settingsUtils';

const AppearanceTab = () => {
    const [settings, setSettings] = useState(getAppearanceSettings());

    const handleSave = () => {
        saveAppearanceSettings(settings);
        alert('Настройки внешнего вида сохранены!');
        // Применить тему (в реальном приложении нужно обновить CSS переменные)
        document.documentElement.style.setProperty('--primary', settings.accentColor);
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
            <h2>🎨 Внешний вид</h2>
            
            <div className="settings-section">
                <div className="setting-row">
                    <div className="setting-info">
                        <label>🌙 Тёмная тема</label>
                        <p className="setting-description">Использовать тёмную цветовую схему</p>
                    </div>
                    <ToggleSwitch 
                        checked={settings.darkMode}
                        onChange={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    />
                </div>
            </div>

            <div className="settings-section">
                <label>🎨 Цветовая схема</label>
                <div className="color-picker-group">
                    {availableAccents.map(accent => (
                        <button
                            key={accent.color}
                            className={`color-option ${settings.accentColor === accent.color ? 'active' : ''}`}
                            style={{ background: accent.color }}
                            onClick={() => setSettings({ ...settings, accentColor: accent.color })}
                            title={accent.name}
                        />
                    ))}
                    <button 
                        className={`color-option custom ${settings.accentColor === '#116466' ? '' : 'active'}`}
                        style={{ background: settings.accentColor }}
                        onClick={() => {
                            const color = prompt('Введите цвет в формате HEX (#RRGGBB)', settings.accentColor);
                            if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
                                setSettings({ ...settings, accentColor: color });
                            }
                        }}
                        title="Пользовательский цвет"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <label>📊 Плотность отображения</label>
                <div className="radio-group density-group">
                    <label className={`radio-label density ${settings.density === 'compact' ? 'active' : ''}`}>
                        <input 
                            type="radio"
                            name="density"
                            checked={settings.density === 'compact'}
                            onChange={() => setSettings({ ...settings, density: 'compact' })}
                        />
                        <div className="density-preview compact">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Компактная</span>
                    </label>
                    <label className={`radio-label density ${settings.density === 'comfortable' ? 'active' : ''}`}>
                        <input 
                            type="radio"
                            name="density"
                            checked={settings.density === 'comfortable'}
                            onChange={() => setSettings({ ...settings, density: 'comfortable' })}
                        />
                        <div className="density-preview comfortable">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Комфортная</span>
                    </label>
                    <label className={`radio-label density ${settings.density === 'spacious' ? 'active' : ''}`}>
                        <input 
                            type="radio"
                            name="density"
                            checked={settings.density === 'spacious'}
                            onChange={() => setSettings({ ...settings, density: 'spacious' })}
                        />
                        <div className="density-preview spacious">
                            <span></span><span></span><span></span>
                        </div>
                        <span>Просторная</span>
                    </label>
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

export default AppearanceTab;