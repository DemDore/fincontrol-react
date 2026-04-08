import { expenseCategories, incomeCategories } from '../../data/mockData';

const TransactionFilters = ({ filters, setFilters, onReset }) => {
    const allCategories = [...expenseCategories, ...incomeCategories];

    return (
        <div className="filters-bar">
            <div className="filters-row">
                <div className="filter-group">
                    <label>Тип</label>
                    <select 
                        className="filter-select"
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="all">Все</option>
                        <option value="income">Доходы</option>
                        <option value="expense">Расходы</option>
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Категория</label>
                    <select 
                        className="filter-select"
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="all">Все категории</option>
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group search-group">
                    <label>Поиск</label>
                    <input 
                        type="text"
                        className="search-input"
                        placeholder="Поиск по описанию или категории..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                </div>
            </div>
            
            <div className="filters-actions">
                <button className="btn-secondary" onClick={onReset}>
                    Сбросить фильтры
                </button>
            </div>
        </div>
    );
};

export default TransactionFilters;