import { useState, useEffect } from 'react';
import { getAppearanceSettings } from '../utils/settingsUtils';

export const useThemeColors = () => {
    const [colors, setColors] = useState({
        primary: '#116466',
        primaryLight: '#148a8c',
        warning: '#FFCB9A',
        danger: '#FF6B6B',
    });

    useEffect(() => {
        const updateColors = () => {
            const settings = getAppearanceSettings();
            const accentColor = settings.accentColor || '#116466';
            
            setColors({
                primary: accentColor,
                primaryLight: accentColor === '#116466' ? '#148a8c' : accentColor,
                warning: '#FFCB9A',
                danger: '#FF6B6B',
            });
        };

        updateColors();
        
        const handleAppearanceUpdate = () => {
            updateColors();
        };
        
        window.addEventListener('appearanceUpdated', handleAppearanceUpdate);
        return () => window.removeEventListener('appearanceUpdated', handleAppearanceUpdate);
    }, []);

    return colors;
};