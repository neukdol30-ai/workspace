import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { initialFolders, initialNotes } from './memoData.js'
import './MemoLayout.css'

function MemoLayout({ hideFolderList }) {
    const [notes, setNotes] = useState(initialNotes)
    const [selectedFolderId, setSelectedFolderId] = useState('all')
    const [selectedNoteId, setSelectedNoteId] = useState(
        initialNotes[0]?.id ?? null
    )

    const selectedNote =
        notes.find((note) => note.id === selectedNoteId) ?? null

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

    return(
        <section className="memo-page" aria-label="Memo">
            <div className="memo-window">
                <div className="memo-command-bar">
                    <nav className="memo-mode-switch" aria-label="Memo view mode">
                    <NavLink
                        className={({isActive})=>
                    `memo-mode-button ${isActive ? 'memo-mode-button--active' : ''
                        }`} to="/memo/list">
                        LIST</NavLink>

                    <NavLink
                        className={({isActive})=>
                    `memo-mode-button ${isActive ? 'memo-mode-button--active' : ''
                        }`} to="/memo/board">
                        BOARD</NavLink>
                    </nav>
                </div>

                <Outlet
                    context={{
                        folders: initialFolders,
                        notes,
                        selectedFolderId,
                        selectedNoteId,
                        selectedNote,
                        setSelectedNoteId,
                        selectFolder,
                        createNote,
                        updateSelectedNote,
                        hideFolderList,
                    }}
                />
            </div>
        </section>
    )
 }

 export default MemoLayout;