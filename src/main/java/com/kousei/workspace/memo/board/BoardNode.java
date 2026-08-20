package com.kousei.workspace.memo.board;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardNode {

    private Long memoId;
    private Double positionX;
    private Double positionY;
    private Long stackOrder;
}