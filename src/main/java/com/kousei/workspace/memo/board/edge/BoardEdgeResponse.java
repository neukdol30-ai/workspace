package com.kousei.workspace.memo.board.edge;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BoardEdgeResponse {

    private final Long id;
    private final Long folderId;
    private final Long sourceMemoId;
    private final Long targetMemoId;
    private final String edgeType;
    private final LocalDateTime createdAt;

    public static BoardEdgeResponse from(
            BoardEdge edge
    ) {
        return new BoardEdgeResponse(
                edge.getEdgeId(),
                edge.getFolderId(),
                edge.getSourceMemoId(),
                edge.getTargetMemoId(),
                edge.getEdgeType(),
                edge.getCreatedAt()
        );
    }
}