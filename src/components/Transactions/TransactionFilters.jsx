import { useState } from 'react';
import { expenseCategories, incomeCategories } from '../../data/mockData';

const TransactionFilters = ({ filters, setFilters, onReset }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const allCategories = [...expenseCategories, ...incomeCategories];
    
    // Генерация списка месяцев
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
    
    // Генерация списка лет (последние 5 лет и следующий год)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 3; i <= currentYear + 1; i++) {
        years.push(i);
    }

    const handlePeriodChange = (periodType) => {
        setFilters({ ...filters, periodType, month: null, year: null, startDate: null, endDate: null });
        
        if (periodType === 'currentMonth') {
            setFilters({ ...filters, periodType: 'currentMonth' });
        }
    };

    const handleMonthYearChange = (month, year) => {
        setFilters({ 
            ...filters, 
            periodType: 'specificMonth',
            month, 
            year,
            startDate: null,
            endDate: null
        });
        setShowDatePicker(false);
    };

    const handleYearChange = (year) => {
        setFilters({ 
            ...filters, 
            periodType: 'specificYear',
            year,
            month: null,
            startDate: null,
            endDate: null
        });
        setShowDatePicker(false);
    };

    const handleDateRangeChange = (startDate, endDate) => {
        setFilters({ 
            ...filters, 
            periodType: 'dateRange',
            startDate,
            endDate,
            month: null,
            year: null
        });
    };

    const getPeriodLabel = () => {
        switch(filters.periodType) {
            case 'currentMonth':
                const now = new Date();
                const monthName = months[now.getMonth()];
                return `${monthName} ${now.getFullYear()}`;
            case 'specificMonth':
                return `${filters.month} ${filters.year}`;
            case 'specificYear':
                return `${filters.year} год`;
            case 'dateRange':
                if (filters.startDate && filters.endDate) {
                    return `${filters.startDate} — ${filters.endDate}`;
                }
                return 'Выберите диапазон';
            default:
                return 'Все время';
        }
    };

    return (
        <div className="filters-bar">
            <div className="filters-row">
                <div className="filter-group">
                    <label>Тип</label>
                    <select 
                        className="filter-select"
                        value={filters.type || 'all'}
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
                        value={filters.category || 'all'}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option value="all">Все категории</option>
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Период</label>
                    <div className="period-selector-wrapper">
                        <button 
                            className="period-trigger-btn"
                            onClick={() => setShowDatePicker(!showDatePicker)}
                        >
                            📅 {getPeriodLabel()} ▼
                        </button>
                        
                        {showDatePicker && (
                            <div className="period-dropdown">
                                <div className="period-dropdown-section">
                                    <div className="period-dropdown-title">Быстрые фильтры</div>
                                    <button 
                                        className={`period-option ${filters.periodType === 'all' || !filters.periodType ? 'active' : ''}`}
                                        onClick={() => handlePeriodChange('all')}
                                    >
                                        Все время
                                    </button>
                                    <button 
                                        className={`period-option ${filters.periodType === 'currentMonth' ? 'active' : ''}`}
                                        onClick={() => handlePeriodChange('currentMonth')}
                                    >
                                        Текущий месяц
                                    </button>
                                </div>
                                
                                <div className="period-dropdown-section">
                                    <div className="period-dropdown-title">Выбрать месяц</div>
                                    <div className="month-year-grid">
                                        <select 
                                            className="month-select"
                                            value={filters.month || months[new Date().getMonth()]}
                                            onChange={(e) => handleMonthYearChange(e.target.value, filters.year || currentYear)}
                                        >
                                            {months.map(month => (
                                                <option key={month} value={month}>{month}</option>
                                            ))}
                                        </select>
                                        <select 
                                            className="year-select"
                                            value={filters.year || currentYear}
                                            onChange={(e) => handleMonthYearChange(filters.month || months[new Date().getMonth()], parseInt(e.target.value))}
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <button 
                                            className="period-apply-btn"
                                            onClick={() => handleMonthYearChange(
                                                filters.month || months[new Date().getMonth()], 
                                                filters.year || currentYear
                                            )}
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="period-dropdown-section">
                                    <div className="period-dropdown-title">Выбрать год</div>
                                    <div className="year-grid">
                                        {years.map(year => (
                                            <button 
                                                key={year}
                                                className={`year-option ${filters.periodType === 'specificYear' && filters.year === year ? 'active' : ''}`}
                                                onClick={() => handleYearChange(year)}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="period-dropdown-section">
                                    <div className="period-dropdown-title">Диапазон дат</div>
                                    <div className="date-range-inputs">
                                        <input 
                                            type="date"
                                            className="date-input"
                                            value={filters.startDate || ''}
                                            onChange={(e) => handleDateRangeChange(e.target.value, filters.endDate || '')}
                                            placeholder="От"
                                        />
                                        <span>—</span>
                                        <input 
                                            type="date"
                                            className="date-input"
                                            value={filters.endDate || ''}
                                            onChange={(e) => handleDateRangeChange(filters.startDate || '', e.target.value)}
                                            placeholder="До"
                                        />
                                        <button 
                                            className="period-apply-btn"
                                            onClick={() => {
                                                if (filters.startDate && filters.endDate) {
                                                    handleDateRangeChange(filters.startDate, filters.endDate);
                                                    setShowDatePicker(false);
                                                }
                                            }}
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="filter-group search-group">
                    <label>Поиск</label>
                    <input 
                        type="text"
                        className="search-input"
                        placeholder="Поиск по описанию или категории..."
                        value={filters.search || ''}
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