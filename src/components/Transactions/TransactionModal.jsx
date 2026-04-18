import { useState, useEffect } from 'react';
import { useCurrency } from '../../hooks/useCurrency';

const TransactionModal = ({ isOpen, onClose, onSave, transaction, expenseCategories, incomeCategories }) => {
    const { formatCurrency } = useCurrency();
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        if (transaction) {
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                category: transaction.category,
                date: transaction.date.split('T')[0],
                description: transaction.description || ''
            });
        } else {
            setFormData({
                type: 'expense',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
        }
    }, [transaction, isOpen]);

    if (!isOpen) return null;

    const categories = formData.type === 'expense' ? expenseCategories : incomeCategories;
    const previewAmount = formData.amount ? parseFloat(formData.amount) : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.amount || formData.amount <= 0) {
            alert('Введите корректную сумму');
            return;
        }
        if (!formData.category) {
            alert('Выберите категорию');
            return;
        }
        if (!formData.date) {
            alert('Выберите дату');
            return;
        }

        onSave({
            ...formData,
            amount: parseFloat(formData.amount)
        });
    };

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{transaction ? 'Редактировать транзакцию' : 'Добавить транзакцию'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Тип транзакции</label>
                        <div className="type-toggle">
                            <button 
                                type="button"
                                className={`type-btn expense ${formData.type === 'expense' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                            >
                                💸 Расход
                            </button>
                            <button 
                                type="button"
                                className={`type-btn income ${formData.type === 'income' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                            >
                                📈 Доход
                            </button>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Сумма</label>
                        <input 
                            type="number"
                            placeholder="0"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        {previewAmount > 0 && (
                            <p className="input-hint" style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                                Предпросмотр: {formatCurrency(previewAmount)}
                            </p>
                        )}
                    </div>
                    
                    <div className="form-group">
                        <label>Категория</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Дата</label>
                        <input 
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Описание (необязательно)</label>
                        <input 
                            type="text"
                            placeholder="Например: Обед в кафе"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn-primary">
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;