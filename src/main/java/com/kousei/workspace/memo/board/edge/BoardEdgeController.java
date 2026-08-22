package com.kousei.workspace.memo.board.edge;

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
@RequestMapping("/api/board/edges")
public class BoardEdgeController {

    private final BoardEdgeService boardEdgeService;
    private final JwtUserIdExtractor jwtUserIdExtractor;

    @GetMapping
    public List<BoardEdgeResponse> getEdges(
            @AuthenticationPrincipal
            Jwt jwt
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

        return boardEdgeService.getEdges(userId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoardEdgeResponse createEdge(
            @AuthenticationPrincipal
            Jwt jwt,

            @Valid
            @RequestBody
            BoardEdgeCreateRequest request
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

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

            @AuthenticationPrincipal
            Jwt jwt
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

        boardEdgeService.deleteEdge(
                userId,
                edgeId
        );
    }
}