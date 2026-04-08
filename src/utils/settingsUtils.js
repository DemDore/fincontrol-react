// Ключи для localStorage
export const SETTINGS_KEYS = {
    PROFILE: 'fincontrol_profile',
    CURRENCY: 'fincontrol_currency',
    NOTIFICATIONS: 'fincontrol_notifications',
    APPEARANCE: 'fincontrol_appearance'
};

// Настройки по умолчанию
const defaultProfile = {
    name: 'Анна',
    email: 'anna@example.com',
    avatar: '👤'
};

const defaultCurrency = {
    code: 'RUB',
    symbol: '₽',
    name: 'Российский рубль',
    format: 'space_before', // space_before, space_after, no_space
    position: 'after' // before, after
};

const defaultNotifications = {
    emailEnabled: true,
    budgetOverspend: true,
    budgetWarning: true,
    weeklyReport: false,
    email: 'anna@example.com'
};

const defaultAppearance = {
    darkMode: true,
    density: 'comfortable', // compact, comfortable, spacious
    accentColor: '#116466'
};

// Получить профиль
export function getProfile() {
    const saved = localStorage.getItem(SETTINGS_KEYS.PROFILE);
    if (saved) return JSON.parse(saved);
    return defaultProfile;
}

// Сохранить профиль
export function saveProfile(profile) {
    localStorage.setItem(SETTINGS_KEYS.PROFILE, JSON.stringify(profile));
}

// Получить настройки валюты
export function getCurrencySettings() {
    const saved = localStorage.getItem(SETTINGS_KEYS.CURRENCY);
    if (saved) return JSON.parse(saved);
    return defaultCurrency;
}

// Сохранить настройки валюты
export function saveCurrencySettings(settings) {
    localStorage.setItem(SETTINGS_KEYS.CURRENCY, JSON.stringify(settings));
}

// Получить настройки уведомлений
export function getNotificationSettings() {
    const saved = localStorage.getItem(SETTINGS_KEYS.NOTIFICATIONS);
    if (saved) return JSON.parse(saved);
    return defaultNotifications;
}

// Сохранить настройки уведомлений
export function saveNotificationSettings(settings) {
    localStorage.setItem(SETTINGS_KEYS.NOTIFICATIONS, JSON.stringify(settings));
}

// Получить настройки внешнего вида
export function getAppearanceSettings() {
    const saved = localStorage.getItem(SETTINGS_KEYS.APPEARANCE);
    if (saved) return JSON.parse(saved);
    return defaultAppearance;
}

// Сохранить настройки внешнего вида
export function saveAppearanceSettings(settings) {
    localStorage.setItem(SETTINGS_KEYS.APPEARANCE, JSON.stringify(settings));
}

// Форматирование чисел с валютой
export function formatCurrency(amount, currencySettings) {
    const formatted = new Intl.NumberFormat('ru-RU').format(amount);
    if (currencySettings.position === 'before') {
        return `${currencySettings.symbol} ${formatted}`;
    } else {
        return `${formatted} ${currencySettings.symbol}`;
    }
}

// Доступные валюты
export const availableCurrencies = [
    { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
    { code: 'USD', symbol: '$', name: 'Доллар США' },
    { code: 'EUR', symbol: '€', name: 'Евро' },
    { code: 'GBP', symbol: '£', name: 'Фунт стерлингов' },
    { code: 'JPY', symbol: '¥', name: 'Японская иена' },
    { code: 'CNY', symbol: '¥', name: 'Китайский юань' },
    { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге' }
];

// Доступные цветовые акценты
export const availableAccents = [
    { color: '#116466', name: 'Бирюзовый' },
    { color: '#FFCB9A', name: 'Персиковый' },
    { color: '#D9B08C', name: 'Песочный' }
];