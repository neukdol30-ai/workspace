package com.kousei.workspace.memo.board.node;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BoardNodeResponse {

    private final Long memoId;
    private final Double x;
    private final Double y;
    private final Long stackOrder;

    public static BoardNodeResponse from(
            BoardNode node
    ) {
        return new BoardNodeResponse(
                node.getMemoId(),
                node.getPositionX(),
                node.getPositionY(),
                node.getStackOrder()
        );
    }
}