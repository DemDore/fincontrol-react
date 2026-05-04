import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const deleteUser = async () => {
    const db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    // Сначала покажем всех пользователей
    console.log('\n========== ВСЕ ПОЛЬЗОВАТЕЛИ ==========');
    const allUsers = await db.all('SELECT * FROM users');
    console.table(allUsers);

    // ВАШ ВЫБОР - УКАЖИТЕ ID ПОЛЬЗОВАТЕЛЯ КОТОРОГО ХОТИТЕ УДАЛИТЬ
    // По таблице выше видно:
    // id 1: тест
    // id 2: newuser@test.com  
    // id 3: Дарья (doreza@test.com)
    
    const userIdToDelete = 2;  // <-- МЕНЯЙТЕ ЗДЕСЬ: 1, 2 или 3
    
    const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [userIdToDelete]);
    
    if (user) {
        console.log(`\n🗑️ Удаляем пользователя: ${user.name} (${user.email})`);
        
        await db.run('DELETE FROM transactions WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM categories WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM budgets WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM notes WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM goals WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM user_settings WHERE user_id = ?', [user.id]);
        await db.run('DELETE FROM users WHERE id = ?', [user.id]);
        
        console.log(`✅ Пользователь ${user.email} и все его данные удалены`);
    } else {
        console.log(`❌ Пользователь с id ${userIdToDelete} не найден`);
    }
    
    // Показываем оставшихся пользователей
    console.log('\n========== ОСТАВШИЕСЯ ПОЛЬЗОВАТЕЛИ ==========');
    const remainingUsers = await db.all('SELECT id, name, email FROM users');
    console.table(remainingUsers);
    
    await db.close();
};

deleteUser();