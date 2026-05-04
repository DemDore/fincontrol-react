import { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';
import QuickActions from './QuickActions';
import './Calendar.css';

const Calendar = () => {
    const { notes, addNote, updateNote } = useNotes();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailyNotes, setDailyNotes] = useState({});
    const [newNoteText, setNewNoteText] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    useEffect(() => {
        const notesByDate = {};
        notes.forEach(note => {
            if (note.date) {
                if (!notesByDate[note.date]) {
                    notesByDate[note.date] = [];
                }
                notesByDate[note.date].push(note);
            }
        });
        setDailyNotes(notesByDate);
    }, [notes]);

    useEffect(() => {
        if (selectedDate) {
            setNewNoteText('');
            setEditingNoteId(null);
        }
    }, [selectedDate]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    const formatDateKey = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDateClick = (day) => {
        const dateKey = formatDateKey(currentYear, currentMonth, day);
        setSelectedDate({ 
            year: currentYear, 
            month: currentMonth, 
            day, 
            dateKey,
            monthName: monthNames[currentMonth]
        });
    };

    const handleAddNote = () => {
        if (!newNoteText.trim()) return;
        
        addNote({
            title: newNoteText.slice(0, 50),
            content: `<p>${newNoteText.replace(/\n/g, '<br>')}</p>`,
            date: selectedDate.dateKey,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        setNewNoteText('');
    };

    const handleDeleteNote = (noteId) => {
        if (confirm('Удалить эту заметку?')) {
            const updatedNotes = notes.filter(n => n.id !== noteId);
            localStorage.setItem('fincontrol_notes', JSON.stringify(updatedNotes));
            window.dispatchEvent(new Event('notesUpdated'));
            window.location.reload();
        }
    };

    const handleEditNote = (note) => {
        setEditingNoteId(note.id);
        const plainText = note.content.replace(/<[^>]*>/g, '');
        setNewNoteText(plainText);
    };

    const handleUpdateNote = () => {
        if (!newNoteText.trim() || !editingNoteId) return;
        
        const updatedNotes = notes.map(n => 
            n.id === editingNoteId 
                ? { 
                    ...n, 
                    title: newNoteText.slice(0, 50),
                    content: `<p>${newNoteText.replace(/\n/g, '<br>')}</p>`,
                    updatedAt: new Date().toISOString()
                  }
                : n
        );
        localStorage.setItem('fincontrol_notes', JSON.stringify(updatedNotes));
        window.dispatchEvent(new Event('notesUpdated'));
        setEditingNoteId(null);
        setNewNoteText('');
    };

    const cancelEdit = () => {
        setEditingNoteId(null);
        setNewNoteText('');
    };

    const renderCalendarDays = () => {
        const days = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = formatDateKey(currentYear, currentMonth, day);
            const hasNotes = dailyNotes[dateKey] && dailyNotes[dateKey].length > 0;
            const isToday = isCurrentDay(day);
            const isSelected = selectedDate?.day === day && 
                              selectedDate?.month === currentMonth && 
                              selectedDate?.year === currentYear;
            
            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${hasNotes ? 'has-notes' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    <span className="day-number">{day}</span>
                    {hasNotes && <span className="note-dot">●</span>}
                </div>
            );
        }
        return days;
    };

    const isCurrentDay = (day) => {
        const today = new Date();
        return today.getDate() === day && 
               today.getMonth() === currentMonth && 
               today.getFullYear() === currentYear;
    };

    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    const currentNotes = selectedDate ? (dailyNotes[selectedDate.dateKey] || []) : [];

    return (
        <div className="calendar-widget">
            <div className="calendar-header">
                <button className="calendar-nav" onClick={prevMonth}>◀</button>
                <h3>{monthNames[currentMonth]} {currentYear}</h3>
                <button className="calendar-nav" onClick={nextMonth}>▶</button>
            </div>
            
            <div className="calendar-weekdays">
                {weekDays.map(day => (
                    <div key={day} className="weekday">{day}</div>
                ))}
            </div>
            
            <div className="calendar-grid">
                {renderCalendarDays()}
            </div>

            {selectedDate && (
                <div className="calendar-notes-list">
                    <div className="notes-list-header">
                        <h4>📝 Заметки на {selectedDate.day} {selectedDate.monthName}</h4>
                    </div>
                    
                    <div className="notes-list-container">
                        {currentNotes.length === 0 ? (
                            <div className="notes-empty-state">
                                <p>Нет заметок на этот день</p>
                            </div>
                        ) : (
                            currentNotes.map(note => {
                                const plainText = note.content.replace(/<[^>]*>/g, '');
                                return (
                                    <div key={note.id} className="note-item">
                                        <div className="note-content">{plainText}</div>
                                        <div className="note-actions">
                                            <button className="note-edit-btn" onClick={() => handleEditNote(note)}>✏️</button>
                                            <button className="note-delete-btn" onClick={() => handleDeleteNote(note.id)}>🗑️</button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="add-note-form">
                        <textarea
                            className="note-input"
                            placeholder="Напишите заметку..."
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            rows={2}
                        />
                        <div className="form-buttons">
                            {editingNoteId ? (
                                <>
                                    <button className="btn-secondary" onClick={cancelEdit}>Отмена</button>
                                    <button className="btn-primary" onClick={handleUpdateNote}>Сохранить</button>
                                </>
                            ) : (
                                <button className="btn-primary add-btn" onClick={handleAddNote} disabled={!newNoteText.trim()}>
                                    + Добавить заметку
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* БЫСТРЫЕ ДЕЙСТВИЯ — ДОБАВЛЕНЫ ЗДЕСЬ */}
            <QuickActions />
        </div>
    );
};

export default Calendar;