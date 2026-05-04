import { getCurrencySettings } from './settingsUtils';

let cachedCurrency = null;

function getCurrency() {
    if (!cachedCurrency) {
        cachedCurrency = getCurrencySettings();
    }
    return cachedCurrency;
}

export function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('ru-RU').format(num);
}

export function formatCurrency(amount) {
    const currency = getCurrency();
    const { symbol, position, format } = currency;
    const formattedAmount = formatNumber(Math.round(amount));
    
    switch(format) {
        case 'space_before':
            return `${formattedAmount} ${symbol}`;
        case 'space_after':
            return `${symbol} ${formattedAmount}`;
        case 'no_space':
            return `${formattedAmount}${symbol}`;
        default:
            return position === 'before' ? `${symbol} ${formattedAmount}` : `${formattedAmount} ${symbol}`;
    }
}

// Функция для прямого форматирования с указанием валюты (для кредитного калькулятора)
export function formatCurrencyWithSymbol(amount, symbol = '₽') {
    const formattedAmount = formatNumber(Math.round(amount));
    return `${formattedAmount} ${symbol}`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return 'Сегодня, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Вчера, ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else {
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
}

export function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

export function formatDateForTable(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Обновить кэш валюты при изменении
export function updateCurrencyCache() {
    cachedCurrency = getCurrencySettings();
}