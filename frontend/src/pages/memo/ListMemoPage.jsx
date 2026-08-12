import { useOutletContext } from 'react-router-dom'
import './ListMemoPage.css'

function ListMemoPage() {
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
        hideFolderList,
    } = useOutletContext()

    const visibleNotes=
        selectedFolderId === 'all'
            ? notes
            : notes.filter((note) => note.folderId === selectedFolderId)

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
        </div>
    )
}

export default ListMemoPage