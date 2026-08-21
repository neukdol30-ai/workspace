package com.kousei.workspace.memo.board.edge;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BoardEdge {

    private Long edgeId;
    private Long folderId;
    private Long sourceMemoId;
    private Long targetMemoId;
    private String edgeType;
    private LocalDateTime createdAt;
}