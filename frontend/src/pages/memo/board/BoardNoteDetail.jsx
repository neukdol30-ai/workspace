import { MdDeleteOutline } from 'react-icons/md'
import formatMemoUpdatedAt from '../../../utils/formatMemoUpdatedAt.js'
import './BoardNoteDetail.css'

function BoardNoteDetail({ note, onClose, onDelete }) {
    return (
        <div
            className="board-note-detail-layer"
            role="dialog"
            aria-modal="true"
            aria-label={note.title || 'Memo detail'}
            >
            <article className="board-note-detail">
                <header className="board-note-detail-header">
                    <span>MEMO DETAIL</span>

                    <div className="board-note-detail-actions">
                        <button
                            className="board-note-detail-delete"
                            type="button"
                            aria-label="Delete memo"
                            onClick={onDelete}
                        >
                            <MdDeleteOutline aria-hidden="true" />
                        </button>

                        <button
                            className="board-note-detail-close"
                            type="button"
                            aria-label="Close memo"
                            onClick={onClose}
                        >
                            x
                        </button>
                    </div>
                </header>

                <div className="board-note-detail-date">
                    {formatMemoUpdatedAt(note.updatedAt)}
                </div>

                <h2 className="board-note-detail-title">
                    {note.title || '제목 없음'}
                </h2>

                <div className="board-note-detail-content">
                    {note.content || '내용 없음'}
                </div>
            </article>
        </div>
    )
}

export default BoardNoteDetail
