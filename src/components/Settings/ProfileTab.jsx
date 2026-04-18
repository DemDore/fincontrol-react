import { useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import ChangePasswordModal from './ChangePasswordModal';

const ProfileTab = () => {
    const { profile, updateProfile } = useProfile();
    const [localProfile, setLocalProfile] = useState(profile);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const handleSave = () => {
        updateProfile(localProfile);
        alert('Профиль сохранён!');
    };

    return (
        <div className="settings-card">
            <h2>👤 Профиль пользователя</h2>
            
            <div className="settings-section">
                <label>Аватар</label>
                <div className="avatar-section">
                    <div className="avatar-preview">{localProfile.avatar}</div>
                    <button className="btn-secondary" onClick={() => {
                        const newAvatar = prompt('Введите emoji для аватара:', localProfile.avatar);
                        if (newAvatar) setLocalProfile({ ...localProfile, avatar: newAvatar });
                    }}>
                        📷 Сменить аватар
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <label>Имя пользователя</label>
                <input 
                    type="text"
                    value={localProfile.name}
                    onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
                    placeholder="Ваше имя"
                />
            </div>

            <div className="settings-section">
                <label>Email</label>
                <input 
                    type="email"
                    value={localProfile.email}
                    onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
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