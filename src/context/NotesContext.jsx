import { createContext, useContext, useState, useEffect } from 'react';
import { notesAPI } from '../services/api';

const NotesContext = createContext();

export function NotesProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loading, setLoading] = useState(true);

    // Загрузка заметок из API
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            const loadedNotes = await notesAPI.getAll();
            // Добавляем поле pinned для старых заметок, если его нет
            const notesWithPinned = loadedNotes.map(note => ({
                ...note,
                pinned: note.pinned || false
            }));
            const sorted = sortNotes(notesWithPinned);
            setNotes(sorted);
            if (sorted.length > 0) {
                setSelectedNoteId(sorted[0].id);
            }
        } catch (error) {
            console.error('Ошибка загрузки заметок:', error);
            setNotes([]);
        } finally {
            setLoading(false);
            setIsInitialized(true);
        }
    };

    const sortNotes = (notesArray) => {
        return [...notesArray].sort((a, b) => {
            if (a.pinned === b.pinned) {
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            }
            return a.pinned ? -1 : 1;
        });
    };

    const updateNote = async (id, updates) => {
        try {
            await notesAPI.update(id, updates);
            setNotes(prev => prev.map(note => 
                note.id === id 
                    ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                    : note
            ));
        } catch (error) {
            console.error('Ошибка обновления заметки:', error);
        }
    };

    const addNote = async (noteData = {}) => {
        try {
            const newNote = {
                title: noteData.title || 'Новая заметка',
                content: noteData.content || '<p>Начните писать...</p>',
                date: noteData.date || null,
                pinned: false
            };
            const created = await notesAPI.create(newNote);
            const noteWithDates = {
                ...created,
                ...newNote,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setNotes(prev => [noteWithDates, ...prev]);
            setSelectedNoteId(noteWithDates.id);
            return noteWithDates.id;
        } catch (error) {
            console.error('Ошибка создания заметки:', error);
            throw error;
        }
    };

    const deleteNote = async (id) => {
        try {
            await notesAPI.delete(id);
            setNotes(prev => {
                const filtered = prev.filter(note => note.id !== id);
                if (selectedNoteId === id) {
                    setSelectedNoteId(filtered.length > 0 ? filtered[0]?.id : null);
                }
                return filtered;
            });
        } catch (error) {
            console.error('Ошибка удаления заметки:', error);
        }
    };

    const togglePinNote = async (id) => {
        const note = notes.find(n => n.id === id);
        if (note) {
            await updateNote(id, { pinned: !note.pinned });
            setNotes(prev => sortNotes(prev.map(n => 
                n.id === id ? { ...n, pinned: !n.pinned } : n
            )));
        }
    };

    const selectedNote = notes.find(n => n.id === selectedNoteId);

    if (loading) {
        return <div>Загрузка заметок...</div>;
    }

    return (
        <NotesContext.Provider value={{
            notes,
            selectedNoteId,
            selectedNote,
            setSelectedNoteId,
            addNote,
            updateNote,
            deleteNote,
            togglePinNote
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