import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import BoardNoteDetail from './BoardNoteDetail.jsx'
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

    const [boardScale, setBoardScale] = useState(1)
    const [isBoardDragging, setIsBoardDragging] = useState(false)

    const boardDragRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        startOffsetX: 0,
        startOffsetY: 0,
    })

    const [draggingNodeId, setDraggingNodeId] = useState(null)
    const [openedNoteId, setOpenedNoteId] = useState(null)
    const [toolMode, setToolMode] = useState('select')

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

    const openedNote =
        notes.find((note) => note.id === openedNoteId) ?? null

    function handleBoardWheel(event) {

        if (
            openedNote ||
            cardDragRef.current.active ||
            boardDragRef.current.active
        ) {
            return
        }

        const viewportRect =
            event.currentTarget.getBoundingClientRect()

        const pointerX =
            event.clientX - viewportRect.left

        const pointerY =
            event.clientY - viewportRect.top

        const scaleDirection =
            event.deltaY < 0 ? 0.1 : -0.1

        const nextScale = Math.min(
            2,
            Math.max(
                0.5,
                Number((boardScale + scaleDirection). toFixed(1)),
            ),
        )

        if (nextScale === boardScale) {
            return
        }

        const worldX =
            (pointerX - boardOffset.x) / boardScale

        const worldY =
            (pointerY - boardOffset.y) / boardScale

        setBoardOffset({
            x: pointerX - worldX * nextScale,
            y: pointerY - worldY * nextScale,
        })

        setBoardScale(nextScale)
    }

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

        event.stopPropagation()
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

        setBoardNodes((currentNodes) => {
            const selectedNode = currentNodes.find(
                (currentNode) => currentNode.id === node.id,
            )

            if (!selectedNode) {
                return currentNodes
            }

            return [
                ...currentNodes.filter(
                    (currentNode) => currentNode.id !== node.id,
                ),
                selectedNode,
            ]
        })
    }

    function handleCardPointerMove(event, node) {
        if(
            !cardDragRef.current.active ||
            cardDragRef.current.nodeId !== node.id
        ){
            return
        }

        event.stopPropagation()

        const screenDistanceX =
            event.clientX - cardDragRef.current.startX

        const screenDistanceY =
            event.clientY - cardDragRef.current.startY

        const distanceX =
            screenDistanceX / boardScale

        const distanceY =
            screenDistanceY / boardScale

        if (
            Math.abs(screenDistanceX) > 5 ||
            Math.abs(screenDistanceY) > 5
        ) {
            cardDragRef.current.didMove = true
        }

        setBoardNodes((currentNodes) =>
            currentNodes.map((currentNode) =>
                currentNode.id === node.id
                ? {
                ...currentNode,
                    x:
                        cardDragRef.current.startNodeX +
                        distanceX,

                    y:
                        cardDragRef.current.startNodeY +
                        distanceY,
                    }
                    :currentNode,
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

        const shouldOpenNote =
            event.type === 'pointerup' &&
            !cardDragRef.current.didMove

        cardDragRef.current.active = false

        if(event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
        }

        setDraggingNodeId(null)

        if (shouldOpenNote) {
            setOpenedNoteId(node.noteId)
        }
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
                    {Math.round(boardScale * 100)}%
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
                    backgroundSize:
                    `${32 * boardScale}px ${32 * boardScale}px`,
                }}
                onPointerDown={handleBoardPointerDown}
                onPointerMove={handleBoardPointerMove}
                onPointerUp={handleBoardPointerEnd}
                onPointerCancel={handleBoardPointerEnd}
                onWheel={handleBoardWheel}
            >
                <div
                    className="memo-board-world"
                    style={{
                        transform:
                            `translate(${boardOffset.x}px, ${boardOffset.y}px)
                            scale(${boardScale})
                            `,
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
                                className={`memo-board-card ${
                                    draggingNodeId === node.id
                                        ? 'memo-board-card--dragging'
                                        : ''
                                }`}
                                key={node.id}
                                style={{
                                    left: `${node.x}px`,
                                    top: `${node.y}px`,
                                }}
                                onPointerDown={(event) =>
                                    handleCardPointerDown(event, node)
                                }
                                onPointerMove={(event) =>
                                    handleCardPointerMove(event, node)
                                }
                                onPointerUp={(event) =>
                                    handleCardPointerEnd(event, node)
                                }
                                onPointerCancel={(event) =>
                                    handleCardPointerEnd(event, node)
                                }
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

            {openedNote && (
                <BoardNoteDetail
                    note={openedNote}
                    onClose={() => setOpenedNoteId(null)}
                />
            )}
        </section>
    )
}

export default BoardMemoPage