import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';

let db;

export async function initializeDatabase() {
    db = await open({
        filename: './finance.db',
        driver: sqlite3.Database
    });

    // Создание таблиц
    await db.exec(`
        -- Таблица пользователей
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Таблица транзакций
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Таблица категорий
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
            name TEXT NOT NULL,
            icon TEXT,
            budget REAL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, type, name)
        );

        -- Таблица бюджетов
        CREATE TABLE IF NOT EXISTS budgets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            category TEXT NOT NULL,
            budget REAL NOT NULL,
            month TEXT NOT NULL,
            year INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Таблица заметок
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            date TEXT,
            pinned INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Таблица финансовых целей
        CREATE TABLE IF NOT EXISTS goals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            target REAL NOT NULL,
            saved REAL DEFAULT 0,
            deadline TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        -- Таблица настроек пользователя
        CREATE TABLE IF NOT EXISTS user_settings (
            user_id INTEGER PRIMARY KEY,
            currency_code TEXT DEFAULT 'RUB',
            currency_symbol TEXT DEFAULT '₽',
            dark_mode INTEGER DEFAULT 1,
            accent_color TEXT DEFAULT '#116466',
            density TEXT DEFAULT 'comfortable',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `);

    // Создание индексов для производительности
    await db.exec(`
        CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date);
        CREATE INDEX IF NOT EXISTS idx_transactions_user_type ON transactions(user_id, type);
        CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month, year);
        CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
    `);

    console.log('✅ База данных инициализирована');
    return db;
}

export function getDb() {
    return db;
}

// CRUD операции для транзакций
export async function getTransactions(userId, filters = {}) {
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];
    
    if (filters.type && filters.type !== 'all') {
        query += ' AND type = ?';
        params.push(filters.type);
    }
    
    if (filters.category && filters.category !== 'all') {
        query += ' AND category = ?';
        params.push(filters.category);
    }
    
    if (filters.startDate) {
        query += ' AND date >= ?';
        params.push(filters.startDate);
    }
    
    if (filters.endDate) {
        query += ' AND date <= ?';
        params.push(filters.endDate);
    }
    
    query += ' ORDER BY date DESC';
    
    return await db.all(query, params);
}

export async function addTransaction(userId, transaction) {
    const result = await db.run(
        `INSERT INTO transactions (user_id, type, amount, category, description, date) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, transaction.type, transaction.amount, transaction.category, transaction.description || '', transaction.date]
    );
    return { id: result.lastID, ...transaction };
}

export async function updateTransaction(userId, id, transaction) {
    await db.run(
        `UPDATE transactions SET type = ?, amount = ?, category = ?, description = ?, date = ? 
         WHERE id = ? AND user_id = ?`,
        [transaction.type, transaction.amount, transaction.category, transaction.description || '', transaction.date, id, userId]
    );
    return { id, ...transaction };
}

export async function deleteTransaction(userId, id) {
    await db.run('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
}

// Категории
export async function getCategories(userId, type) {
    return await db.all(
        'SELECT * FROM categories WHERE user_id = ? AND type = ? ORDER BY name',
        [userId, type]
    );
}

export async function addCategory(userId, type, category) {
    const result = await db.run(
        `INSERT INTO categories (user_id, type, name, icon, budget) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, type, category.name, category.icon || '📁', category.budget || null]
    );
    return { id: result.lastID, ...category };
}

export async function updateCategory(userId, id, category) {
    await db.run(
        `UPDATE categories SET name = ?, icon = ?, budget = ? 
         WHERE id = ? AND user_id = ?`,
        [category.name, category.icon, category.budget || null, id, userId]
    );
}

export async function deleteCategory(userId, id) {
    await db.run('DELETE FROM categories WHERE id = ? AND user_id = ?', [id, userId]);
}

// Бюджеты
export async function getBudgets(userId, month, year) {
    return await db.all(
        'SELECT * FROM budgets WHERE user_id = ? AND month = ? AND year = ?',
        [userId, month, year]
    );
}

export async function addBudget(userId, budget) {
    const result = await db.run(
        `INSERT INTO budgets (user_id, category, budget, month, year) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, budget.category, budget.budget, budget.month, budget.year]
    );
    return { id: result.lastID, ...budget, spent: 0 };
}

export async function updateBudget(userId, id, budget) {
    await db.run(
        `UPDATE budgets SET category = ?, budget = ?, month = ?, year = ? 
         WHERE id = ? AND user_id = ?`,
        [budget.category, budget.budget, budget.month, budget.year, id, userId]
    );
}

export async function deleteBudget(userId, id) {
    await db.run('DELETE FROM budgets WHERE id = ? AND user_id = ?', [id, userId]);
}

// Заметки
export async function getNotes(userId) {
    return await db.all(
        'SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC',
        [userId]
    );
}

export async function addNote(userId, note) {
    const result = await db.run(
        `INSERT INTO notes (user_id, title, content, date, pinned) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, note.title || 'Новая заметка', note.content || '', note.date || null, note.pinned ? 1 : 0]
    );
    return { id: result.lastID, ...note };
}

export async function updateNote(userId, id, note) {
    await db.run(
        `UPDATE notes SET title = ?, content = ?, date = ?, pinned = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ? AND user_id = ?`,
        [note.title, note.content, note.date || null, note.pinned ? 1 : 0, id, userId]
    );
}

export async function deleteNote(userId, id) {
    await db.run('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, userId]);
}

// Цели
export async function getGoals(userId) {
    return await db.all('SELECT * FROM goals WHERE user_id = ?', [userId]);
}

export async function addGoal(userId, goal) {
    const result = await db.run(
        `INSERT INTO goals (user_id, name, target, saved, deadline) 
         VALUES (?, ?, ?, ?, ?)`,
        [userId, goal.name, goal.target, goal.saved || 0, goal.deadline]
    );
    return { id: result.lastID, ...goal };
}

export async function updateGoal(userId, id, updates) {
    const fields = [];
    const values = [];
    
    if (updates.saved !== undefined) {
        fields.push('saved = ?');
        values.push(updates.saved);
    }
    if (updates.name) {
        fields.push('name = ?');
        values.push(updates.name);
    }
    if (updates.target) {
        fields.push('target = ?');
        values.push(updates.target);
    }
    if (updates.deadline) {
        fields.push('deadline = ?');
        values.push(updates.deadline);
    }
    
    if (fields.length === 0) return;
    
    values.push(id, userId);
    await db.run(
        `UPDATE goals SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
        values
    );
}

export async function deleteGoal(userId, id) {
    await db.run('DELETE FROM goals WHERE id = ? AND user_id = ?', [id, userId]);
}

// Настройки
export async function getUserSettings(userId) {
    let settings = await db.get('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    
    if (!settings) {
        await db.run(
            `INSERT INTO user_settings (user_id, currency_code, currency_symbol, dark_mode, accent_color, density) 
             VALUES (?, 'RUB', '₽', 1, '#116466', 'comfortable')`,
            [userId]
        );
        settings = await db.get('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
    }
    
    return {
        currency: {
            code: settings.currency_code,
            symbol: settings.currency_symbol
        },
        darkMode: settings.dark_mode === 1,
        accentColor: settings.accent_color,
        density: settings.density
    };
}

export async function updateUserSettings(userId, settings) {
    const updates = [];
    const values = [];
    
    if (settings.currency) {
        updates.push('currency_code = ?, currency_symbol = ?');
        values.push(settings.currency.code, settings.currency.symbol);
    }
    if (settings.darkMode !== undefined) {
        updates.push('dark_mode = ?');
        values.push(settings.darkMode ? 1 : 0);
    }
    if (settings.accentColor) {
        updates.push('accent_color = ?');
        values.push(settings.accentColor);
    }
    if (settings.density) {
        updates.push('density = ?');
        values.push(settings.density);
    }
    
    if (updates.length === 0) return;
    
    values.push(userId);
    await db.run(`UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`, values);
}