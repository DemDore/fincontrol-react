import { useState, useEffect } from 'react';
import { calculatePaymentSchedule, formatMoney } from '../../utils/loanCalculatorUtils';
import LoanTable from './LoanTable';
import LoanSummary from './LoanSummary';

const LoanCalculator = () => {
    const [loanAmount, setLoanAmount] = useState(1000000);
    const [interestRate, setInterestRate] = useState(12);
    const [loanTerm, setLoanTerm] = useState(5);
    const [prepayments, setPrepayments] = useState({});
    const [schedule, setSchedule] = useState([]);
    const [totalInterest, setTotalInterest] = useState(0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalPrepayment, setTotalPrepayment] = useState(0);
    const [actualMonths, setActualMonths] = useState(0);

    useEffect(() => {
        calculate();
    }, [loanAmount, interestRate, loanTerm, prepayments]);

    const calculate = () => {
        const months = loanTerm * 12;
        const { schedule: newSchedule, totalInterest: newTotalInterest, monthlyPayment: newMonthlyPayment, actualMonths: newActualMonths } = 
            calculatePaymentSchedule(loanAmount, interestRate, months, prepayments);
        
        setSchedule(newSchedule || []);
        setTotalInterest(newTotalInterest || 0);
        setMonthlyPayment(newMonthlyPayment || 0);
        setActualMonths(newActualMonths || 0);
        
        // Считаем общую сумму досрочных погашений
        const total = Object.values(prepayments).reduce((sum, data) => sum + (data?.amount || 0), 0);
        setTotalPrepayment(total);
    };

    const handlePrepaymentChange = (month, amount, newRate, recalcType) => {
        setPrepayments(prev => ({
            ...prev,
            [month]: { amount: amount || 0, newRate: newRate || null, recalcType: recalcType || 'payment' }
        }));
    };

    return (
        <div className="loan-calculator">
            <div className="loan-calculator-header">
                <h1>📊 График погашения кредита</h1>
                <p className="loan-disclaimer">
                    * Расчеты в графике являются предварительными и носят информационный характер. 
                    Фактические платежи могут отличаться из-за дат списания, округлений и индивидуальных условий банка. 
                    
                </p>
            </div>

            <div className="loan-inputs">
                <div className="loan-input-group">
                    <label>💰 Сумма кредита</label>
                    <input 
                        type="number"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        step="10000"
                    />
                </div>
                <div className="loan-input-group">
                    <label>📈 Процентная ставка</label>
                    <input 
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        step="0.1"
                    />
                </div>
                <div className="loan-input-group">
                    <label>⏱️ Срок кредита</label>
                    <input 
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        step="1"
                    />
                </div>
                <div className="loan-input-group">
                    <label>📅 Лет</label>
                    <span className="loan-input-suffix"></span>
                </div>
            </div>

            <div className="loan-summary-wrapper">
                <LoanSummary 
                    monthlyPayment={monthlyPayment}
                    totalInterest={totalInterest}
                    totalPrepayment={totalPrepayment}
                    loanAmount={loanAmount}
                    schedule={schedule}
                    actualMonths={actualMonths}
                    originalMonths={loanTerm * 12}
                />
            </div>

            <div className="loan-table-wrapper">
                <LoanTable 
                    schedule={schedule}
                    loanTerm={loanTerm}
                    prepayments={prepayments}
                    onPrepaymentChange={handlePrepaymentChange}
                />
            </div>
        </div>
    );
};

export default LoanCalculator;