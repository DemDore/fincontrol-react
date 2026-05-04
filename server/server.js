import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
    initializeDatabase, getDb, 
    getTransactions, addTransaction, updateTransaction, deleteTransaction,
    getCategories, addCategory, deleteCategory,
    getBudgets, addBudget, updateBudget, deleteBudget,
    getNotes, addNote, updateNote, deleteNote,
    getGoals, addGoal, updateGoal, deleteGoal,
    getUserSettings, updateUserSettings
} from './database.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Упрощённая настройка CORS - разрешаем всё для разработки
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// Middleware для проверки JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Требуется авторизация' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Недействительный токен' });
        }
        req.userId = user.id;
        next();
    });
}

// Инициализация БД
await initializeDatabase();

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        console.log('Register attempt:', { name, email });
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Все поля обязательны' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ message: 'Пароль должен быть минимум 6 символов' });
        }
        
        const db = getDb();
        
        const existing = await db.get('SELECT id FROM users WHERE email = ?', [email]);
        if (existing) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');
        
        const result = await db.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        console.log('User created with id:', result.lastID);
        
        // ========== ДОБАВЛЯЕМ КАТЕГОРИИ ПО УМОЛЧАНИЮ ==========
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
        
        // Добавляем категории расходов
        for (const cat of defaultExpenseCategories) {
            await db.run(
                'INSERT INTO categories (user_id, type, name, icon, budget) VALUES (?, ?, ?, ?, ?)',
                [result.lastID, 'expense', cat.name, cat.icon, cat.budget]
            );
        }
        
        // Добавляем категории доходов
        for (const cat of defaultIncomeCategories) {
            await db.run(
                'INSERT INTO categories (user_id, type, name, icon, budget) VALUES (?, ?, ?, ?, ?)',
                [result.lastID, 'income', cat.name, cat.icon, null]
            );
        }
        
        console.log('Default categories added for user');
        // ====================================================
        
        const token = jwt.sign({ id: result.lastID, email, name }, JWT_SECRET, { expiresIn: '30d' });
        
        res.status(201).json({
            success: true,
            token,
            user: { id: result.lastID, name, email }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Ошибка сервера при регистрации: ' + error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt:', { email });
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email и пароль обязательны' });
        }
        
        const db = getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
            console.log('Invalid password for:', email);
            return res.status(401).json({ message: 'Неверный email или пароль' });
        }
        
        // ========== ИСПРАВЛЕНО: Добавлен name в токен ==========
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '30d' });
        
        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Ошибка сервера при входе' });
    }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [req.userId]);
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// ========== TRANSACTIONS ROUTES ==========
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;
        const transactions = await getTransactions(req.userId, { type, category, startDate, endDate });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения транзакций' });
    }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const transaction = await addTransaction(req.userId, req.body);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка добавления транзакции' });
    }
});

app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        await updateTransaction(req.userId, parseInt(req.params.id), req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления транзакции' });
    }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        await deleteTransaction(req.userId, parseInt(req.params.id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления транзакции' });
    }
});

// ========== CATEGORIES ROUTES ==========
app.get('/api/categories', authenticateToken, async (req, res) => {
    try {
        const { type } = req.query;
        const categories = await getCategories(req.userId, type);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения категорий' });
    }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
    try {
        const { type, ...category } = req.body;
        const newCategory = await addCategory(req.userId, type, category);
        res.json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка добавления категории' });
    }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        await deleteCategory(req.userId, parseInt(req.params.id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления категории' });
    }
});

// ========== BUDGETS ROUTES ==========
app.get('/api/budgets', authenticateToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        const budgets = await getBudgets(req.userId, month, year);
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения бюджетов' });
    }
});

app.post('/api/budgets', authenticateToken, async (req, res) => {
    try {
        const budget = await addBudget(req.userId, req.body);
        res.json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка добавления бюджета' });
    }
});

app.put('/api/budgets/:id', authenticateToken, async (req, res) => {
    try {
        await updateBudget(req.userId, parseInt(req.params.id), req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления бюджета' });
    }
});

app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
    try {
        await deleteBudget(req.userId, parseInt(req.params.id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления бюджета' });
    }
});

// ========== NOTES ROUTES ==========
app.get('/api/notes', authenticateToken, async (req, res) => {
    try {
        const db = getDb();
        const notes = await db.all(
            'SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, updated_at DESC',
            [req.userId]
        );
        res.json(notes);
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ message: 'Ошибка получения заметок' });
    }
});

app.post('/api/notes', authenticateToken, async (req, res) => {
    try {
        const { title, content, date, pinned } = req.body;
        
        console.log('Creating note for user:', req.userId);
        
        const db = getDb();
        const result = await db.run(
            `INSERT INTO notes (user_id, title, content, date, pinned, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [req.userId, title || 'Новая заметка', content || '', date || null, pinned ? 1 : 0]
        );
        
        const newNote = await db.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);
        
        console.log('Note created with id:', result.lastID);
        res.json(newNote);
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ message: 'Ошибка создания заметки: ' + error.message });
    }
});

app.put('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        const { title, content, date, pinned } = req.body;
        const noteId = parseInt(req.params.id);
        
        console.log('Updating note:', { id: noteId, title, content: content?.substring(0, 50) });
        
        const db = getDb();
        
        // Проверяем, существует ли заметка и принадлежит ли пользователю
        const existing = await db.get('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, req.userId]);
        
        if (!existing) {
            return res.status(404).json({ message: 'Заметка не найдена' });
        }
        
        // Обновляем заметку
        await db.run(
            `UPDATE notes SET title = ?, content = ?, date = ?, pinned = ?, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ? AND user_id = ?`,
            [title || 'Без названия', content || '', date || null, pinned ? 1 : 0, noteId, req.userId]
        );
        
        // Получаем обновлённую заметку
        const updatedNote = await db.get('SELECT * FROM notes WHERE id = ? AND user_id = ?', [noteId, req.userId]);
        
        console.log('Note updated successfully');
        res.json({ success: true, note: updatedNote });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ message: 'Ошибка обновления заметки: ' + error.message });
    }
});

app.delete('/api/notes/:id', authenticateToken, async (req, res) => {
    try {
        await deleteNote(req.userId, parseInt(req.params.id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления заметки' });
    }
});

// ========== GOALS ROUTES ==========
app.get('/api/goals', authenticateToken, async (req, res) => {
    try {
        const goals = await getGoals(req.userId);
        res.json(goals);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения целей' });
    }
});

app.post('/api/goals', authenticateToken, async (req, res) => {
    try {
        const goal = await addGoal(req.userId, req.body);
        res.json(goal);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка добавления цели' });
    }
});

app.put('/api/goals/:id', authenticateToken, async (req, res) => {
    try {
        await updateGoal(req.userId, parseInt(req.params.id), req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления цели' });
    }
});

app.delete('/api/goals/:id', authenticateToken, async (req, res) => {
    try {
        await deleteGoal(req.userId, parseInt(req.params.id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка удаления цели' });
    }
});

// ========== SETTINGS ROUTES ==========
app.get('/api/settings', authenticateToken, async (req, res) => {
    try {
        const settings = await getUserSettings(req.userId);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка получения настроек' });
    }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
    try {
        await updateUserSettings(req.userId, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления настроек' });
    }
});

// Тестовый маршрут для проверки
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// ========== PROFILE ROUTES ==========
app.put('/api/profile', authenticateToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const db = getDb();
        
        await db.run(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, req.userId]
        );
        
        // Создаём новый токен с обновлёнными данными
        const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [req.userId]);
        const newToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name }, 
            JWT_SECRET, 
            { expiresIn: '30d' }
        );
        
        res.json({
            success: true,
            token: newToken,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Ошибка обновления профиля' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📡 API доступен на http://localhost:${PORT}/api/health`);
});