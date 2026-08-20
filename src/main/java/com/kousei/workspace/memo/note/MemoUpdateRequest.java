package com.kousei.workspace.memo.note;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemoUpdateRequest {

    @Size(max = 255)
    private String title;

    private String content;
}