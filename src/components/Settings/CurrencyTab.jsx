import { useState } from 'react';
import { getCurrencySettings, saveCurrencySettings, availableCurrencies } from '../../utils/settingsUtils';

const CurrencyTab = () => {
    const [settings, setSettings] = useState(getCurrencySettings());

    const handleSave = () => {
        saveCurrencySettings(settings);
        alert('Настройки валюты сохранены!');
    };

    const selectedCurrency = availableCurrencies.find(c => c.code === settings.code);

    return (
        <div className="settings-card">
            <h2>💰 Настройки валюты</h2>
            
            <div className="settings-section">
                <label>Основная валюта</label>
                <select 
                    value={settings.code}
                    onChange={(e) => {
                        const currency = availableCurrencies.find(c => c.code === e.target.value);
                        setSettings({ ...settings, code: currency.code, symbol: currency.symbol, name: currency.name });
                    }}
                >
                    {availableCurrencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                            {currency.name} ({currency.symbol})
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
                    {settings.position === 'before' ? settings.symbol : ''}
                    {settings.format === 'space_after' && settings.position === 'before' ? ' ' : ''}
                    12 345.67
                    {settings.format === 'space_before' && settings.position === 'after' ? ' ' : ''}
                    {settings.position === 'after' ? settings.symbol : ''}
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

export default CurrencyTab;