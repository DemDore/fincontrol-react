import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { useCurrency } from '../../hooks/useCurrency';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Chart = ({ transactions, period, onPeriodChange }) => {
    const { formatCurrency } = useCurrency();

    const groupByMonth = (transactionsList, monthsCount = 6) => {
        const months = [];
        const now = new Date();
        
        for (let i = monthsCount - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
            months.push({
                name: monthName,
                year: date.getFullYear(),
                month: date.getMonth(),
                income: 0,
                expense: 0
            });
        }
        
        transactionsList.forEach(t => {
            const date = new Date(t.date);
            const monthIndex = months.findIndex(m => m.year === date.getFullYear() && m.month === date.getMonth());
            if (monthIndex !== -1) {
                if (t.type === 'income') {
                    months[monthIndex].income += t.amount;
                } else {
                    months[monthIndex].expense += t.amount;
                }
            }
        });
        
        return months;
    };

    const groupByMonthOfYear = (transactionsList, year) => {
        const months = [];
        for (let i = 0; i < 12; i++) {
            const monthName = new Date(year, i, 1).toLocaleDateString('ru-RU', { month: 'short' });
            months.push({
                name: monthName,
                month: i,
                income: 0,
                expense: 0
            });
        }
        
        transactionsList.forEach(t => {
            const date = new Date(t.date);
            if (date.getFullYear() === year) {
                const monthIndex = date.getMonth();
                if (t.type === 'income') {
                    months[monthIndex].income += t.amount;
                } else {
                    months[monthIndex].expense += t.amount;
                }
            }
        });
        
        return months;
    };

    const groupByDayOfMonth = (transactionsList, year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                name: `${i}`,
                date: `${i}.${month + 1}`,
                income: 0,
                expense: 0
            });
        }
        
        transactionsList.forEach(t => {
            const date = new Date(t.date);
            if (date.getFullYear() === year && date.getMonth() === month) {
                const dayIndex = date.getDate() - 1;
                if (dayIndex >= 0 && dayIndex < days.length) {
                    if (t.type === 'income') {
                        days[dayIndex].income += t.amount;
                    } else {
                        days[dayIndex].expense += t.amount;
                    }
                }
            }
        });
        
        return days;
    };

    const getChartData = () => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        switch(period) {
            case 'month':
                return groupByDayOfMonth(transactions, currentYear, currentMonth);
            case 'quarter':
                return groupByMonthOfYear(transactions, currentYear).slice(0, 3);
            case 'year':
                return groupByMonthOfYear(transactions, currentYear);
            default:
                return groupByMonth(transactions, 6);
        }
    };

    const chartData = getChartData();
    const labels = chartData.map(d => d.name);
    const incomeData = chartData.map(d => d.income);
    const expenseData = chartData.map(d => d.expense);

    const data = {
        labels,
        datasets: [
            {
                label: 'Доходы',
                data: incomeData,
                borderColor: '#116466',
                backgroundColor: 'rgba(17, 100, 102, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#116466',
                pointBorderColor: '#FFFFFF',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBorderWidth: 2
            },
            {
                label: 'Расходы',
                data: expenseData,
                borderColor: '#FFCB9A',
                backgroundColor: 'rgba(255, 203, 154, 0.05)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#FFCB9A',
                pointBorderColor: '#FFFFFF',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBorderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#A8B3B0',
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: '#242a28',
                titleColor: '#FFFFFF',
                bodyColor: '#A8B3B0',
                borderColor: '#116466',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#A8B3B0',
                    callback: (value) => formatCurrency(value)
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#A8B3B0'
                }
            }
        }
    };

    const getChartTitle = () => {
        switch(period) {
            case 'month':
                const now = new Date();
                const monthName = now.toLocaleDateString('ru-RU', { month: 'long' });
                return `Динамика доходов и расходов за ${monthName}`;
            case 'quarter':
                return 'Динамика доходов и расходов за квартал';
            case 'year':
                return 'Динамика доходов и расходов по месяцам года';
            default:
                return 'Динамика доходов и расходов за последние 6 месяцев';
        }
    };

    return (
        <div className="chart-section">
            <div className="section-header">
                <h2>{getChartTitle()}</h2>
                <div className="period-selector">
                    <button 
                        className={`period-btn ${period === 'month' ? 'active' : ''}`}
                        onClick={() => onPeriodChange('month')}
                    >
                        Месяц
                    </button>
                    <button 
                        className={`period-btn ${period === 'quarter' ? 'active' : ''}`}
                        onClick={() => onPeriodChange('quarter')}
                    >
                        Квартал
                    </button>
                    <button 
                        className={`period-btn ${period === 'year' ? 'active' : ''}`}
                        onClick={() => onPeriodChange('year')}
                    >
                        Год
                    </button>
                    <button 
                        className={`period-btn ${period === 'all' ? 'active' : ''}`}
                        onClick={() => onPeriodChange('all')}
                    >
                        Все
                    </button>
                </div>
            </div>
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default Chart;