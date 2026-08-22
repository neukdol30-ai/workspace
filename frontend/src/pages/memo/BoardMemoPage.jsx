import { useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import BoardNoteDetail from './board/BoardNoteDetail.jsx'
import BoardNoteCard from './board/BoardNoteCard.jsx'
import BoardEdgeLayer from './board/BoardEdgeLayer.jsx'
import BoardToolbar from './board/BoardToolbar.jsx'
import ConfirmDialog from "../../component/common/ConfirmDialog.jsx";
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
        selectedFolderId,
        createNote,
        deleteNote,
        saveBoardNode,
        createBoardEdge,
        deleteBoardEdge,
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

    const [draggingMemoId, setDraggingMemoId] = useState(null)
    const [openedNoteId, setOpenedNoteId] = useState(null)
    const [notePendingDelete, setNotePendingDelete] = useState(null)
    const [toolMode, setToolMode] = useState('select')
    const [pendingMemoId, setPendingMemoId] = useState(null)

    const cardDragRef = useRef({
        active: false,
        memoId: null,
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

    const visibleNodes = boardNodes
        .filter((node) =>
        visibleNoteIds.has(node.memoId),
    )
        .sort(
            (firstNode, secondNode) =>
                firstNode.stackOrder - secondNode.stackOrder,
        )

    const visibleMemoIds = new Set(
        visibleNodes.map((node) => node.memoId),
    )

    const visibleEdges = boardEdges.filter(
        (edge) =>
            edge.folderId === selectedFolderId &&
            visibleMemoIds.has(edge.sourceMemoId) &&
            visibleMemoIds.has(edge.targetMemoId),
    )

    const connectedMemoIds = new Set(
        visibleEdges.flatMap((edge) => [
            edge.sourceMemoId,
            edge.targetMemoId,
        ]),
    )

    const visiblePinNodes =
        toolMode === 'link'
            ? visibleNodes
            : visibleNodes.filter((node) =>
                connectedMemoIds.has(node.memoId),
            )

    const openedNote =
        notes.find((note) => note.id === openedNoteId) ?? null

    function handleDeleteOpenedNote() {
        if (!openedNote) {
            return
        }

        setNotePendingDelete(openedNote)
    }

    async function handleConfirmDelete() {
        if (!notePendingDelete) {
            return
        }

        const deleted = await deleteNote(
            notePendingDelete.id,
        )

        if (!deleted) {
            return
        }

        setNotePendingDelete(null)
        setOpenedNoteId(null)
        setPendingMemoId(null)
    }

    function handleToolChange(nextMode) {
        setPendingMemoId(null)

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

    async function bringNodeToFront(
        memoId,
        positionOverride = null,
    ) {
        const currentNode =
            boardNodes.find(
                (node) => node.memoId === memoId,
            )

        if (!currentNode) {
            return null
        }

        const nextStackOrder =
            boardNodes.reduce(
                (highest, node) =>
                    Math.max(
                        highest,
                        node.stackOrder ?? 0,
                    ),
                0,
            ) + 1

        const nextNode = {
            ...currentNode,
            ...(positionOverride ?? {}),
            stackOrder: nextStackOrder,
        }

        setBoardNodes((currentNodes) =>
            currentNodes.map((node) =>
                node.memoId === memoId
                    ? nextNode
                    : node,
            ),
        )

        return saveBoardNode(nextNode)
    }

    async function handleCardPointerEnd(
        event,
        node,
    ) {
        if (
            !cardDragRef.current.active ||
            cardDragRef.current.memoId !==
            node.memoId
        ) {
            return
        }

        event.stopPropagation()

        const dragState = cardDragRef.current

        const shouldOpenNote =
            event.type === 'pointerup' &&
            !dragState.didMove

        const latestNode =
            boardNodes.find(
                (currentNode) =>
                    currentNode.memoId ===
                    node.memoId,
            ) ?? node

        let finalPosition = null

        if (dragState.didMove) {
            if (event.type === 'pointerup') {
                const screenDistanceX =
                    event.clientX - dragState.startX

                const screenDistanceY =
                    event.clientY - dragState.startY

                finalPosition = {
                    x:
                        dragState.startNodeX +
                        screenDistanceX / boardScale,

                    y:
                        dragState.startNodeY +
                        screenDistanceY / boardScale,
                }
            } else {
                finalPosition = {
                    x: latestNode.x,
                    y: latestNode.y,
                }
            }
        }

        cardDragRef.current.active = false

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            )
        }

        setDraggingMemoId(null)

        await bringNodeToFront(
            node.memoId,
            finalPosition,
        )

        if (!shouldOpenNote) {
            return
        }

        if (toolMode === 'select') {
            setOpenedNoteId(node.memoId)
            return
        }

        if (toolMode === 'link') {
            handleLinkNode(node.memoId)
            return
        }

        if (toolMode === 'unlink') {
            handleUnlinkNode(node.memoId)
        }
    }

    function handleCardPointerDown(event, node) {
        if (
            event.pointerType === 'mouse' &&
            event.button !== 0
        ) {
            return
        }

        event.stopPropagation()

        event.currentTarget.setPointerCapture(
            event.pointerId,
        )

        cardDragRef.current = {
            active: true,
            memoId: node.memoId,
            startX: event.clientX,
            startY: event.clientY,
            startNodeX: node.x,
            startNodeY: node.y,
            didMove: false,
        }

        setDraggingMemoId(node.memoId)
    }

    function handleCardPointerMove(event, node) {
        if(
            !cardDragRef.current.active ||
            cardDragRef.current.memoId !== node.memoId
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
                currentNode.memoId === node.memoId
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

    async function handleLinkNode(memoId) {
        if (pendingMemoId === null) {
            setPendingMemoId(memoId)
            return
        }

        if (pendingMemoId === memoId) {
            setPendingMemoId(null)
            return
        }

        const sourceMemoId = pendingMemoId
        const targetMemoId = memoId

        const alreadyConnected =
            boardEdges.some((edge) => {
                const sameDirection =
                    edge.sourceMemoId ===
                    sourceMemoId &&
                    edge.targetMemoId ===
                    targetMemoId

                const oppositeDirection =
                    edge.sourceMemoId ===
                    targetMemoId &&
                    edge.targetMemoId ===
                    sourceMemoId

                return (
                    edge.folderId ===
                    selectedFolderId &&
                    (
                        sameDirection ||
                        oppositeDirection
                    )
                )
            })

        setPendingMemoId(null)

        if (alreadyConnected) {
            return
        }

        await createBoardEdge({
            folderId: selectedFolderId,
            sourceMemoId,
            targetMemoId,
            edgeType: 'RELATED',
        })
    }

    async function handleUnlinkNode(memoId) {
        if (pendingMemoId === null) {
            setPendingMemoId(memoId)
            return
        }

        if (pendingMemoId === memoId) {
            setPendingMemoId(null)
            return
        }

        const sourceMemoId = pendingMemoId
        const targetMemoId = memoId

        const edgeToDelete =
            boardEdges.find((edge) => {
                const sameDirection =
                    edge.sourceMemoId ===
                    sourceMemoId &&
                    edge.targetMemoId ===
                    targetMemoId

                const oppositeDirection =
                    edge.sourceMemoId ===
                    targetMemoId &&
                    edge.targetMemoId ===
                    sourceMemoId

                return (
                    edge.folderId ===
                    selectedFolderId &&
                    (
                        sameDirection ||
                        oppositeDirection
                    )
                )
            })

        setPendingMemoId(null)

        if (!edgeToDelete) {
            return
        }

        await deleteBoardEdge(edgeToDelete.id)
    }

    if (selectedFolderId === 'all') {
        return (
            <section
                className="memo-board"
                aria-label="Memo board unavailable"
            >
                <div className="memo-board-unavailable">
                    <div
                        className="memo-board-unavailable-panel"
                        role="status"
                    >
                    <span className="memo-board-unavailable-code">
                        BOARD / LOCKED
                    </span>

                        <h2>SELECT A FOLDER</h2>

                        <p>
                            보드를 사용하려면 실제 폴더를
                            선택하세요.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="memo-board" aria-label="memo board">
            <BoardToolbar
                toolMode={toolMode}
                boardScale={boardScale}
                onCreateNote={handleCreateBoardNote}
                onSelectTool={handleSelectTool}
                onToolChange={handleToolChange}
            />

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
                    <BoardEdgeLayer
                        boardNodes={boardNodes}
                        visibleEdges={visibleEdges}
                        visiblePinNodes={visiblePinNodes}
                        pendingMemoId={pendingMemoId}
                        cardCenterX={CARD_CENTER_X}
                        cardPinY={CARD_PIN_Y}
                    />

                    {visibleNodes.map((node) => {
                        const note = notes.find(
                            (item) => item.id === node.memoId,
                        )

                        if (!note) {
                            return null
                        }

                        return (
                            <BoardNoteCard
                                key={node.memoId}
                                node={node}
                                note={note}
                                isDragging={draggingMemoId === node.memoId}
                                isLinkPending={pendingMemoId === node.memoId}
                                onPointerDown={handleCardPointerDown}
                                onPointerMove={handleCardPointerMove}
                                onPointerUp={handleCardPointerEnd}
                                onPointerCancel={handleCardPointerEnd}
                            />
                        )
                    })}
                </div>
            </div>

            {openedNote && (
                <BoardNoteDetail
                    note={openedNote}
                    onClose={() => setOpenedNoteId(null)}
                    onDelete={handleDeleteOpenedNote}
                />
            )}

            <ConfirmDialog
                isOpen={notePendingDelete !== null}
                title="DELETE MEMO"
                message={
                `"${notePendingDelete?.title?.trim() ||
                '제목 없음'}" ` +
                    '메모를 삭제할까요?'
                }
                confirmLabel="DELETE"
                cancelLabel="CANCEL"
                onConfirm={handleConfirmDelete}
                onCancel={() => setNotePendingDelete(null)}
                />

        </section>
    )
}

export default BoardMemoPage