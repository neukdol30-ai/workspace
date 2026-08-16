import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MdDeleteOutline } from 'react-icons/md'
import ConfirmDialog from '../../component/common/ConfirmDialog.jsx'
import './ListMemoPage.css'

function ListMemoPage() {

    const [notePendingDelete, setNotePendingDelete] =
        useState(null)

    const {
        folders,
        notes,
        selectedFolderId,
        selectedNoteId,
        selectedNote,
        setSelectedNoteId,
        selectFolder,
        createNote,
        updateSelectedNote,
        deleteNote,
        hideFolderList,
    } = useOutletContext()

    const visibleNotes=
        selectedFolderId === 'all'
            ? notes
            : notes.filter((note) => note.folderId === selectedFolderId)

    function handleDeleteSelectedNote() {
        if (!selectedNote) {
            return
        }

        setNotePendingDelete(selectedNote)
    }

    function handleConfirmDelete() {
        if (!notePendingDelete) {
            return
        }

        deleteNote(notePendingDelete.id)
        setNotePendingDelete(null)
    }

    return (
        <div
            className={`memo-layout ${
                hideFolderList ? 'memo-layout--folders-hidden' : ''
            }`}
        >
            <aside
                className="memo-folders"
                hidden={hideFolderList}
            >
                <div className="memo-column-heading">FOLDERS</div>

                <div className="memo-folder-list">
                    {folders.map((folder) => {
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
                                onClick={() => selectFolder(folder.id)}
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

                    <div className="memo-column-actions">
                        <button
                            className="memo-delete-button"
                            type="button"
                            aria-label="Delete selected note"
                            disabled={!selectedNote}
                            onClick={handleDeleteSelectedNote}
                        >
                            <MdDeleteOutline aria-hidden="true" />
                        </button>

                        <button
                            className="memo-create-button"
                            type="button"
                            aria-label="Create note"
                            onClick={() => createNote()}
                        >
                            +
                        </button>
                    </div>
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
                            className="memo-content-input"
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
            <ConfirmDialog
                isOpen={notePendingDelete !== null}
                title="DELETE MEMO"
                message={
                    `"${notePendingDelete?.title.trim() || '제목 없음'}" ` +
                    '메모를 삭제할까요?'
                }
                confirmLabel="DELETE"
                cancelLabel="CANCEL"
                onConfirm={handleConfirmDelete}
                onCancel={() => setNotePendingDelete(null)}
            />
        </div>
    )
}

export default ListMemoPage