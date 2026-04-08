const CategoryTabs = ({ activeTab, onTabChange, onReset }) => {
    return (
        <div className="categories-tabs">
            <button 
                className={`tab-btn ${activeTab === 'expense' ? 'active' : ''}`}
                onClick={() => onTabChange('expense')}
            >
                💸 Расходы
            </button>
            <button 
                className={`tab-btn ${activeTab === 'income' ? 'active' : ''}`}
                onClick={() => onTabChange('income')}
            >
                📈 Доходы
            </button>
            <button 
                className="btn-outline reset-btn" 
                onClick={onReset}
            >
                🔄 Сбросить к стандартным
            </button>
        </div>
    );
};

export default CategoryTabs;