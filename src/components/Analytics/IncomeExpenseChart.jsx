import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { formatNumber } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const IncomeExpenseChart = ({ chartData, chartType }) => {
    const labels = chartData.map(d => d.name || d.date || d.label);
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
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#116466',
                pointBorderColor: '#FFFFFF',
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBorderWidth: 2,
                type: chartType === 'bar' ? 'bar' : 'line'
            },
            {
                label: 'Расходы',
                data: expenseData,
                borderColor: '#FFCB9A',
                backgroundColor: 'rgba(255, 203, 154, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#FFCB9A',
                pointBorderColor: '#FFFFFF',
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBorderWidth: 2,
                type: chartType === 'bar' ? 'bar' : 'line'
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
                        return `${context.dataset.label}: ${formatNumber(context.raw)} ₽`;
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
                    callback: (value) => formatNumber(value) + ' ₽'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#A8B3B0',
                    maxRotation: 45,
                    minRotation: 45
                }
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