import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { useEffect, useCallback } from 'react';
import './NoteEditor.css';

const MenuButton = ({ onClick, active, children, title }) => (
    <button
        className={`menu-btn ${active ? 'active' : ''}`}
        onClick={onClick}
        title={title}
        type="button"
    >
        {children}
    </button>
);

const NoteEditor = ({ content, onChange }) => {
    const debouncedOnChange = useCallback(
        (() => {
            let timeout;
            return (html) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    onChange(html);
                }, 500);
            };
        })(),
        [onChange]
    );

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4]
                }
            }),
            Underline, // Только один раз!
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            TaskList,
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'task-list-item',
                },
            }),
        ],
        content: content || '<p>Начните писать...</p>',
        onUpdate: ({ editor }) => {
            debouncedOnChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '<p>Начните писать...</p>');
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className="note-editor">
            <div className="editor-toolbar">
                {/* Заголовки */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        active={editor.isActive('heading', { level: 1 })}
                        title="Заголовок H1"
                    >
                        H1
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        active={editor.isActive('heading', { level: 2 })}
                        title="Заголовок H2"
                    >
                        H2
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        active={editor.isActive('heading', { level: 3 })}
                        title="Заголовок H3"
                    >
                        H3
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        active={editor.isActive('paragraph')}
                        title="Обычный текст"
                    >
                        ¶
                    </MenuButton>
                </div>

                {/* Форматирование текста */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')}
                        title="Жирный"
                    >
                        <strong>B</strong>
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')}
                        title="Курсив"
                    >
                        <em>I</em>
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive('underline')}
                        title="Подчёркнутый"
                    >
                        <u>U</u>
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        active={editor.isActive('strike')}
                        title="Зачёркнутый"
                    >
                        <s>S</s>
                    </MenuButton>
                </div>

                {/* Цвет текста */}
                <div className="toolbar-group">
                    <select
                        className="menu-select"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'default') {
                                editor.chain().focus().unsetColor().run();
                            } else {
                                editor.chain().focus().setColor(value).run();
                            }
                        }}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                    >
                        <option value="#000000">⚫ Чёрный</option>
                        <option value="#e85d5d">🔴 Красный</option>
                        <option value="#116466">🟢 Зелёный</option>
                        <option value="#FFCB9A">🟠 Оранжевый</option>
                        <option value="#D9B08C">🟤 Коричневый</option>
                        <option value="#4A90D9">🔵 Синий</option>
                        <option value="#9B59B6">🟣 Фиолетовый</option>
                        <option value="#F39C12">🟡 Жёлтый</option>
                        <option value="#1ABC9C">💚 Бирюзовый</option>
                        <option value="#E74C3C">🧡 Тёмно-красный</option>
                    </select>
                </div>

                {/* Маркер (выделение цветом) */}
                <div className="toolbar-group">
                    <select
                        className="menu-select"
                        onChange={(e) => {
                            const color = e.target.value;
                            if (color === 'none') {
                                editor.chain().focus().unsetHighlight().run();
                            } else {
                                editor.chain().focus().setHighlight({ color }).run();
                            }
                        }}
                    >
                        <option value="none">🖌️ Цвет маркера</option>
                        <option value="#FFD700">🟡 Жёлтый</option>
                        <option value="#90EE90">🟢 Зелёный</option>
                        <option value="#FFB6C1">🌸 Розовый</option>
                        <option value="#87CEEB">🔵 Синий</option>
                        <option value="#FFA07A">🍑 Лососевый</option>
                        <option value="#DDA0DD">🟣 Сиреневый</option>
                    </select>
                </div>

                {/* Списки */}
                <div className="toolbar-group">
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')}
                        title="Маркированный список"
                    >
                        • Список
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')}
                        title="Нумерованный список"
                    >
                        1. Список
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        active={editor.isActive('taskList')}
                        title="Чек-лист"
                    >
                        ☑ Задачи
                    </MenuButton>
                </div>
            </div>
            <EditorContent editor={editor} className="editor-content" />
        </div>
    );
};

export default NoteEditor;