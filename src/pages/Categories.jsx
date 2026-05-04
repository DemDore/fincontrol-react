import { useState, useEffect } from 'react';
import { 
    getExpenseCategories, 
    getIncomeCategories,
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

const Categories = () => {
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('expense');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const [expense, income] = await Promise.all([
                getExpenseCategories(),
                getIncomeCategories()
            ]);
            setExpenseCategories(expense);
            setIncomeCategories(income);
        } catch (error) {
            console.error('Ошибка загрузки категорий:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (categoryData) => {
        try {
            if (activeTab === 'expense') {
                if (editingCategory) {
                    await updateExpenseCategory(editingCategory.id, categoryData);
                } else {
                    await addExpenseCategory(categoryData);
                }
            } else {
                if (editingCategory) {
                    await updateIncomeCategory(editingCategory.id, categoryData);
                } else {
                    await addIncomeCategory(categoryData);
                }
            }
            await loadCategories();
            setIsModalOpen(false);
            setEditingCategory(null);
            window.dispatchEvent(new Event('categoriesUpdated'));
        } catch (error) {
            console.error('Ошибка сохранения категории:', error);
            alert('Ошибка при сохранении категории');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Удалить эту категорию? Транзакции с этой категорией останутся, но категория будет удалена из списка.')) {
            try {
                if (activeTab === 'expense') {
                    await deleteExpenseCategory(id);
                } else {
                    await deleteIncomeCategory(id);
                }
                await loadCategories();
                window.dispatchEvent(new Event('categoriesUpdated'));
            } catch (error) {
                console.error('Ошибка удаления категории:', error);
                alert('Ошибка при удалении категории');
            }
        }
    };

    const handleResetDefaults = () => {
        alert('Сброс к стандартным категориям будет доступен позже');
    };

    const currentCategories = activeTab === 'expense' ? expenseCategories : incomeCategories;
    const currentTitle = activeTab === 'expense' ? 'Категории расходов' : 'Категории доходов';
    const currentIcon = activeTab === 'expense' ? '💸' : '📈';

    if (loading) {
        return <div className="content">Загрузка категорий...</div>;
    }

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