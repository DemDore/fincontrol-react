import { useState, useEffect } from 'react';

const iconOptions = ['🍔', '🚗', '🏠', '🛍️', '🎮', '💊', '📚', '💼', '📈', '🎁', '💸', '☕', '🎬', '⚽', '🐶', '💡', '🍕', '🛒', '✈️', '🏥', '🎓', '👕', '💄', '🐱'];

const CategoryModal = ({ isOpen, onClose, onSave, category, type }) => {
    const [formData, setFormData] = useState({
        name: '',
        icon: '🍔',
        budget: ''
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name.replace(/^[^\s]+\s/, ''),
                icon: category.icon || '🍔',
                budget: category.budget || ''
            });
        } else {
            setFormData({
                name: '',
                icon: '🍔',
                budget: ''
            });
        }
    }, [category, isOpen, type]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            alert('Введите название категории');
            return;
        }

        const fullName = `${formData.icon} ${formData.name.trim()}`;
        
        onSave({
            name: fullName,
            icon: formData.icon,
            budget: formData.budget ? parseFloat(formData.budget) : null
        });
    };

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{category ? 'Редактировать категорию' : 'Добавить категорию'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Название категории</label>
                        <input 
                            type="text"
                            placeholder="Например: Рестораны"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Иконка</label>
                        <div className="icon-selector">
                            {iconOptions.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    className={`icon-option ${formData.icon === icon ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, icon })}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {type === 'expense' && (
                        <div className="form-group">
                            <label>Бюджет на месяц (необязательно)</label>
                            <input 
                                type="number"
                                placeholder="Например: 15000"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                    )}
                    
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn-primary">
                            {category ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;