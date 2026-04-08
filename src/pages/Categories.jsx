import { useState, useEffect } from 'react';
import CategoryTabs from '../components/Categories/CategoryTabs';
import CategoryModal from '../components/Categories/CategoryModal';
import CategoriesList from '../components/Categories/CategoriesList';
import '../styles/categories.css';

// Ключи для localStorage
const STORAGE_KEYS = {
    EXPENSE_CATEGORIES: 'fincontrol_expense_categories',
    INCOME_CATEGORIES: 'fincontrol_income_categories'
};

// Начальные категории расходов
const defaultExpenseCategories = [
    { id: 1, name: '🍔 Еда', icon: '🍔', budget: 15000 },
    { id: 2, name: '🚗 Транспорт', icon: '🚗', budget: 5000 },
    { id: 3, name: '🏠 Жильё', icon: '🏠', budget: 20000 },
    { id: 4, name: '🛍️ Шопинг', icon: '🛍️', budget: 10000 },
    { id: 5, name: '🎮 Развлечения', icon: '🎮', budget: 5000 },
    { id: 6, name: '💊 Здоровье', icon: '💊', budget: 3000 },
    { id: 7, name: '📚 Образование', icon: '📚', budget: 5000 }
];

// Начальные категории доходов
const defaultIncomeCategories = [
    { id: 1, name: '💼 Зарплата', icon: '💼' },
    { id: 2, name: '📈 Инвестиции', icon: '📈' },
    { id: 3, name: '🎁 Подарки', icon: '🎁' },
    { id: 4, name: '💸 Фриланс', icon: '💸' }
];

function Categories() {
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('expense');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Загрузка категорий при монтировании
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        // Загрузка категорий расходов
        const savedExpense = localStorage.getItem(STORAGE_KEYS.EXPENSE_CATEGORIES);
        if (savedExpense) {
            setExpenseCategories(JSON.parse(savedExpense));
        } else {
            setExpenseCategories(defaultExpenseCategories);
            localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(defaultExpenseCategories));
        }

        // Загрузка категорий доходов
        const savedIncome = localStorage.getItem(STORAGE_KEYS.INCOME_CATEGORIES);
        if (savedIncome) {
            setIncomeCategories(JSON.parse(savedIncome));
        } else {
            setIncomeCategories(defaultIncomeCategories);
            localStorage.setItem(STORAGE_KEYS.INCOME_CATEGORIES, JSON.stringify(defaultIncomeCategories));
        }
    };

    // Сохранение категорий расходов
    const saveExpenseCategories = (categories) => {
        localStorage.setItem(STORAGE_KEYS.EXPENSE_CATEGORIES, JSON.stringify(categories));
        setExpenseCategories(categories);
    };

    // Сохранение категорий доходов
    const saveIncomeCategories = (categories) => {
        localStorage.setItem(STORAGE_KEYS.INCOME_CATEGORIES, JSON.stringify(categories));
        setIncomeCategories(categories);
    };

    // Сохранение (добавление или редактирование)
    const handleSave = (categoryData) => {
        if (activeTab === 'expense') {
            let newCategories;
            if (editingCategory) {
                newCategories = expenseCategories.map(c =>
                    c.id === editingCategory.id
                        ? { ...categoryData, id: c.id }
                        : c
                );
            } else {
                const newId = Math.max(0, ...expenseCategories.map(c => c.id), 0) + 1;
                newCategories = [{ ...categoryData, id: newId }, ...expenseCategories];
            }
            saveExpenseCategories(newCategories);
        } else {
            let newCategories;
            if (editingCategory) {
                newCategories = incomeCategories.map(c =>
                    c.id === editingCategory.id
                        ? { ...categoryData, id: c.id }
                        : c
                );
            } else {
                const newId = Math.max(0, ...incomeCategories.map(c => c.id), 0) + 1;
                newCategories = [{ ...categoryData, id: newId }, ...incomeCategories];
            }
            saveIncomeCategories(newCategories);
        }
        
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    // Редактирование категории
    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    // Удаление категории
    const handleDelete = (id) => {
        if (confirm('Удалить эту категорию? Транзакции с этой категорией останутся, но категория будет удалена из списка.')) {
            if (activeTab === 'expense') {
                const filtered = expenseCategories.filter(c => c.id !== id);
                saveExpenseCategories(filtered);
            } else {
                const filtered = incomeCategories.filter(c => c.id !== id);
                saveIncomeCategories(filtered);
            }
        }
    };

    // Сброс к стандартным категориям
    const handleResetDefaults = () => {
        const confirmMessage = activeTab === 'expense' 
            ? 'Сбросить все категории расходов к стандартным? Все ваши изменения будут потеряны.'
            : 'Сбросить все категории доходов к стандартным? Все ваши изменения будут потеряны.';
        
        if (confirm(confirmMessage)) {
            if (activeTab === 'expense') {
                saveExpenseCategories(defaultExpenseCategories);
            } else {
                saveIncomeCategories(defaultIncomeCategories);
            }
        }
    };

    const currentCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    const currentTitle = activeTab === 'expense' ? 'Категории расходов' : 'Категории доходов';
    const currentIcon = activeTab === 'expense' ? '💸' : '📈';

    return (
        <div className="content">
            <div className="page-header">
                <h1>Управление категориями</h1>
                <button 
                    className="btn-primary" 
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Добавить категорию
                </button>
            </div>

            <CategoryTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onReset={handleResetDefaults}
            />

            <CategoriesList 
                categories={currentCategories}
                type={activeTab}
                onEdit={handleEdit}
                onDelete={handleDelete}
                title={currentTitle}
                icon={currentIcon}
            />

            <CategoryModal 
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                }}
                onSave={handleSave}
                category={editingCategory}
                type={activeTab}
            />
        </div>
    );
}

export default Categories;