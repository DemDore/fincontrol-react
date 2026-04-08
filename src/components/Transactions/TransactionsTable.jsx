import { formatNumber, formatDate } from '../../utils/formatters';

const TransactionsTable = ({ transactions, onEdit, onDelete }) => {
    if (transactions.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>Нет транзакций</h3>
                <p>Добавьте первую транзакцию, чтобы начать учёт финансов</p>
            </div>
        );
    }

    return (
        <div className="transactions-table-container">
            <table className="transactions-table">
                <thead>
                    <tr>
                        <th>Дата</th>
                        <th>Категория</th>
                        <th>Описание</th>
                        <th>Сумма</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction.id}>
                            <td>{formatDate(transaction.date)}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.description || '—'}</td>
                            <td className={`transaction-amount-cell ${transaction.type}`}>
                                {transaction.type === 'income' ? '+' : '-'} {formatNumber(transaction.amount)} ₽
                            </td>
                            <td className="action-buttons">
                                <button 
                                    className="edit-btn" 
                                    onClick={() => onEdit(transaction)}
                                    title="Редактировать"
                                >
                                    ✏️
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => onDelete(transaction.id)}
                                    title="Удалить"
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;