import { useState, useEffect } from 'react';
import { expenseCategories } from '../../data/mockData';
import { getCurrentMonth, getCurrentYear } from '../../utils/budgetUtils';

const BudgetModal = ({ isOpen, onClose, onSave, budget }) => {
    const [formData, setFormData] = useState({
        category: '',
        budget: '',
        month: getCurrentMonth(),
        year: getCurrentYear()
    });

    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    const years = [2024, 2025, 2026, 2027, 2028];

    useEffect(() => {
        if (budget) {
            setFormData({
                category: budget.category,
                budget: budget.budget,
                month: budget.month || getCurrentMonth(),
                year: budget.year || getCurrentYear()
            });
        } else {
            setFormData({
                category: '',
                budget: '',
                month: getCurrentMonth(),
                year: getCurrentYear()
            });
        }
    }, [budget, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.category) {
            alert('Выберите категорию');
            return;
        }
        if (!formData.budget || formData.budget <= 0) {
            alert('Введите корректную сумму бюджета');
            return;
        }

        onSave({
            category: formData.category,
            budget: parseFloat(formData.budget),
            month: formData.month,
            year: formData.year
        });
    };

    return (
        <div className="modal active" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{budget ? 'Редактировать бюджет' : 'Добавить бюджет'}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Категория</label>
                        <select 
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {expenseCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Бюджет на месяц</label>
                        <input 
                            type="number"
                            placeholder="Введите сумму"
                            value={formData.budget}
                            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group half">
                            <label>Месяц</label>
                            <select 
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            >
                                {months.map(month => (
                                    <option key={month} value={month}>{month}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group half">
                            <label>Год</label>
                            <select 
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn-primary">
                            {budget ? 'Сохранить' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BudgetModal;