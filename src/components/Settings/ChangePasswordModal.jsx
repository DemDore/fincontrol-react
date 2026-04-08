import { useState } from 'react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!passwordData.current) {
            alert('Введите текущий пароль');
            return;
        }
        if (passwordData.new.length < 6) {
            alert('Новый пароль должен содержать минимум 6 символов');
            return;
        }
        if (passwordData.new !== passwordData.confirm) {
            alert('Новый пароль и подтверждение не совпадают');
            return;
        }
        
        // В реальном приложении здесь был бы запрос к API
        alert('Пароль успешно изменён!');
        setPasswordData({ current: '', new: '', confirm: '' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Смена пароля</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Текущий пароль</label>
                        <input 
                            type="password"
                            placeholder="Введите текущий пароль"
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Новый пароль</label>
                        <input 
                            type="password"
                            placeholder="Введите новый пароль"
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                            required
                        />
                        <p className="input-hint">Минимум 6 символов</p>
                    </div>
                    
                    <div className="form-group">
                        <label>Подтверждение пароля</label>
                        <input 
                            type="password"
                            placeholder="Подтвердите новый пароль"
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn-primary">
                            Сменить пароль
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;