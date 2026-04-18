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
    format: 'space_before',
    position: 'after'
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
    density: 'comfortable',
    accentColor: '#116466'
};

export function getProfile() {
    const saved = localStorage.getItem(SETTINGS_KEYS.PROFILE);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            return defaultProfile;
        }
    }
    return defaultProfile;
}

export function saveProfile(profile) {
    localStorage.setItem(SETTINGS_KEYS.PROFILE, JSON.stringify(profile));
}

export function getCurrencySettings() {
    const saved = localStorage.getItem(SETTINGS_KEYS.CURRENCY);
    if (saved) return JSON.parse(saved);
    return defaultCurrency;
}

export function saveCurrencySettings(settings) {
    localStorage.setItem(SETTINGS_KEYS.CURRENCY, JSON.stringify(settings));
}

export function getNotificationSettings() {
    const saved = localStorage.getItem(SETTINGS_KEYS.NOTIFICATIONS);
    if (saved) return JSON.parse(saved);
    return defaultNotifications;
}

export function saveNotificationSettings(settings) {
    localStorage.setItem(SETTINGS_KEYS.NOTIFICATIONS, JSON.stringify(settings));
}

export function getAppearanceSettings() {
    const saved = localStorage.getItem(SETTINGS_KEYS.APPEARANCE);
    if (saved) return JSON.parse(saved);
    return defaultAppearance;
}

export function saveAppearanceSettings(settings) {
    localStorage.setItem(SETTINGS_KEYS.APPEARANCE, JSON.stringify(settings));
}

export const availableCurrencies = [
    { code: 'RUB', symbol: '₽', name: 'Российский рубль' },
    { code: 'USD', symbol: '$', name: 'Доллар США' },
    { code: 'EUR', symbol: '€', name: 'Евро' },
    { code: 'GBP', symbol: '£', name: 'Фунт стерлингов' },
    { code: 'JPY', symbol: '¥', name: 'Японская иена' },
    { code: 'CNY', symbol: '¥', name: 'Китайский юань' },
    { code: 'KZT', symbol: '₸', name: 'Казахстанский тенге' }
];

export const availableAccents = [
    { color: '#116466', name: 'Бирюзовый' },
    { color: '#FFCB9A', name: 'Персиковый' },
    { color: '#D9B08C', name: 'Песочный' }
];

// Применить тему к документу
export function applyTheme(settings) {
    const { darkMode, accentColor } = settings;
    
    // Применяем тему
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    
    // Применяем акцентный цвет
    if (accentColor === '#116466') {
        document.documentElement.setAttribute('data-accent', 'teal');
    } else if (accentColor === '#FFCB9A') {
        document.documentElement.setAttribute('data-accent', 'peach');
    } else if (accentColor === '#D9B08C') {
        document.documentElement.setAttribute('data-accent', 'sand');
    } else {
        document.documentElement.setAttribute('data-accent', 'custom');
        document.documentElement.style.setProperty('--primary', accentColor);
        document.documentElement.style.setProperty('--primary-light', accentColor);
    }
}