import { useOutletContext } from 'react-router-dom'
import './BoardMemoPage.css'

function BoardMemoPage() {
    const {
        notes,
        boardNodes,
        selectedFolderId,
        createNote,
    } = useOutletContext()

    const visibleNotes =
        selectedFolderId === 'all'
            ? notes
            : notes.filter(
                (note) => note.folderId === selectedFolderId,
            )

    const visibleNoteIds = new Set(
        visibleNotes.map((note) => note.id),
    )

    const visibleNodes = boardNodes.filter((node) =>
        visibleNoteIds.has(node.noteId),
    )

    return (
        <section className="memo-board" aria-label="memo board">
            <div className="memo-board-toolbar">
                <button
                    className="memo-board-tool"
                    type="button"
                    onClick={createNote}
                >
                    + NEW
                </button>

                <button
                    className="memo-board-tool"
                    type="button"
                    disabled
                >
                    LINK
                </button>

                <button
                    className="memo-board-tool"
                    type="button"
                    disabled
                    >
                    UNLINK
                </button>

                <span className="memo-board-scale">
                    100%
                </span>
            </div>

            <div className="memo-board-viewport">
                <div className="memo-board-world">
                    {visibleNodes.map((node) => {
                        const note = notes.find(
                            (item) => item.id === node.noteId
                        )

                        if (!note) {
                            return null
                        }

                        return (
                            <article
                                className="memo-board-card"
                                key={node.id}
                                style={{
                                    left: `${node.x}px`,
                                    top: `${node.y}px`,
                                }}
                                >
                                <div className="memo-board-card-heading">
                                    <strong>
                                        {note.title || '제목 없음'}
                                    </strong>

                                    <span>
                                        {note.updatedAt}
                                    </span>
                                </div>

                                <p className="memo-board-card-content">
                                    {note.content || '내용 없음'}
                                </p>

                                <div
                                    className="memo-board-card-footer"
                                    aria-hidden="true"
                                    />
                            </article>
                        )
                    })}
                </div>
            </div>
        </section>

    )
}

export default BoardMemoPage