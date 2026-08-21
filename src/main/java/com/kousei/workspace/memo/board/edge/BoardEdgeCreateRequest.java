package com.kousei.workspace.memo.board.edge;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardEdgeCreateRequest {

    @NotNull
    @Positive
    private Long folderId;

    @NotNull
    @Positive
    private Long sourceMemoId;

    @NotNull
    @Positive
    private Long targetMemoId;

    @Size(max = 30)
    @Pattern(
            regexp =
                    "RELATED|CAUSE|REFERENCE|CONTRADICTS|SEQUENCE"
    )
    private String edgeType;
}