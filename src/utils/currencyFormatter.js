// Форматирование суммы с валютой
export function formatCurrency(amount, currencySettings) {
    if (!currencySettings) return `${amount} ₽`;
    
    const { symbol, position, format } = currencySettings;
    const formattedAmount = new Intl.NumberFormat('ru-RU').format(Math.round(amount));
    
    let result = formattedAmount;
    
    // Применяем формат
    switch(format) {
        case 'space_before':
            result = `${formattedAmount} ${symbol}`;
            break;
        case 'space_after':
            result = `${symbol} ${formattedAmount}`;
            break;
        case 'no_space':
            result = `${formattedAmount}${symbol}`;
            break;
        default:
            result = `${formattedAmount} ${symbol}`;
    }
    
    // Применяем положение (если нужно)
    if (position === 'before' && format !== 'space_after') {
        result = `${symbol} ${formattedAmount}`;
    } else if (position === 'after' && format !== 'space_before' && format !== 'no_space') {
        result = `${formattedAmount} ${symbol}`;
    }
    
    return result;
}

// Хук для удобного использования валюты в компонентах
export function useCurrencyFormatter() {
    const { currency } = require('../context/ProfileContext').useProfile();
    
    return (amount) => formatCurrency(amount, currency);
}