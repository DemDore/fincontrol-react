import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const addDefaultCategories = async () => {
    const db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    // Укажите ID пользователя, которому нужно добавить категории
    const userId = 3;  // Дарья
    
    // Проверяем, есть ли уже категории у пользователя
    const existingCategories = await db.all('SELECT * FROM categories WHERE user_id = ?', [userId]);
    
    if (existingCategories.length > 0) {
        console.log(`У пользователя уже есть ${existingCategories.length} категорий. Хотите добавить недостающие?`);
        
        // Проверяем, каких категорий не хватает
        const existingNames = existingCategories.map(c => c.name);
        
        const defaultExpenseCategories = [
            { name: '🍔 Еда', icon: '🍔', budget: 15000 },
            { name: '🚗 Транспорт', icon: '🚗', budget: 5000 },
            { name: '🏠 Жильё', icon: '🏠', budget: 20000 },
            { name: '🛍️ Шопинг', icon: '🛍️', budget: 10000 },
            { name: '🎮 Развлечения', icon: '🎮', budget: 5000 },
            { name: '💊 Здоровье', icon: '💊', budget: 3000 },
            { name: '📚 Образование', icon: '📚', budget: 5000 }
        ];
        
        const defaultIncomeCategories = [
            { name: '💼 Зарплата', icon: '💼' },
            { name: '📈 Инвестиции', icon: '📈' },
            { name: '🎁 Подарки', icon: '🎁' },
            { name: '💸 Фриланс', icon: '💸' }
        ];
        
        let added = 0;
        
        // Добавляем недостающие категории расходов
        for (const cat of defaultExpenseCategories) {
            if (!existingNames.includes(cat.name)) {
                await db.run(
                    'INSERT INTO categories (user_id, type, name, icon, budget) VALUES (?, ?, ?, ?, ?)',
                    [userId, 'expense', cat.name, cat.icon, cat.budget]
                );
                console.log(`+ Добавлена категория расходов: ${cat.name}`);
                added++;
            }
        }
        
        // Добавляем недостающие категории доходов
        for (const cat of defaultIncomeCategories) {
            if (!existingNames.includes(cat.name)) {
                await db.run(
                    'INSERT INTO categories (user_id, type, name, icon, budget) VALUES (?, ?, ?, ?, ?)',
                    [userId, 'income', cat.name, cat.icon, null]
                );
                console.log(`+ Добавлена категория доходов: ${cat.name}`);
                added++;
            }
        }
        
        console.log(`\n✅ Добавлено ${added} новых категорий`);
        
    } else {
        // У пользователя нет категорий - создаём все
        console.log('У пользователя нет категорий. Создаём все категории по умолчанию...');
        
        const defaultExpenseCategories = [
            { name: '🍔 Еда', icon: '🍔', budget: 15000 },
            { name: '🚗 Транспорт', icon: '🚗', budget: 5000 },
            { name: '🏠 Жильё', icon: '🏠', budget: 20000 },
            { name: '🛍️ Шопинг', icon: '🛍️', budget: 10000 },
            { name: '🎮 Развлечения', icon: '🎮', budget: 5000 },
            { name: '💊 Здоровье', icon: '💊', budget: 3000 },
            { name: '📚 Образование', icon: '📚', budget: 5000 }
        ];
        
        const defaultIncomeCategories = [
            { name: '💼 Зарплата', icon: '💼' },
            { name: '📈 Инвестиции', icon: '📈' },
            { name: '🎁 Подарки', icon: '🎁' },
            { name: '💸 Фриланс', icon: '💸' }
        ];
        
        for (const cat of defaultExpenseCategories) {
            await db.run(
                'INSERT INTO categories (user_id, type, name, icon, budget) VALUES (?, ?, ?, ?, ?)',
                [userId, 'expense', cat.name, cat.icon, cat.budget]
            );
        }
        
        for (const cat of defaultIncomeCategories) {
            await db.run(
                'INSERT INTO categories (user_id, type, name, icon, budget) VALUES (?, ?, ?, ?, ?)',
                [userId, 'income', cat.name, cat.icon, null]
            );
        }
        
        console.log('✅ Добавлены все категории по умолчанию');
    }
    
    // Показываем итоговые категории
    console.log('\n========== ИТОГОВЫЕ КАТЕГОРИИ ==========');
    const finalCategories = await db.all('SELECT id, type, name, budget FROM categories WHERE user_id = ? ORDER BY type, name', [userId]);
    console.table(finalCategories);
    
    await db.close();
};

addDefaultCategories();