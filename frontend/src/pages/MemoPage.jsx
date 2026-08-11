import { useState } from 'react'
import './MemoPage.css'

const initialNotes = [
    {
        id: 1,
        title: '새 메모',
        content: '여기에 내용을 입력합니다.',
        updatedAt: '방금 전',
    },
    {
        id: 2,
        title: '아이디어',
        content: '',
        updatedAt: '오늘',
    },
]

function MemoPage() {
    const [notes, setNotes] = useState(initialNotes)
    const [selectedId, setSelectedId] = useState(1)

    const selectedNote = notes.find((note) => note.id === selectedId)

    function updateSelectedNote(field, value) {
        setNotes((currentNotes) =>
            currentNotes.map((note) =>
                note.id === selectedId
                    ? { ...note, [field]: value }
                    : note,
            ),
        )
    }

    function createNote() {
        const newNote = {
            id: Date.now(),
            title: '새 메모',
            content: '',
            updatedAt: '방금 전',
        }

        setNotes((currentNotes) => [newNote, ...currentNotes])
        setSelectedId(newNote.id)
    }

    return (
        <section className="memo-page" aria-label="Memo">
            <div className="memo-window">
                <aside className="memo-sidebar">
                    <div className="memo-sidebar-header">
                        <span>MEMO</span>

                        <button type="button" onClick={createNote}>
                            +
                        </button>
                    </div>

                    <div className="memo-list">
                        {notes.map((note) => (
                            <button
                                className={`memo-list-item ${
                                    note.id === selectedId ? 'memo-list-item--active' : ''
                                }`}
                                key={note.id}
                                type="button"
                                onClick={() => setSelectedId(note.id)}
                            >
                                <strong>{note.title || '제목 없음'}</strong>
                                <span>{note.updatedAt}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <article className="memo-editor">
                    <div className="memo-editor-toolbar">
                        <span>EDIT</span>
                    </div>

                    <input
                        className="memo-title-input"
                        value={selectedNote.title}
                        onChange={(event) =>
                            updateSelectedNote('title', event.target.value)
                        }
                        placeholder="제목 없음"
                    />

                    <textarea
                        className="memo-content-input"
                        value={selectedNote.content}
                        onChange={(event) =>
                            updateSelectedNote('content', event.target.value)
                        }
                        placeholder="메모를 입력하세요."
                    />
                </article>
            </div>
        </section>
    )
}

export default MemoPage