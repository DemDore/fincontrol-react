import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { useCurrency } from '../../hooks/useCurrency';

const RecentTransactions = ({ transactions }) => {
    const { formatCurrency } = useCurrency();
    const recent = [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    if (recent.length === 0) {
        return (
            <div className="recent-transactions">
                <div className="section-header">
                    <h2>Последние транзакции</h2>
                    <Link to="/transactions" className="view-all">Все транзакции →</Link>
                </div>
                <div className="empty-transactions">
                    <p>Нет транзакций</p>
                    <p className="empty-hint">Добавьте первую транзакцию</p>
                </div>
            </div>
        );
    }

    return (
        <div className="recent-transactions">
            <div className="section-header">
                <h2>Последние транзакции</h2>
                <Link to="/transactions" className="view-all">Все транзакции →</Link>
            </div>
            <div className="transactions-list">
                {recent.map(transaction => (
                    <div key={transaction.id} className="transaction-item">
                        
                        <div className="transaction-details">
                            <div className="transaction-category">{transaction.category}</div>
                            <div className="transaction-date">{formatDate(transaction.date)}</div>
                        </div>
                        <div className={`transaction-amount ${transaction.type}`}>
                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentTransactions;