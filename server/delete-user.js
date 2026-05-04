import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const deleteUser = async () => {
    const db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    const email = 'user@test.com'; // <-- Укажите email пользователя для удаления
    
    // Сначала удаляем все связанные данные
    const user = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    
    if (user) {
        await db.run('DELETE FROM transactions WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM categories WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM budgets WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM notes WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM goals WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM user_settings WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM users WHERE id = ?', [user.id]);
        
        console.log(`✅ Пользователь ${email} и все его данные удалены`);
    } else {
        console.log(`❌ Пользователь ${email} не найден`);
    }
    
    await db.close();
};

deleteUser();