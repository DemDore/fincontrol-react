import { createContext, useContext, useState, useEffect } from 'react';
import { 
    getProfile, saveProfile, 
    getAppearanceSettings, saveAppearanceSettings, applyTheme,
    getCurrencySettings, saveCurrencySettings
} from '../utils/settingsUtils';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
    const [profile, setProfile] = useState(null);
    const [appearance, setAppearance] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
        loadAppearance();
        loadCurrency();
    }, []);

    const loadProfile = () => {
        const saved = getProfile();
        setProfile(saved);
    };

    const loadAppearance = () => {
        const saved = getAppearanceSettings();
        setAppearance(saved);
        applyTheme(saved);
    };

    const loadCurrency = () => {
        const saved = getCurrencySettings();
        setCurrency(saved);
    };

    const updateProfile = (newProfile) => {
        saveProfile(newProfile);
        setProfile(newProfile);
        window.dispatchEvent(new Event('profileUpdated'));
    };

    const updateAppearance = (newAppearance) => {
        saveAppearanceSettings(newAppearance);
        setAppearance(newAppearance);
        applyTheme(newAppearance);
    };

    const updateCurrency = (newCurrency) => {
        saveCurrencySettings(newCurrency);
        setCurrency(newCurrency);
        window.dispatchEvent(new Event('currencyUpdated'));
    };

    if (loading && !profile) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1f1e', color: 'white' }}>Загрузка...</div>;
    }

    return (
        <ProfileContext.Provider value={{ 
            profile, 
            appearance,
            currency,
            updateProfile, 
            updateAppearance,
            updateCurrency,
            loadProfile 
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