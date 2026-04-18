import { useState, useEffect } from 'react';
import { getCurrencySettings } from '../utils/settingsUtils';
import { formatCurrency as formatCurrencyUtil, updateCurrencyCache } from '../utils/formatters';

export function useCurrency() {
    const [currency, setCurrency] = useState(getCurrencySettings());
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const handleCurrencyUpdate = () => {
            setCurrency(getCurrencySettings());
            updateCurrencyCache();
            setRefreshKey(prev => prev + 1);
        };
        
        window.addEventListener('currencyUpdated', handleCurrencyUpdate);
        return () => window.removeEventListener('currencyUpdated', handleCurrencyUpdate);
    }, []);

    const formatCurrency = (amount) => formatCurrencyUtil(amount);

    return { currency, formatCurrency, refreshKey };
}