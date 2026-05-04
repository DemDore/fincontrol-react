import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const updateUser = async () => {
    const db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    const email = 'newuser1@test.com';  // <-- email пользователя
    const newName = 'Анна';              // <-- новое имя
    
    await db.run('UPDATE users SET name = ? WHERE email = ?', [newName, email]);
    
    const user = await db.get('SELECT id, name, email FROM users WHERE email = ?', [email]);
    console.log('Обновлённый пользователь:', user);
    
    await db.close();
};

updateUser();