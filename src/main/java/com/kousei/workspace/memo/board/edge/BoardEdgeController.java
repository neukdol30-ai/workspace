package com.kousei.workspace.memo.board.edge;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/board/edges")
public class BoardEdgeController {

    private final BoardEdgeService boardEdgeService;

    @GetMapping
    public List<BoardEdgeResponse> getEdges(
            @RequestParam
            @Positive
            Long userId
    ) {
        return boardEdgeService.getEdges(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardEdgeResponse createEdge(
            @RequestParam
            @Positive
            Long userId,

            @Valid
            @RequestBody
            BoardEdgeCreateRequest request
    ) {
        return boardEdgeService.createEdge(
                userId,
                request
        );
    }

    @DeleteMapping("/{edgeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEdge(
            @PathVariable
            @Positive
            Long edgeId,

            @RequestParam
            @Positive
            Long userId
    ) {
        boardEdgeService.deleteEdge(
                userId,
                edgeId
        );
    }
}