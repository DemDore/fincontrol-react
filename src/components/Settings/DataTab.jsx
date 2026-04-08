import { useState } from 'react';
import { getTransactions, saveTransactions } from '../../utils/storage';
import DeleteDataModal from './DeleteDataModal';

const DataTab = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleExport = (format) => {
        const transactions = getTransactions();
        let data, filename, mimeType;
        
        if (format === 'csv') {
            const headers = ['Дата', 'Тип', 'Категория', 'Описание', 'Сумма'];
            const rows = transactions.map(t => [
                t.date,
                t.type === 'income' ? 'Доход' : 'Расход',
                t.category,
                t.description || '',
                t.amount
            ]);
            const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
            data = csv;
            filename = 'transactions.csv';
            mimeType = 'text/csv';
        } else {
            data = JSON.stringify(transactions, null, 2);
            filename = 'transactions.json';
            mimeType = 'application/json';
        }
        
        const blob = new Blob([data], { type: `${mimeType};charset=utf-8;` });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert(`Данные экспортированы в файл ${filename}`);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let importedData;
                
                if (file.name.endsWith('.csv')) {
                    const lines = content.split('\n');
                    const headers = lines[0].split(',');
                    importedData = lines.slice(1).filter(l => l.trim()).map(line => {
                        const values = line.split(',');
                        return {
                            id: Date.now() + Math.random(),
                            date: values[0],
                            type: values[1] === 'Доход' ? 'income' : 'expense',
                            category: values[2],
                            description: values[3],
                            amount: parseFloat(values[4])
                        };
                    });
                } else {
                    importedData = JSON.parse(content);
                }
                
                const existingTransactions = getTransactions();
                const allTransactions = [...importedData, ...existingTransactions];
                saveTransactions(allTransactions);
                alert(`Импортировано ${importedData.length} транзакций!`);
                window.location.reload();
            } catch (error) {
                alert('Ошибка при импорте файла');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="settings-card">
            <h2>💾 Управление данными</h2>
            
            <div className="settings-section">
                <label>📥 Импорт данных</label>
                <div className="import-area">
                    <input 
                        type="file"
                        id="import-file"
                        accept=".csv,.json"
                        onChange={handleImport}
                        style={{ display: 'none' }}
                    />
                    <button className="btn-secondary" onClick={() => document.getElementById('import-file').click()}>
                        📁 Выбрать файл CSV/JSON
                    </button>
                    <p className="setting-description">Поддерживается формат CSV, экспортированный из приложения</p>
                </div>
            </div>

            <div className="settings-section">
                <label>📤 Экспорт данных</label>
                <div className="export-buttons">
                    <button className="btn-outline" onClick={() => handleExport('csv')}>
                        📎 Экспорт в CSV
                    </button>
                    <button className="btn-outline" onClick={() => handleExport('json')}>
                        📎 Экспорт в JSON
                    </button>
                </div>
            </div>

            <div className="danger-zone">
                <div className="danger-zone-header">
                    <span>⚠️ Опасная зона</span>
                </div>
                <div className="danger-zone-content">
                    <div className="danger-info">
                        <strong>Удалить все данные</strong>
                        <p>Все транзакции, категории и бюджеты будут удалены безвозвратно</p>
                    </div>
                    <button className="btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
                        🗑️ Очистить все данные
                    </button>
                </div>
            </div>

            <DeleteDataModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        </div>
    );
};

export default DataTab;