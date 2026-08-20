package com.kousei.workspace.memo.note;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/memos")
public class MemoController {

    private final MemoService memoService;

    @GetMapping
    public List<MemoResponse> getMemos(
            @RequestParam
            @Positive
            Long userId
    ) {
        return memoService.getMemos(userId);
    }

    @GetMapping("/{memoId}")
    public MemoResponse getMemo(
            @PathVariable
            @Positive
            Long memoId,

            @RequestParam
            @Positive
            Long userId
    ) {
        return memoService.getMemo(
                userId,
                memoId
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemoResponse createMemo(
            @RequestParam
            @Positive
            Long userId,

            @Valid
            @RequestBody
            MemoCreateRequest request
    ) {
        return memoService.createMemo(
                userId,
                request
        );
    }

    @PatchMapping("/{memoId}")
    public MemoResponse updateMemo(
            @PathVariable
            @Positive
            Long memoId,

            @RequestParam
            @Positive
            Long userId,

            @Valid
            @RequestBody
            MemoUpdateRequest request
    ) {
        return memoService.updateMemo(
                userId,
                memoId,
                request
        );
    }

    @DeleteMapping("/{memoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMemo(
            @PathVariable
            @Positive
            Long memoId,

            @RequestParam
            @Positive
            Long userId
    ) {
        memoService.deleteMemo(
                userId,
                memoId
        );
    }
}