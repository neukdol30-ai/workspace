import './BoardToolbar.css'

function BoardToolbar({
                          toolMode,
                          boardScale,
                          onCreateNote,
                          onSelectTool,
                          onToolChange,
                      }) {
    return (
        <div className="memo-board-toolbar">
            <button
                className="memo-board-tool"
                type="button"
                onClick={onCreateNote}
            >
                + NEW
            </button>

            <button
                className={`memo-board-tool ${
                    toolMode === 'select'
                        ? 'memo-board-tool--active'
                        : ''
                }`}
                type="button"
                aria-pressed={toolMode === 'select'}
                onClick={onSelectTool}
            >
                SELECT
            </button>

            <button
                className={`memo-board-tool ${
                    toolMode === 'link'
                        ? 'memo-board-tool--active'
                        : ''
                }`}
                type="button"
                aria-pressed={toolMode === 'link'}
                onClick={() => onToolChange('link')}
            >
                LINK
            </button>

            <button
                className={`memo-board-tool ${
                    toolMode === 'unlink'
                        ? 'memo-board-tool--active'
                        : ''
                }`}
                type="button"
                aria-pressed={toolMode === 'unlink'}
                onClick={() => onToolChange('unlink')}
            >
                UNLINK
            </button>

            <span className="memo-board-scale">
                {Math.round(boardScale * 100)}%
            </span>
        </div>
    )
}

export default BoardToolbar