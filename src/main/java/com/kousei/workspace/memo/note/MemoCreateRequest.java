package com.kousei.workspace.memo.note;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemoCreateRequest {

    @NotNull
    @Positive
    private Long folderId;

    @Size(max = 255)
    private String title;

    private String content;
}