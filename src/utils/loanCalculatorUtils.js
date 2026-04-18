// Расчет аннуитетного платежа
export function calculateAnnuityPayment(loanAmount, annualRate, months) {
    if (loanAmount <= 0) return 0;
    const monthlyRate = annualRate / 12 / 100;
    if (monthlyRate === 0) return loanAmount / months;
    const annuity = monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return loanAmount * annuity;
}

// Расчет графика платежей с поддержкой досрочного погашения
export function calculatePaymentSchedule(loanAmount, annualRate, months, prepayments = {}) {
    const monthlyRate = annualRate / 12 / 100;
    let remainingDebt = loanAmount;
    let schedule = [];
    let totalInterest = 0;
    let currentMonthlyPayment = calculateAnnuityPayment(loanAmount, annualRate, months);
    let currentMonthsLeft = months;
    let effectiveRate = annualRate;
    
    // Сортируем досрочные погашения по месяцам
    const sortedPrepayments = Object.entries(prepayments)
        .filter(([_, data]) => data && data.amount > 0)
        .map(([month, data]) => ({
            month: parseInt(month),
            amount: data.amount,
            newRate: data.newRate,
            recalcType: data.recalcType
        }))
        .sort((a, b) => a.month - b.month);
    
    let paymentSchedule = [];
    let currentMonth = 1;
    let lastPrepaymentProcessed = false;
    
    while (remainingDebt > 0.01 && currentMonth <= 600) { // Максимум 50 лет
        // Проверяем, есть ли досрочное погашение в этом месяце
        const prepayment = sortedPrepayments.find(p => p.month === currentMonth);
        if (prepayment && !prepayment.recalcType) {
            prepayment.recalcType = 'payment';
        }
        // Расчет процентов за текущий месяц
        const interest = remainingDebt * monthlyRate;
        let principal = currentMonthlyPayment - interest;
        if (principal < 0) principal = 0;
        
        let payment = currentMonthlyPayment;
        let actualPrincipal = principal;
        let actualPrepayment = 0;
        
        // Если есть досрочное погашение
        if (prepayment && prepayment.amount > 0 && !lastPrepaymentProcessed) {
            actualPrepayment = prepayment.amount;
            
            // Применяем досрочное погашение
            remainingDebt = remainingDebt - actualPrincipal - actualPrepayment;
            if (remainingDebt < 0) {
                actualPrincipal = actualPrincipal + remainingDebt;
                payment = interest + actualPrincipal;
                remainingDebt = 0;
            }
            
            // Применяем новую процентную ставку если есть
            if (prepayment.newRate && prepayment.newRate > 0) {
                effectiveRate = prepayment.newRate;
                const newMonthlyRate = effectiveRate / 12 / 100;
                const remainingMonths = currentMonthsLeft - currentMonth;
                
                if (prepayment.recalcType === 'payment' && remainingDebt > 0 && remainingMonths > 0) {
                    // Пересчет платежа (срок остается)
                    if (newMonthlyRate === 0) {
                        currentMonthlyPayment = remainingDebt / remainingMonths;
                    } else {
                        const annuity = newMonthlyRate * Math.pow(1 + newMonthlyRate, remainingMonths) / (Math.pow(1 + newMonthlyRate, remainingMonths) - 1);
                        currentMonthlyPayment = remainingDebt * annuity;
                    }
                } else if (prepayment.recalcType === 'term' && remainingDebt > 0 && currentMonthlyPayment > 0) {
                    // Пересчет срока (платеж остается)
                    if (newMonthlyRate === 0) {
                        currentMonthsLeft = currentMonth + Math.ceil(remainingDebt / currentMonthlyPayment);
                    } else {
                        const ratio = currentMonthlyPayment / (currentMonthlyPayment - remainingDebt * newMonthlyRate);
                        if (ratio > 0) {
                            const newMonths = Math.ceil(Math.log(ratio) / Math.log(1 + newMonthlyRate));
                            currentMonthsLeft = currentMonth + newMonths;
                        }
                    }
                }
            }
            
            lastPrepaymentProcessed = true;
        } else {
            // Обычный платеж без досрочного погашения
            remainingDebt = remainingDebt - actualPrincipal;
            if (remainingDebt < 0) {
                actualPrincipal = actualPrincipal + remainingDebt;
                payment = interest + actualPrincipal;
                remainingDebt = 0;
            }
        }
        
        totalInterest += interest;
        
        paymentSchedule.push({
            month: currentMonth,
            remainingDebt: Math.max(0, remainingDebt),
            interest: interest,
            principal: actualPrincipal,
            payment: payment,
            hasPrepayment: !!prepayment,
            prepaymentAmount: actualPrepayment,
            newRate: prepayment?.newRate || null,
            recalcType: prepayment?.recalcType || null
        });
        
        if (remainingDebt <= 0.01) break;
        currentMonth++;
    }
    
    return { 
        schedule: paymentSchedule, 
        totalInterest, 
        monthlyPayment: currentMonthlyPayment,
        actualMonths: paymentSchedule.length
    };
}

// Форматирование денег
export function formatMoney(value) {
    if (isNaN(value) || value === null || value === undefined) return '0.00 ₽';
    return new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value) + ' ₽';
}

// Форматирование процентов
export function formatPercent(value) {
    if (isNaN(value)) return '0%';
    return value.toFixed(2) + '%';
}