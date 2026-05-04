import { useState, useEffect } from 'react';
import { getAppearanceSettings, saveAppearanceSettings, availableAccents } from '../../utils/settingsUtils';
import { useProfile } from '../../context/ProfileContext';

const AppearanceTab = () => {
    const { appearance, updateAppearance } = useProfile();
    const [settings, setSettings] = useState(appearance || getAppearanceSettings());

    useEffect(() => {
        if (appearance) {
            setSettings(appearance);
        }
    }, [appearance]);

    const handleSave = () => {
        saveAppearanceSettings(settings);
        updateAppearance(settings);
        window.dispatchEvent(new Event('appearanceUpdated')); 
        alert('Настройки внешнего вида сохранены!');
    };

    const ToggleSwitch = ({ checked, onChange }) => (
        <button 
            className={`toggle-switch ${checked ? 'active' : ''}`}
            onClick={onChange}
            type="button"
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
                            type="button"
                        />
                    ))}
                    <button 
                        className={`color-option custom ${!availableAccents.find(a => a.color === settings.accentColor) ? 'active' : ''}`}
                        style={{ background: settings.accentColor }}
                        onClick={() => {
                            const color = prompt('Введите цвет в формате HEX (#RRGGBB)', settings.accentColor);
                            if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
                                setSettings({ ...settings, accentColor: color });
                            }
                        }}
                        title="Пользовательский цвет"
                        type="button"
                    >
                        +
                    </button>
                </div>
                <p className="setting-description">Выберите основной цвет приложения</p>
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
                <p className="setting-description">Влияет на отступы и размеры элементов</p>
            </div>

            <div className="preview-section">
                <label>Предпросмотр</label>
                <div className="preview-example">
                    <div className="preview-card">
                        <div className="preview-icon">💰</div>
                        <div className="preview-text">
                            <div className="preview-title">Пример карточки</div>
                            <div className="preview-subtitle">С выбранными цветами</div>
                        </div>
                    </div>
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