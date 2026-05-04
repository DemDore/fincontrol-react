import { useNotes } from '../../context/NotesContext';

const NotesList = () => {
    const { notes, selectedNoteId, setSelectedNoteId, addNote, deleteNote } = useNotes();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Сегодня';
        if (diffDays === 1) return 'Вчера';
        if (diffDays < 7) return `${diffDays} дня назад`;
        return date.toLocaleDateString('ru-RU');
    };

    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="notes-list">
            <div className="notes-list-header">
                <h2>📝 Мои заметки</h2>
                <button className="btn-primary add-note-btn" onClick={addNote}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </button>
            </div>
            
            <div className="notes-list-items">
                {notes.length === 0 ? (
                    <div className="notes-empty">
                        <span className="empty-icon">📓</span>
                        <p>Нет заметок</p>
                        <span className="empty-hint">Нажмите + чтобы создать первую заметку</span>
                    </div>
                ) : (
                    notes.map(note => (
                        <div
                            key={note.id}
                            className={`note-item ${selectedNoteId === note.id ? 'active' : ''}`}
                            onClick={() => setSelectedNoteId(note.id)}
                        >
                            <div className="note-title">{note.title}</div>
                            <div className="note-preview">{stripHtml(note.content).slice(0, 60)}</div>
                            <div className="note-footer">
                                <span className="note-date">{formatDate(note.updatedAt)}</span>
                                <button 
                                    className="note-delete"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Удалить заметку?')) {
                                            deleteNote(note.id);
                                        }
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesList;