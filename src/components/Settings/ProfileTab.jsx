import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../services/api';
import ChangePasswordModal from './ChangePasswordModal';

const ProfileTab = () => {
    const { user, updateUser } = useAuth();
    const [localProfile, setLocalProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: '👤'
    });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!localProfile.name.trim()) {
            alert('Имя не может быть пустым');
            return;
        }
        
        setSaving(true);
        try {
            const response = await profileAPI.update({
                name: localProfile.name,
                email: localProfile.email
            });
            
            if (response.token && response.user) {
                // Сохраняем новый токен
                localStorage.setItem('token', response.token);
                // Обновляем пользователя в контексте
                updateUser(response.user);
                alert('Профиль успешно обновлён!');
            }
        } catch (error) {
            console.error('Ошибка обновления профиля:', error);
            alert('Ошибка при обновлении профиля: ' + error.message);
        } finally {
            setSaving(false);
        }
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
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Сохранение...' : '💾 Сохранить изменения'}
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