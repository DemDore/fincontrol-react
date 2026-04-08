const FrequentTransactions = ({ frequent }) => {
    const maxCount = frequent.length > 0 ? frequent[0].count : 1;

    return (
        <div className="frequent-transactions">
            <h3>🔥 Частота транзакций</h3>
            <div className="frequent-list">
                {frequent.map((item, index) => {
                    const percent = (item.count / maxCount) * 100;
                    return (
                        <div key={index} className="frequent-item">
                            <div className="frequent-rank">#{index + 1}</div>
                            <div className="frequent-name">{item.name}</div>
                            <div className="frequent-count">{item.count} раз</div>
                            <div className="frequent-bar-container">
                                <div 
                                    className="frequent-bar"
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FrequentTransactions;