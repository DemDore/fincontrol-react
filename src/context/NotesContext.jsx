import { createContext, useContext, useState, useEffect } from 'react';

const NotesContext = createContext();

const STORAGE_KEY = 'fincontrol_notes';

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Загрузка заметок из localStorage при старте
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        console.log('Загрузка из localStorage:', saved);
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Добавляем поле pinned для старых заметок, если его нет
                const parsedWithPinned = parsed.map(note => ({
                    ...note,
                    pinned: note.pinned || false
                }));
                // Сортируем: закрепленные сверху, потом по дате
                const sorted = sortNotes(parsedWithPinned);
                setNotes(sorted);
                if (sorted.length > 0) {
                    setSelectedNoteId(sorted[0].id);
                }
            } catch (e) {
                console.error('Ошибка загрузки заметок', e);
                const defaultNote = {
                    id: Date.now(),
                    title: 'Пример заметки',
                    content: '<p>Начните писать...</p>',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    pinned: false
                };
                setNotes([defaultNote]);
                setSelectedNoteId(defaultNote.id);
            }
        } else {
            const defaultNote = {
                id: Date.now(),
                title: 'Моя первая заметка',
                content: '<p>Добро пожаловать в заметки! ✨</p>',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                pinned: false
            };
            setNotes([defaultNote]);
            setSelectedNoteId(defaultNote.id);
        }
        setIsInitialized(true);
    }, []);

    // Функция сортировки: закрепленные сверху, потом по дате обновления
    const sortNotes = (notesArray) => {
        return [...notesArray].sort((a, b) => {
            if (a.pinned === b.pinned) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
            return a.pinned ? -1 : 1;
        });
    };

    // Сохранение заметок в localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
            console.log('Заметки сохранены:', notes.length);
        }
    }, [notes, isInitialized]);

// Обновление заметки - БЕЗ СОРТИРОВКИ
const updateNote = (id, updates) => {
    setNotes(prev => prev.map(note => 
        note.id === id 
            ? { ...note, ...updates, updatedAt: new Date().toISOString() }
            : note
    ));
};

// Создание заметки - БЕЗ СОРТИРОВКИ (новая просто в начало)
const addNote = (noteData = {}) => {
    const newNote = {
        id: Date.now(),
        title: noteData.title || 'Новая заметка',
        content: noteData.content || '<p>Начните писать...</p>',
        date: noteData.date || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false
    };
    setNotes(prev => [newNote, ...prev]); // Просто в начало, без сортировки
    setSelectedNoteId(newNote.id);
    return newNote.id;
};

// Удаление - БЕЗ СОРТИРОВКИ
const deleteNote = (id) => {
    setNotes(prev => {
        const filtered = prev.filter(note => note.id !== id);
        if (selectedNoteId === id) {
            setSelectedNoteId(filtered.length > 0 ? filtered[0]?.id : null);
        }
        return filtered; // Без sortNotes
    });
};


    // Закрепить/открепить заметку
    const togglePinNote = (id) => {
        setNotes(prev => {
            const updated = prev.map(note =>
                note.id === id
                    ? { ...note, pinned: !note.pinned }
                    : note
            );
            return sortNotes(updated);
        });
    };

    const selectedNote = notes.find(n => n.id === selectedNoteId);

    return (
        <NotesContext.Provider value={{
            notes,
            selectedNoteId,
            selectedNote,
            setSelectedNoteId,
            addNote,
            updateNote,
            deleteNote,
            togglePinNote  // Добавляем функцию в провайдер
        }}>
            {children}
        </NotesContext.Provider>
    );
}

export function useNotes() {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
}