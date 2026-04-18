import { useState, useEffect } from 'react';
import { 
    getExpenseCategories, 
    getIncomeCategories,
    saveExpenseCategories,
    saveIncomeCategories,
    addExpenseCategory,
    addIncomeCategory,
    updateExpenseCategory,
    updateIncomeCategory,
    deleteExpenseCategory,
    deleteIncomeCategory
} from '../utils/categoriesUtils';
import CategoryTabs from '../components/Categories/CategoryTabs';
import CategoryModal from '../components/Categories/CategoryModal';
import CategoriesList from '../components/Categories/CategoriesList';
import '../styles/categories.css';

// Начальные категории для сброса
const defaultExpenseCategories = [
    { id: 1, name: '🍔 Еда', icon: '🍔', budget: 15000 },
    { id: 2, name: '🚗 Транспорт', icon: '🚗', budget: 5000 },
    { id: 3, name: '🏠 Жильё', icon: '🏠', budget: 20000 },
    { id: 4, name: '🛍️ Шопинг', icon: '🛍️', budget: 10000 },
    { id: 5, name: '🎮 Развлечения', icon: '🎮', budget: 5000 },
    { id: 6, name: '💊 Здоровье', icon: '💊', budget: 3000 },
    { id: 7, name: '📚 Образование', icon: '📚', budget: 5000 }
];

const defaultIncomeCategories = [
    { id: 1, name: '💼 Зарплата', icon: '💼' },
    { id: 2, name: '📈 Инвестиции', icon: '📈' },
    { id: 3, name: '🎁 Подарки', icon: '🎁' },
    { id: 4, name: '💸 Фриланс', icon: '💸' }
];

const Categories = () => {
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('expense');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = () => {
        setExpenseCategories(getExpenseCategories());
        setIncomeCategories(getIncomeCategories());
    };

    const handleSave = (categoryData) => {
        if (activeTab === 'expense') {
            if (editingCategory) {
                updateExpenseCategory(editingCategory.id, categoryData);
            } else {
                addExpenseCategory(categoryData);
            }
        } else {
            if (editingCategory) {
                updateIncomeCategory(editingCategory.id, categoryData);
            } else {
                addIncomeCategory(categoryData);
            }
        }
        loadCategories();
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Удалить эту категорию? Транзакции с этой категорией останутся, но категория будет удалена из списка.')) {
            if (activeTab === 'expense') {
                deleteExpenseCategory(id);
            } else {
                deleteIncomeCategory(id);
            }
            loadCategories();
        }
    };

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
            loadCategories();
        }
    };

    const currentCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    const currentTitle = activeTab === 'expense' ? 'Категории расходов' : 'Категории доходов';
    const currentIcon = activeTab === 'expense' ? '💸' : '📈';

    return (
        <div className="content">
            <div className="page-header">
                <h1>Управление категориями</h1>
                <button className="btn-primary" onClick={() => {
                    setEditingCategory(null);
                    setIsModalOpen(true);
                }}>
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
};

export default Categories;