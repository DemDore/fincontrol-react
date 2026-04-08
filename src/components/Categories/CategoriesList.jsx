import { formatNumber } from '../../utils/formatters';

const CategoriesList = ({ categories, type, onEdit, onDelete, title, icon }) => {
    if (categories.length === 0) {
        return (
            <div className="category-empty-state">
                <div className="empty-icon">📂</div>
                <p>Нет категорий {type === 'expense' ? 'расходов' : 'доходов'}</p>
                <p className="empty-hint">Нажмите "Добавить категорию", чтобы создать первую</p>
            </div>
        );
    }

    return (
        <div className="categories-section">
            <div className="categories-header">
                <h3>{icon} {title}</h3>
                <span className="categories-count">{categories.length} категорий</span>
            </div>
            
            <div className="categories-grid">
                {categories.map(category => (
                    <div key={category.id} className="category-card">
                        <div className="category-card-icon">{category.icon || '📁'}</div>
                        <div className="category-card-info">
                            <div className="category-card-name">
                                {category.name.includes(' ') ? category.name.split(' ').slice(1).join(' ') : category.name}
                            </div>
                            {type === 'expense' && category.budget && (
                                <div className="category-card-budget">
                                    Бюджет: {formatNumber(category.budget)} ₽
                                </div>
                            )}
                        </div>
                        <div className="category-card-actions">
                            <button 
                                className="edit-btn" 
                                onClick={() => onEdit(category)}
                                title="Редактировать"
                            >
                                ✏️
                            </button>
                            <button 
                                className="delete-btn" 
                                onClick={() => onDelete(category.id)}
                                title="Удалить"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriesList;