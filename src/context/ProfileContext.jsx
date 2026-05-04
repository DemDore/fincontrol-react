import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import { getProfile, saveProfile, getAppearanceSettings, saveAppearanceSettings, applyTheme, getCurrencySettings, saveCurrencySettings } from '../utils/settingsUtils';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [appearance, setAppearance] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user: authUser } = useAuth();

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Если есть авторизованный пользователь - берём данные из него
                if (authUser) {
                    setProfile({
                        name: authUser.name || 'Пользователь',
                        email: authUser.email || '',
                        avatar: '👤'
                    });
                } else {
                    // Иначе загружаем локальные настройки
                    const savedProfile = getProfile();
                    setProfile(savedProfile);
                }
                
                const savedAppearance = getAppearanceSettings();
                const savedCurrency = getCurrencySettings();
                setAppearance(savedAppearance);
                setCurrency(savedCurrency);
                applyTheme(savedAppearance);
            } catch (error) {
                console.error('Ошибка загрузки настроек:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadSettings();
    }, [authUser]);

    const updateProfile = async (newProfile) => {
        saveProfile(newProfile);
        setProfile(newProfile);
        window.dispatchEvent(new Event('profileUpdated'));
    };

    const updateAppearance = async (newAppearance) => {
        saveAppearanceSettings(newAppearance);
        setAppearance(newAppearance);
        applyTheme(newAppearance);
        
        if (authUser) {
            try {
                await settingsAPI.update({
                    darkMode: newAppearance.darkMode,
                    accentColor: newAppearance.accentColor,
                    density: newAppearance.density
                });
            } catch (error) {
                console.error('Ошибка сохранения настроек на сервере:', error);
            }
        }
    };

    const updateCurrency = async (newCurrency) => {
        saveCurrencySettings(newCurrency);
        setCurrency(newCurrency);
        
        if (authUser) {
            try {
                await settingsAPI.update({
                    currency: {
                        code: newCurrency.code,
                        symbol: newCurrency.symbol
                    }
                });
            } catch (error) {
                console.error('Ошибка сохранения валюты на сервере:', error);
            }
        }
        
        window.dispatchEvent(new Event('currencyUpdated'));
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-dark)', color: 'white' }}>Загрузка...</div>;
    }

    return (
        <ProfileContext.Provider value={{ 
            profile, 
            appearance,
            currency,
            updateProfile, 
            updateAppearance,
            updateCurrency,
            loadProfile: () => {}
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}