package com.kousei.workspace.memo.note;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class MemoResponse {

    private final Long id;
    private final Long folderId;
    private final String title;
    private final String content;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public static MemoResponse from(Memo memo) {
        return new MemoResponse(
                memo.getMemoId(),
                memo.getFolderId(),
                memo.getTitle(),
                memo.getContent(),
                memo.getCreatedAt(),
                memo.getUpdatedAt()
        );
    }
}