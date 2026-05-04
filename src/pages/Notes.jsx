import { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import NotesList from '../components/Notes/NotesList';
import NoteEditor from '../components/Notes/NoteEditor';
import '../styles/notes.css';

const Notes = () => {
    const { selectedNote, updateNote } = useNotes();
    const [localTitle, setLocalTitle] = useState('');
    const [localContent, setLocalContent] = useState('');

    // Обновляем локальное состояние при смене заметки
    useEffect(() => {
        if (selectedNote) {
            setLocalTitle(selectedNote.title);
            setLocalContent(selectedNote.content);
        }
    }, [selectedNote]);

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setLocalTitle(newTitle);
        if (selectedNote) {
            updateNote(selectedNote.id, { title: newTitle });
        }
    };

    const handleContentChange = (content) => {
        setLocalContent(content);
        if (selectedNote) {
            updateNote(selectedNote.id, { content });
        }
    };

    // Добавьте автосохранение при уходе со страницы
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Автоматически сохраняем при закрытии страницы
            if (selectedNote && localContent !== selectedNote.content) {
                updateNote(selectedNote.id, { content: localContent });
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [selectedNote, localContent, updateNote]);

    return (
        <div className="content notes-page">
            <div className="notes-container">
                <div className="notes-sidebar">
                    <NotesList />
                </div>
                <div className="notes-editor-area">
                    {selectedNote ? (
                        <>
                            <input
                                type="text"
                                className="note-title-input"
                                value={localTitle}
                                onChange={handleTitleChange}
                                placeholder="Заголовок заметки..."
                            />
                            <NoteEditor 
                                content={localContent} 
                                onChange={handleContentChange}
                            />
                        </>
                    ) : (
                        <div className="notes-empty-editor">
                            <div className="empty-editor-icon">📝</div>
                            <p>Выберите заметку или создайте новую</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notes;