package com.kousei.workspace.memo.folder;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class MemoFolder {

    private Long folderId;
    private Long userId;
    private String folderName;
    private String systemFlag;
    private LocalDateTime createdAt;
}