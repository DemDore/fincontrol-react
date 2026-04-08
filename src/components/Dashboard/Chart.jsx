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
import { formatNumber } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Chart = () => {
    const months = ['Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя'];
    const incomeData = [32000, 35000, 38000, 42000, 45000, 48000, 45200];
    const expenseData = [28000, 29500, 31000, 30500, 32800, 33500, 32150];

    const data = {
        labels: months,
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
                pointHoverRadius: 7
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
                pointHoverRadius: 7
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#A8B3B0', usePointStyle: true }
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
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#A8B3B0', callback: (value) => formatNumber(value) + ' ₽' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#A8B3B0' }
            }
        }
    };

    return (
        <div className="chart-section">
            <div className="section-header">
                <h2>Динамика доходов и расходов</h2>
                <div className="period-selector">
                    <button className="period-btn active">Месяц</button>
                    <button className="period-btn">Квартал</button>
                    <button className="period-btn">Год</button>
                </div>
            </div>
            <div className="chart-container">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default Chart;