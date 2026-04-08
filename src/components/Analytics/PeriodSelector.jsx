const PeriodSelector = ({ period, onPeriodChange }) => {
    const periods = [
        { value: 'month', label: 'Месяц' },
        { value: 'quarter', label: 'Квартал' },
        { value: 'year', label: 'Год' },
        { value: 'all', label: 'Всё время' }
    ];

    return (
        <div className="period-selector">
            {periods.map(p => (
                <button
                    key={p.value}
                    className={`period-btn ${period === p.value ? 'active' : ''}`}
                    onClick={() => onPeriodChange(p.value)}
                >
                    {p.label}
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;