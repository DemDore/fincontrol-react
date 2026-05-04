import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const fixUserName = async () => {
    const db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    // Обновляем имя пользователя
    await db.run('UPDATE users SET name = ? WHERE email = ?', ['Дарья', 'newuser1@test.com']);
    
    // Проверяем
    const user = await db.get('SELECT * FROM users WHERE email = ?', ['newuser1@test.com']);
    console.log('Обновлённый пользователь:', user);
    
    await db.close();
};

fixUserName();