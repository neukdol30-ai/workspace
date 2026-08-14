import './BoardNoteCard.css'

function BoardNoteCard({
                           node,
                           note,
                           isDragging,
                           isLinkPending,
                           onPointerDown,
                           onPointerMove,
                           onPointerUp,
                           onPointerCancel,
                       }) {
    return (
        <article
            className={`memo-board-card ${
                isDragging
                    ? 'memo-board-card--dragging'
                    : ''
            } ${
                isLinkPending
                    ? 'memo-board-card--link-pending'
                    : ''
            }`}
            style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
            }}
            onPointerDown={(event) =>
                onPointerDown(event, node)
            }
            onPointerMove={(event) =>
                onPointerMove(event, node)
            }
            onPointerUp={(event) =>
                onPointerUp(event, node)
            }
            onPointerCancel={(event) =>
                onPointerCancel(event, node)
            }
        >
            <div className="memo-board-card-heading">
                <strong>
                    {note.title || '제목 없음'}
                </strong>

                <span>{note.updatedAt}</span>
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
}

export default BoardNoteCard