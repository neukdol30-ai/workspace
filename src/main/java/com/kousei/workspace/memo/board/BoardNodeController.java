package com.kousei.workspace.memo.board;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board/nodes")
public class BoardNodeController {

    private final BoardNodeService boardNodeService;

    @GetMapping
    public List<BoardNodeResponse> getNodes(
            @RequestParam
            @Positive
            Long userId
    ) {
        return boardNodeService.getNodes(userId);
    }

    @PutMapping("/{memoId}")
    public BoardNodeResponse saveNode(
            @PathVariable
            @Positive
            Long memoId,

            @RequestParam
            @Positive
            Long userId,

            @Valid
            @RequestBody
            BoardNodeSaveRequest request
    ) {
        return boardNodeService.saveNode(
                userId,
                memoId,
                request
        );
    }
}