import { Link } from 'react-router-dom';
import { formatNumber, formatDate } from '../../utils/formatters';

const RecentTransactions = ({ transactions }) => {
    const recent = transactions.slice(0, 5);

    return (
        <div className="recent-transactions">
            <div className="section-header">
                <h2>Последние транзакции</h2>
                <Link to="/transactions" className="view-all">Все транзакции →</Link>
            </div>
            <div className="transactions-list">
                {recent.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                        <div className="transaction-icon">{transaction.category.split(' ')[0]}</div>
                        <div className="transaction-details">
                            <div className="transaction-category">{transaction.category}</div>
                            <div className="transaction-date">{formatDate(transaction.date)}</div>
                        </div>
                        <div className={`transaction-amount ${transaction.type}`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatNumber(transaction.amount)} ₽
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTransactions;