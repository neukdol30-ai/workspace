package com.kousei.workspace.memo.board.node;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BoardNodeSaveRequest {

    @NotNull
    private Double x;

    @NotNull
    private Double y;

    @NotNull
    @PositiveOrZero
    private Long stackOrder;
}