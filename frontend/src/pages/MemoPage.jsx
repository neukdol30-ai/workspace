import { useState } from 'react'
import './MemoPage.css'

const initialFolders = [
    { id: 'all', name: 'ALL NOTES'},
    { id: 'all', name: 'ALL NOTES'},
    { id: 'all', name: 'ALL NOTES'},
    { id: 'all', name: 'ALL NOTES'},
]

const initialNotes = [
    {
        id: 1,
        folderId: 'inbox',
        title: '새 메모',
        content: '여기에 내용을 입력합니다.',
        updatedAt: '방금 전',
    },
    {
        id: 2,
        folderId: 'ideas',
        title: '아이디어',
        content: '',
        updatedAt: '오늘',
    },
]

function MemoPage() {
    const [notes, setNotes] = useState(initialNotes)
    const [selectedFolderId, setSelectedFolderId] = useState('all')
    const [selectedNoteId, setSelectedNoteId] = useState(1)

    const visibleNotes=
        selectedFolderId === 'all'
            ? notes
            : notes.filter((note) => note.folderId === selectedFolderId)

    const selectedNote =
        notes.find((note) => note.id === selectedNoteId ?? null)

    function selectFolder(folderId) {
        const nextVisibleNotes =
            folderId === 'all'
                ? notes
                : notes.filter((note) => note.folderId === folderId)

        setSelectedFolderId(folderId)
        setSelectedNoteId(nextVisibleNotes[0]?.id ?? null)
    }

    function createNote() {
        const folderId =
            selectedFolderId === 'all' ? 'inbox' : selectedFolderId

        const newNote = {
            id: Date.now(),
            folderId,
            title: '새 메모',
            content: '',
            updatedAt: '방금 전',
        }

        setNotes((currentNotes) => [newNote, ...currentNotes])
        setSelectedNoteId(newNote.id)
    }

    function updateSelectedNote(field, value) {
        setNotes((currentNotes) =>
            currentNotes.map((note) =>
                note.id === selectedNoteId ? {
                ...note,
                    [field]: value,
                    updatedAt : '방금 전',
                }
                : note,
             )
        )
    }

    return (
        <section className="memo-page" aria-label="Memo">
            <div className="memo-window">
                <aside className="memo-command-bar" aria-hidden="true" />

                    <div className="memo-layout">
                        <aside className="memo-folders">
                            <div className="memo-column-heading">FOLDERS</div>

                            <div className="memo-folder-list">
                                {initialFolders.map((folder) => {
                                    const noteCount =
                                        folder.id === 'all'
                                        ? notes.length
                                        : notes.filter(
                                            (note) => note.folderId === folder.id,
                                            ).length;

                                    return (
                                        <button
                                            className={`memo-folder-item ${
                                                folder.id === selectedFolderId
                                                    ? 'memo-folder-item--active'
                                                    : ''
                                            }`}
                                            key={folder.id}
                                            type="button"
                                            onClick={() => selectFolder(folder.Id)}
                                            >
                                            <span>{folder.name}</span>
                                            <span>{noteCount}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </aside>

                        <aside className="memo-note-column">
                            <div className="memo-column-heading">
                                <span>MEMO</span>

                                <button
                                    className="memo-create-button"
                                    type="button"
                                    aria-label="Create note"
                                    onClick={createNote}
                                    >
                                    +
                                </button>
                            </div>

                            <div className="memo-note-list">
                                {visibleNotes.map((note) => (
                                    <button
                                    className={`memo-note-item ${
                                        note.id === selectedNoteId
                                        ? 'memo-note-item--active'
                                            : ''
                                    }`}
                                    key={note.id}
                                    type="button"
                                    onClick={() => setSelectedNoteId(note.id)}
                                    >
                                        <strong>{note.title || '제목 없음'}</strong>
                                        <span>{note.updatedAt}</span>
                                        <p>{note.content || '내용 없음'}</p>
                                    </button>
                                ))}
                            </div>
                        </aside>

                        <article className="memo-editor">
                            {selectedNote ? (
                                <>
                                    <div className="memo-editor-date">
                                        {selectedNote.updatedAt}
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
                                        className="memo-title-input"
                                        value={selectedNote.content}
                                        onChange={(event) =>
                                            updateSelectedNote('content', event.target.value)
                                        }
                                        placeholder="메모를 입력하세요."
                                    />
                                </>
                            ) : (
                                <div className="memo-empty-editor">
                                    선택된 메모가 없습니다.
                                </div>
                            )}
                        </article>
                    </div>
            </div>
        </section>
    )
}

export default MemoPage