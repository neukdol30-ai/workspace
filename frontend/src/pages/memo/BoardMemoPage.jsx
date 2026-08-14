import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import BoardNoteDetail from './BoardNoteDetail.jsx'
import './BoardMemoPage.css'

const CARD_CENTER_X = 110
const CARD_CENTER_Y = 75
const CARD_PIN_Y = 10

const CREATE_CASCADE_GAP = 24
const CREATE_CASCADE_COUNT = 7

function BoardMemoPage() {
    const {
        notes,
        boardNodes,
        setBoardNodes,
        boardEdges,
        setBoardEdges,
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

    const boardViewportRef = useRef(null)
    const createCascadeRef = useRef(0)

    const [draggingNodeId, setDraggingNodeId] = useState(null)
    const [openedNoteId, setOpenedNoteId] = useState(null)
    const [toolMode, setToolMode] = useState('select')
    const [pendingNodeId, setPendingNodeId] = useState(null)

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

    const visibleNodeIds = new Set(
        visibleNodes.map((node) => node.id),
    )

    const visibleEdges = boardEdges.filter(
        (edge) =>
            visibleNodeIds.has(edge.sourceNodeId) &&
            visibleNodeIds.has(edge.targetNodeId),
    )

    const connectedNodeIds = new Set(
        visibleEdges.flatMap((edge) => [
            edge.sourceNodeId,
            edge.targetNodeId,
        ]),
    )

    const visiblePinNodes =
        toolMode === 'link'
            ? visibleNodes
            : visibleNodes.filter((node) =>
                connectedNodeIds.has(node.id),
            )

    const openedNote =
        notes.find((note) => note.id === openedNoteId) ?? null

    function handleToolChange(nextMode) {
        setPendingNodeId(null)

        setToolMode((currentMode) =>
            currentMode === nextMode ? 'select' : nextMode,
        )
    }

    function handleSelectTool() {
        setToolMode('select')
        setOpenedNoteId(null)
    }

    function handleCreateBoardNote() {
        const viewport = boardViewportRef.current

        if (!viewport) {
            createNote()
            return
        }

        const cascadeIndex = createCascadeRef.current

        createCascadeRef.current =
            (cascadeIndex + 1) % CREATE_CASCADE_COUNT

        const centerWorldX =
            (viewport.clientWidth / 2 - boardOffset.x) / boardScale

        const centerWorldY =
            (viewport.clientHeight / 2 - boardOffset.y) / boardScale

        createNote({
            boardPosition: {
                x:
                    centerWorldX -
                    CARD_CENTER_X +
                    cascadeIndex * CREATE_CASCADE_GAP,

                y:
                    centerWorldY -
                    CARD_CENTER_Y +
                    cascadeIndex * CREATE_CASCADE_GAP,
            },
        })
    }

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

    function bringNodeToFront(nodeId) {
        setBoardNodes((currentNodes) => {
            const selectedNode = currentNodes.find(
                (currentNode) => currentNode.id === nodeId,
            )

            if (!selectedNode) {
                return currentNodes
            }

            return [
                ...currentNodes.filter(
                    (currentNode) => currentNode.id !== nodeId,
                ),
                selectedNode,
            ]
        })
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

        // setBoardNodes((currentNodes) => {
        //     const selectedNode = currentNodes.find(
        //         (currentNode) => currentNode.id === node.id,
        //     )
        //
        //     if (!selectedNode) {
        //         return currentNodes
        //     }
        //
        //     return [
        //         ...currentNodes.filter(
        //             (currentNode) => currentNode.id !== node.id,
        //         ),
        //         selectedNode,
        //     ]
        // })
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
        bringNodeToFront(node.id)

        if (!shouldOpenNote) {
            return
        }

        if (toolMode === 'select') {
            setOpenedNoteId(node.noteId)
            return
        }

        if (toolMode === 'link') {
            handleLinkNode(node.id)
            return
        }

        if (toolMode === 'unlink') {
            handleUnlinkNode(node.id)
        }
    }

    function handleLinkNode(nodeId) {
        if (pendingNodeId === null) {
            setPendingNodeId(nodeId)
            return
        }

        if (pendingNodeId === nodeId) {
            setPendingNodeId(null)
            return
        }

        setBoardEdges((currentEdges) => {
            const alreadyConnected = currentEdges.some((edge) => {
                const sameDirection =
                    edge.sourceNodeId === pendingNodeId &&
                    edge.targetNodeId === nodeId

                const oppositeDirection =
                    edge.sourceNodeId === nodeId &&
                    edge.targetNodeId === pendingNodeId

                return sameDirection || oppositeDirection
            })

            if (alreadyConnected) {
                return currentEdges
            }

            return [
                ...currentEdges,
                {
                    id: `edge-${Date.now()}`,
                    sourceNodeId: pendingNodeId,
                    targetNodeId: nodeId,
                }
            ]
        })
        setPendingNodeId(null)
    }

    function handleUnlinkNode(nodeId) {
        if (pendingNodeId === null) {
            setPendingNodeId(nodeId)
            return
        }

        if (pendingNodeId === nodeId) {
            setPendingNodeId(null)
            return
        }

        setBoardEdges((currentEdges) =>
            currentEdges.filter((edge) => {
                const sameDirection =
                    edge.sourceNodeId === pendingNodeId &&
                    edge.targetNodeId === nodeId

                    const oppositeDirection =
                        edge.sourceNodeId === nodeId &&
                        edge.targetNodeId === pendingNodeId

                return !sameDirection && !oppositeDirection
            }),
        )
        setPendingNodeId(null)
    }

    return (
        <section className="memo-board" aria-label="memo board">
            <div className="memo-board-toolbar">
                <button
                    className="memo-board-tool"
                    type="button"
                    onClick={handleCreateBoardNote}
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
                    onClick={handleSelectTool}
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
                    onClick={() => handleToolChange('link')}
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
                    onClick={() => handleToolChange('unlink')}
                    >
                    UNLINK
                </button>

                <span className="memo-board-scale">
                    {Math.round(boardScale * 100)}%
                </span>
            </div>

            <div
                ref={boardViewportRef}
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
                    <svg
                        className="memo-board-edges"
                        aria-hidden="true"
                    >
                        {visibleEdges.map((edge) => {
                            const sourceNode = boardNodes.find(
                                (node) => node.id === edge.sourceNodeId,
                            )

                            const targetNode = boardNodes.find(
                                (node) => node.id === edge.targetNodeId,
                            )

                            if (!sourceNode || !targetNode) {
                                return null
                            }

                            return (
                                <line
                                    key={edge.id}
                                    x1={sourceNode.x + CARD_CENTER_X}
                                    y1={sourceNode.y + CARD_PIN_Y}
                                    x2={targetNode.x + CARD_CENTER_X}
                                    y2={targetNode.y + CARD_PIN_Y}
                                />
                            )
                        })}

                        {visiblePinNodes.map((node) => (
                            <circle
                                className={`memo-board-pin ${
                                    pendingNodeId === node.id
                                        ? 'memo-board-pin--pending'
                                        : ''
                                }`}
                                key={`pin-${node.id}`}
                                cx={node.x + CARD_CENTER_X}
                                cy={node.y + CARD_PIN_Y}
                                r="6"
                            />
                        ))}
                    </svg>

                    {visibleNodes.map((node) => {
                        const note = notes.find(
                            (item) => item.id === node.noteId,
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
                                } ${
                                    pendingNodeId === node.id
                                        ? 'memo-board-card--link-pending'
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