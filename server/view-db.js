import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const viewDatabase = async () => {
    const db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    console.log('\n========== ПОЛЬЗОВАТЕЛИ ==========');
    const users = await db.all('SELECT id, name, email, created_at FROM users');
    console.table(users);

    console.log('\n========== ТРАНЗАКЦИИ (последние 10) ==========');
    const transactions = await db.all('SELECT id, user_id, type, amount, category, date FROM transactions ORDER BY id DESC LIMIT 10');
    console.table(transactions);

    console.log('\n========== КАТЕГОРИИ ==========');
    const categories = await db.all('SELECT id, user_id, type, name FROM categories');
    console.table(categories);

    console.log('\n========== БЮДЖЕТЫ ==========');
    const budgets = await db.all('SELECT id, user_id, category, budget, month, year FROM budgets');
    console.table(budgets);

    console.log('\n========== ЗАМЕТКИ (последние 5) ==========');
    const notes = await db.all('SELECT id, user_id, title, date FROM notes ORDER BY id DESC LIMIT 5');
    console.table(notes);

    console.log('\n========== ФИНАНСОВЫЕ ЦЕЛИ ==========');
    const goals = await db.all('SELECT id, user_id, name, target, saved, deadline FROM goals');
    console.table(goals);

    await db.close();
    console.log('\n✅ Готово!');
};

viewDatabase();