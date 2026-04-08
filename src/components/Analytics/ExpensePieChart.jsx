import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { formatNumber } from '../../utils/formatters';
import { categoryColors } from '../../data/mockData';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePieChart = ({ expenses }) => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const data = {
        labels: expenses.map(e => e.name.replace(/^[^\s]+\s/, '')),
        datasets: [
            {
                data: expenses.map(e => e.amount),
                backgroundColor: expenses.map((_, i) => {
                    const colors = ['#116466', '#FFCB9A', '#D9B08C', '#148a8c', '#FF6B6B', '#6B7A6F'];
                    return colors[i % colors.length];
                }),
                borderColor: '#1a1f1e',
                borderWidth: 2,
                borderRadius: 8,
                spacing: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#A8B3B0',
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle'
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
                        const value = context.raw;
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${formatNumber(value)} ₽ (${percent}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="pie-chart-container">
            <Pie data={data} options={options} />
        </div>
    );
};

export default ExpensePieChart;