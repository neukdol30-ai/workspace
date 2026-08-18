import './BoardEdgeLayer.css'

function BoardEdgeLayer({
                            boardNodes,
                            visibleEdges,
                            visiblePinNodes,
                            pendingMemoId,
                            cardCenterX,
                            cardPinY,
                        }) {
    const boardNodesById = new Map(
        boardNodes.map((node) => [node.memoId, node]),
    )

    return (
        <svg
            className="memo-board-edges"
            aria-hidden="true"
        >
            {visibleEdges.map((edge) => {
                const sourceNode = boardNodesById.get(
                    edge.sourceMemoId,
                )

                const targetNode = boardNodesById.get(
                    edge.targetMemoId,
                )

                if (!sourceNode || !targetNode) {
                    return null
                }

                return (
                    <line
                        key={edge.id}
                        x1={sourceNode.x + cardCenterX}
                        y1={sourceNode.y + cardPinY}
                        x2={targetNode.x + cardCenterX}
                        y2={targetNode.y + cardPinY}
                    />
                )
            })}

            {visiblePinNodes.map((node) => (
                <circle
                    className={`memo-board-pin ${
                        pendingMemoId === node.memoId
                            ? 'memo-board-pin--pending'
                            : ''
                    }`}
                    key={`pin-${node.memoId}`}
                    cx={node.x + cardCenterX}
                    cy={node.y + cardPinY}
                    r="6"
                />
            ))}
        </svg>
    )
}

export default BoardEdgeLayer