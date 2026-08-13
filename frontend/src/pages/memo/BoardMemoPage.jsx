import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import './BoardMemoPage.css'

function BoardMemoPage() {
    const {
        notes,
        boardNodes,
        setBoardNodes,
        selectedFolderId,
        createNote,
    } = useOutletContext()

    const [boardOffset, setBoardOffset] = useState({
        x: 0,
        y: 0,
    })

    const [isBoardDragging, setIsBoardDragging] = useState(false)

    const boardDragRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        startOffsetX: 0,
        startOffsetY: 0,
    })

    const [draggingNodeId, setDraggingNodeId] = useState(null)

    const cardDragRef = useRef({
        active: false,
        nodeId: null,
        startX: 0,
        startY: 0,
        startNodeX: 0,
        startNodeY: 0,
        didMove: false,
    })

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

    function handleBoardPointerDown(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return
        }

        if (event.target.closest('.memo-board-card')) {
            return
        }

        event.currentTarget.setPointerCapture(event.pointerId)

        boardDragRef.current = {
            active: true,
            startX: event.clientX,
            startY: event.clientY,
            startOffsetX: boardOffset.x,
            startOffsetY: boardOffset.y,
        }

        setIsBoardDragging(true)
    }

    function handleBoardPointerMove(event) {
        if (!boardDragRef.current.active) {
            return
        }

        const distanceX =
            event.clientX - boardDragRef.current.startX

        const distanceY =
            event.clientY - boardDragRef.current.startY

        setBoardOffset({
            x: boardDragRef.current.startOffsetX + distanceX,
            y: boardDragRef.current.startOffsetY + distanceY,
        })
    }

    function handleBoardPointerEnd(event) {
        if (!boardDragRef.current.active) {
            return
        }

        boardDragRef.current.active = false

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        setIsBoardDragging(false)
    }

    function handleCardPointerDown(event, node) {
        if (event.pointerType === 'mouse' && event.button !== 0) {
            return
        }

        event.soptPropagation()
        event.currentTarget.setPointerCapture(event.pointerId)

        cardDragRef.current = {
            active: true,
            nodeId: node.id,
            startX: event.clientX,
            startY: event.clientY,
            startNodeX: node.x,
            startNodeY: node.y,
            didMove: false,
        }

        setDraggingNodeId(node.id)
    }

    function handleCardPointerMove(event, node) {
        if(
            !cardDragRef.current.active ||
            cardDragRef.current.nodeId !== node.id
        ){
            return
        }

        event.stopPropagation()

        const distanceX =
            event.clientX - cardDragRef.current.startX

        const distanceY =
            event.clientY - cardDragRef.current.startY

        if (
            Math.abs(distanceX) > 5 ||
            Math.abs(distanceY) > 5
        ) {
            cardDragRef.current.didMove = true
        }

        setBoardNodes((currentNodes) =>
            currentNodes.map((currentNode) =>
                currentNodes.id === node.id
                ? {
                ...currentNodes,
                    x:
                        cardDragRef.current.startNodeX +
                        distanceX,

                    y:
                        cardDragRef.current.startNodeY +
                        distanceY,
                    }
                    :currentNodes,
            ),
        )
    }

    function handleCardPointerEnd(event, node) {
        if (
            !cardDragRef.current.active ||
            cardDragRef.current.nodeId !== node.id
        ) {
            return
        }

        event.stopPropagation()
        cardDragRef.current.didMove = false

        if(event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        setDraggingNodeId(null)
    }

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

            <div
                className={`memo-board-viewport ${
                    isBoardDragging
                        ? 'memo-board-viewport--dragging'
                        : ''
                }`}
                style={{
                    backgroundPosition:
                        `${boardOffset.x}px ${boardOffset.y}px`,
                }}
                onPointerDown={handleBoardPointerDown}
                onPointerMove={handleBoardPointerMove}
                onPointerUp={handleBoardPointerEnd}
                onPointerCancel={handleBoardPointerEnd}
            >
                <div
                    className="memo-board-world"
                    style={{
                        transform:
                            `translate(${boardOffset.x}px, ${boardOffset.y}px)`,
                    }}
                >
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