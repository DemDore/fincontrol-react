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

const IncomeExpenseChart = ({ monthlyData }) => {
    const { formatCurrency } = useCurrency();
    
    // Проверка на пустые данные
    if (!monthlyData || monthlyData.length === 0) {
        return (
            <div className="chart-container empty-chart">
                <p>Нет данных для отображения</p>
            </div>
        );
    }
    
    const labels = monthlyData.map(m => m.name);
    const incomeData = monthlyData.map(m => m.income || 0);
    const expenseData = monthlyData.map(m => m.expense || 0);

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
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#A8B3B0', callback: (value) => formatCurrency(value) }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#A8B3B0' }
            }
        }
    };

    return (
        <div className="chart-container">
            <Line data={data} options={options} />
        </div>
    );
};

export default IncomeExpenseChart;