import { formatMoney } from '../../utils/loanCalculatorUtils';

const LoanSummary = ({ monthlyPayment, totalInterest, totalPrepayment, loanAmount, schedule, actualMonths, originalMonths }) => {
    const totalPayment = loanAmount + totalInterest;
    const finalPayment = totalPayment - totalPrepayment;
    
    // Расчет сокращения срока
    const termReduction = originalMonths - actualMonths;
    
    // Расчет остатка после досрочных погашений
    const remainingAfterPrepayment = finalPayment;

    return (
        <div className="loan-summary">
            <div className="loan-summary-card">
                <h3> Сводка по кредиту</h3>
                <div className="loan-summary-grid">
                    <div className="summary-item">
                        <span className="summary-label">Ежемесячный платеж:</span>
                        <span className="summary-value highlight">{formatMoney(monthlyPayment)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Сумма процентов за весь срок:</span>
                        <span className="summary-value">{formatMoney(totalInterest)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Общая сумма выплат:</span>
                        <span className="summary-value">{formatMoney(totalPayment)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Итого досрочного погашения:</span>
                        <span className="summary-value prepayment">{formatMoney(totalPrepayment)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Остаток после досрочных:</span>
                        <span className="summary-value">{formatMoney(remainingAfterPrepayment)}</span>
                    </div>
                    {termReduction > 0 && (
                        <div className="summary-item">
                            <span className="summary-label">Сокращение срока:</span>
                            <span className="summary-value highlight">{termReduction} мес. ({Math.floor(termReduction / 12)} г. {termReduction % 12} мес.)</span>
                        </div>
                    )}
                    {actualMonths > 0 && originalMonths > 0 && actualMonths !== originalMonths && (
                        <div className="summary-item">
                            <span className="summary-label">Новый срок кредита:</span>
                            <span className="summary-value highlight">{actualMonths} мес. ({Math.floor(actualMonths / 12)} г. {actualMonths % 12} мес.)</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanSummary;