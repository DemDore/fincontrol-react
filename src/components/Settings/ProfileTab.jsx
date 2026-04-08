import { useState } from 'react';
import { getProfile, saveProfile } from '../../utils/settingsUtils';
import ChangePasswordModal from './ChangePasswordModal';

const ProfileTab = () => {
    const [profile, setProfile] = useState(getProfile());
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleSave = () => {
        saveProfile(profile);
        alert('Профиль сохранён!');
    };

    return (
        <div className="settings-card">
            <h2>👤 Профиль пользователя</h2>
            
            <div className="settings-section">
                <label>Аватар</label>
                <div className="avatar-section">
                    <div className="avatar-preview">{profile.avatar}</div>
                    <button className="btn-secondary" onClick={() => {
                        const newAvatar = prompt('Введите emoji для аватара:', profile.avatar);
                        if (newAvatar) setProfile({ ...profile, avatar: newAvatar });
                    }}>
                        📷 Сменить аватар
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <label>Имя пользователя</label>
                <input 
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Ваше имя"
                />
            </div>

            <div className="settings-section">
                <label>Email</label>
                <input 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="your@email.com"
                />
            </div>

            <div className="settings-section">
                <label>Пароль</label>
                <input type="password" value="********" disabled />
                <button className="btn-outline" onClick={() => setIsPasswordModalOpen(true)}>
                    Сменить пароль
                </button>
            </div>

            <div className="settings-actions">
                <button className="btn-primary" onClick={handleSave}>
                    💾 Сохранить изменения
                </button>
            </div>

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default ProfileTab;