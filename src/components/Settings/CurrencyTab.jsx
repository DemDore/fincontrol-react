import { useState, useEffect } from 'react';
import { availableCurrencies } from '../../utils/settingsUtils';
import { useProfile } from '../../context/ProfileContext';
import { formatCurrency as formatCurrencyPreview } from '../../utils/formatters';

const CurrencyTab = () => {
    const { currency, updateCurrency } = useProfile();
    const [settings, setSettings] = useState(currency);

    useEffect(() => {
        if (currency) {
            setSettings(currency);
        }
    }, [currency]);

    const handleSave = () => {
        updateCurrency(settings);
        // Сохраняем флаг, что нужно обновить страницу
        localStorage.setItem('currency_changed', 'true');
        alert('Настройки валюты сохранены! Страница будет перезагружена для применения изменений.');
        // Перезагружаем страницу, чтобы все компоненты обновились
        window.location.reload();
    };

    const previewAmount = 12345.67;

    if (!settings) return <div>Загрузка...</div>;

    return (
        <div className="settings-card">
            <h2>💰 Настройки валюты</h2>
            
            <div className="settings-section">
                <label>Основная валюта</label>
                <select 
                    value={settings.code}
                    onChange={(e) => {
                        const selectedCurrency = availableCurrencies.find(c => c.code === e.target.value);
                        setSettings({ ...settings, code: selectedCurrency.code, symbol: selectedCurrency.symbol, name: selectedCurrency.name });
                    }}
                >
                    {availableCurrencies.map(curr => (
                        <option key={curr.code} value={curr.code}>
                            {curr.name} ({curr.symbol})
                        </option>
                    ))}
                </select>
            </div>

            <div className="settings-section">
                <label>Формат отображения</label>
                <div className="radio-group">
                    <label className="radio-label">
                        <input 
                            type="radio"
                            name="format"
                            checked={settings.format === 'space_before'}
                            onChange={() => setSettings({ ...settings, format: 'space_before' })}
                        />
                        <span>1 234.56 {settings.symbol}</span>
                    </label>
                    <label className="radio-label">
                        <input 
                            type="radio"
                            name="format"
                            checked={settings.format === 'space_after'}
                            onChange={() => setSettings({ ...settings, format: 'space_after' })}
                        />
                        <span>{settings.symbol} 1 234.56</span>
                    </label>
                    <label className="radio-label">
                        <input 
                            type="radio"
                            name="format"
                            checked={settings.format === 'no_space'}
                            onChange={() => setSettings({ ...settings, format: 'no_space' })}
                        />
                        <span>1 234.56{settings.symbol}</span>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <label>Положение символа валюты</label>
                <div className="radio-group">
                    <label className="radio-label">
                        <input 
                            type="radio"
                            name="position"
                            checked={settings.position === 'after'}
                            onChange={() => setSettings({ ...settings, position: 'after' })}
                        />
                        <span>1234 {settings.symbol}</span>
                    </label>
                    <label className="radio-label">
                        <input 
                            type="radio"
                            name="position"
                            checked={settings.position === 'before'}
                            onChange={() => setSettings({ ...settings, position: 'before' })}
                        />
                        <span>{settings.symbol} 1234</span>
                    </label>
                </div>
            </div>

            <div className="preview-section">
                <label>Предпросмотр</label>
                <div className="preview-value">
                    {formatCurrencyPreview(previewAmount)}
                </div>
                <p className="setting-description">Пример отображения суммы {previewAmount}</p>
            </div>

            <div className="settings-actions">
                <button className="btn-primary" onClick={handleSave}>
                    💾 Сохранить настройки
                </button>
            </div>
        </div>
    );
};

export default CurrencyTab;