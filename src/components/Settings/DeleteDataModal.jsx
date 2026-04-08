import { useState } from 'react';
import { getTransactions, saveTransactions } from '../../utils/storage';
import { STORAGE_KEYS as BUDGET_KEYS } from '../../utils/budgetUtils';
import { SETTINGS_KEYS } from '../../utils/settingsUtils';

const DeleteDataModal = ({ isOpen, onClose }) => {
    const [confirmText, setConfirmText] = useState('');

    const handleDelete = () => {
        if (confirmText !== 'DELETE') {
            alert('Введите DELETE для подтверждения');
            return;
        }
        
        // Очистить все данные
        saveTransactions([]);
        localStorage.removeItem(BUDGET_KEYS.BUDGETS);
        localStorage.removeItem(BUDGET_KEYS.OVERALL_BUDGET);
        localStorage.removeItem(SETTINGS_KEYS.PROFILE);
        localStorage.removeItem(SETTINGS_KEYS.CURRENCY);
        localStorage.removeItem(SETTINGS_KEYS.NOTIFICATIONS);
        localStorage.removeItem(SETTINGS_KEYS.APPEARANCE);
        
        alert('Все данные удалены! Страница будет перезагружена.');
        window.location.reload();
    };

    if (!isOpen) return null;

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>⚠️ Подтверждение действия</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <div className="modal-body">
                    <p>Вы уверены, что хотите удалить <strong>все данные</strong>?</p>
                    <p className="warning-text">Это действие нельзя отменить. Все транзакции, категории и бюджеты будут удалены безвозвратно.</p>
                    
                    <div className="confirm-input">
                        <label>Введите <strong>DELETE</strong> для подтверждения:</label>
                        <input 
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE"
                        />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button className="btn-secondary" onClick={onClose}>
                        Отмена
                    </button>
                    <button className="btn-danger" onClick={handleDelete}>
                        🗑️ Удалить навсегда
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteDataModal;