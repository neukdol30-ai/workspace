package com.kousei.workspace.memo.folder;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MemoFolderResponse {

    private final Long id;
    private final String name;
    private final boolean system;

    public static MemoFolderResponse from(
            MemoFolder folder
    ) {
        return new MemoFolderResponse(
                folder.getFolderId(),
                folder.getFolderName(),
                "Y".equals(folder.getSystemFlag())
        );
    }
}