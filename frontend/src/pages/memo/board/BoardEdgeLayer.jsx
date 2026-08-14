import './BoardEdgeLayer.css'

function BoardEdgeLayer({
                            boardNodes,
                            visibleEdges,
                            visiblePinNodes,
                            pendingNodeId,
                            cardCenterX,
                            cardPinY,
                        }) {
    const boardNodesById = new Map(
        boardNodes.map((node) => [node.id, node]),
    )

    return (
        <svg
            className="memo-board-edges"
            aria-hidden="true"
        >
            {visibleEdges.map((edge) => {
                const sourceNode = boardNodesById.get(
                    edge.sourceNodeId,
                )

                const targetNode = boardNodesById.get(
                    edge.targetNodeId,
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
                        pendingNodeId === node.id
                            ? 'memo-board-pin--pending'
                            : ''
                    }`}
                    key={`pin-${node.id}`}
                    cx={node.x + cardCenterX}
                    cy={node.y + cardPinY}
                    r="6"
                />
            ))}
        </svg>
    )
}

export default BoardEdgeLayer