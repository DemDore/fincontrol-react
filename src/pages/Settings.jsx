import { useState } from 'react';
import SettingsTabs from '../components/Settings/SettingsTabs';
import ProfileTab from '../components/Settings/ProfileTab';
import CurrencyTab from '../components/Settings/CurrencyTab';
import NotificationsTab from '../components/Settings/NotificationsTab';
import DataTab from '../components/Settings/DataTab';
import AppearanceTab from '../components/Settings/AppearanceTab';
import '../styles/settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderTab = () => {
        switch(activeTab) {
            case 'profile':
                return <ProfileTab />;
            case 'currency':
                return <CurrencyTab />;
            case 'notifications':
                return <NotificationsTab />;
            case 'data':
                return <DataTab />;
            case 'appearance':
                return <AppearanceTab />;
            default:
                return <ProfileTab />;
        }
    };

    return (
        <div className="content settings-page">
            <div className="page-header">
                <h1>⚙️ Настройки</h1>
            </div>

            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="settings-content">
                {renderTab()}
            </div>
        </div>
    );
};

export default Settings;