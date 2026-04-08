const BudgetProgressBar = ({ percent, isOverBudget, height = '8px' }) => {
    const displayPercent = Math.min(percent, 100);
    const barColor = isOverBudget ? '#FF6B6B' : 'linear-gradient(90deg, #116466, #FFCB9A)';
    
    return (
        <div className="budget-progress-bar" style={{ height }}>
            <div 
                className="budget-progress-fill"
                style={{ 
                    width: `${displayPercent}%`,
                    background: barColor
                }}
            />
        </div>
    );
};

export default BudgetProgressBar;