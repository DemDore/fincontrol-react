import { formatMoney } from '../../utils/loanCalculatorUtils';

const LoanTable = ({ 
    schedule, 
    loanTerm, 
    prepayments,
    onPrepaymentChange
}) => {
    const months = loanTerm * 12;

    const handlePrepaymentAmountChange = (month, value) => {
        const amount = value || 0;
        const current = prepayments[month] || { amount: 0, newRate: null, recalcType: null };
        // Если сумма > 0 и способ пересчета не выбран, устанавливаем 'payment' как значение по умолчанию
        let recalcType = current.recalcType;
        if (amount > 0 && !recalcType) {
            recalcType = 'payment';
        }
        // Если сумма = 0, сбрасываем способ пересчета
        if (amount === 0) {
            recalcType = null;
        }
        onPrepaymentChange(month, amount, current.newRate, recalcType);
    };

    const handleNewRateChange = (month, value) => {
        const current = prepayments[month] || { amount: 0, newRate: null, recalcType: null };
        onPrepaymentChange(month, current.amount, value || null, current.recalcType);
    };

    const handleRecalcTypeChange = (month, value) => {
        const current = prepayments[month] || { amount: 0, newRate: null, recalcType: null };
        onPrepaymentChange(month, current.amount, current.newRate, value);
    };

    // Проверка на наличие данных
    if (!schedule || schedule.length === 0) {
        return (
            <div className="loan-table-container">
                <div className="empty-state">Нет данных для отображения</div>
            </div>
        );
    }

    return (
        <div className="loan-table-container">
            <table className="loan-table">
                <thead>
                    <tr className="loan-table-header-main">
                        <th rowSpan="2">Месяц</th>
                        <th rowSpan="2">Остаток ссудной задолженности</th>
                        <th rowSpan="2">Проценты</th>
                        <th rowSpan="2">Ссудная задолженность</th>
                        <th colSpan="3" className="payment-header">Платеж</th>
                        <th rowSpan="2">Новая % ставка</th>
                        <th rowSpan="2">Сумма досрочного погашения</th>
                        <th rowSpan="2">Способ пересчета</th>
                    </tr>
                    <tr className="loan-table-header-sub">
                        <th>Основной долг</th>
                        <th>Проценты</th>
                        <th>Общий</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.map((row) => {
                        const hasPrepayment = row.hasPrepayment || (prepayments[row.month]?.amount > 0);
                        const prepaymentData = prepayments[row.month] || { amount: 0, newRate: null, recalcType: null };
                        const showRecalcSelect = prepaymentData.amount > 0;
                        
                        return (
                            <tr key={row.month} className={hasPrepayment ? 'has-prepayment' : ''}>
                                <td className="month-cell">{row.month}</td>
                                <td className="remaining-debt">{formatMoney(row.remainingDebt)}</td>
                                <td className="interest-cell">{formatMoney(row.interest)}</td>
                                <td className="principal-cell">{formatMoney(row.principal)}</td>
                                <td className="payment-principal">{formatMoney(row.principal)}</td>
                                <td className="payment-interest">{formatMoney(row.interest)}</td>
                                <td className="payment-total">{formatMoney(row.payment)}</td>
                                
                                {/* Новая процентная ставка */}
                                <td className="new-rate-cell">
                                    <input 
                                        type="number"
                                        className="loan-input-small"
                                        placeholder="%"
                                        step="0.1"
                                        value={prepaymentData.newRate || ''}
                                        onChange={(e) => handleNewRateChange(row.month, parseFloat(e.target.value))}
                                    />
                                </td>
                                
                                {/* Сумма досрочного погашения */}
                                <td className="prepayment-cell">
                                    <input 
                                        type="number"
                                        className="loan-input-small"
                                        placeholder="₽"
                                        step="1000"
                                        value={prepaymentData.amount || ''}
                                        onChange={(e) => handlePrepaymentAmountChange(row.month, parseFloat(e.target.value))}
                                    />
                                </td>
                                
                                {/* Способ пересчета - показываем только если есть сумма досрочного погашения */}
                                <td className="recalc-cell">
                                    {showRecalcSelect ? (
                                        <select 
                                            className="loan-select-small"
                                            value={prepaymentData.recalcType || 'payment'}
                                            onChange={(e) => handleRecalcTypeChange(row.month, e.target.value)}
                                        >
                                            <option value="payment">📉 Платеж</option>
                                            <option value="term">📅 Срок кредита</option>
                                        </select>
                                    ) : (
                                        <span className="empty-recalc">—</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                    
                    {/* Заполняем оставшиеся месяцы, если график короче срока */}
                    {schedule.length < months && (
                        Array.from({ length: months - schedule.length }).map((_, idx) => {
                            const monthNumber = schedule.length + idx + 1;
                            return (
                                <tr key={monthNumber} className="empty-row">
                                    <td className="month-cell">{monthNumber}</td>
                                    <td colSpan="9" className="empty-cell">Кредит погашен досрочно</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LoanTable;