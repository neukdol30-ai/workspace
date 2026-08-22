package com.kousei.workspace.memo.folder;

import com.kousei.workspace.auth.JwtUserIdExtractor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/folders")
public class MemoFolderController {

    private final MemoFolderService memoFolderService;
    private final JwtUserIdExtractor jwtUserIdExtractor;

    @GetMapping
    public List<MemoFolderResponse> getFolders(
            @AuthenticationPrincipal
            Jwt jwt
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

        return memoFolderService.getFolders(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemoFolderResponse createFolder(
            @AuthenticationPrincipal
            Jwt jwt,

            @Valid
            @RequestBody
            MemoFolderCreateRequest request
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

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

            @AuthenticationPrincipal
            Jwt jwt
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

        memoFolderService.deleteFolder(
                userId,
                folderId
        );
    }
}