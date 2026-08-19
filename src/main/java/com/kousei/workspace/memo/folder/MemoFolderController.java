package com.kousei.workspace.memo.folder;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/folders")
public class MemoFolderController {

    private final MemoFolderService memoFolderService;

    @GetMapping
    public List<MemoFolderResponse> getFolders(
            @RequestParam
            @Positive
            Long userId
    ) {
        return memoFolderService.getFolders(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemoFolderResponse createFolder(
            @RequestParam
            @Positive
            Long userId,

            @Valid
            @RequestBody
            MemoFolderCreateRequest request
    ) {
        return memoFolderService.createFolder(
                userId,
                request
        );
    }

    @DeleteMapping("/{folderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteFolder(
            @PathVariable
            @Positive
            Long folderId,

            @RequestParam
            @Positive
            Long userId
    ) {
        memoFolderService.deleteFolder(
                userId,
                folderId
        );
    }
}