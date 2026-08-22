package com.kousei.workspace.memo.board.node;

import com.kousei.workspace.auth.JwtUserIdExtractor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board/nodes")
public class BoardNodeController {

    private final BoardNodeService boardNodeService;
    private final JwtUserIdExtractor jwtUserIdExtractor;

    @GetMapping
    public List<BoardNodeResponse> getNodes(
            @AuthenticationPrincipal
            Jwt jwt
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

        return boardNodeService.getNodes(userId);
    }

    @PutMapping("/{memoId}")
    public BoardNodeResponse saveNode(
            @PathVariable
            @Positive
            Long memoId,

            @AuthenticationPrincipal
            Jwt jwt,

            @Valid
            @RequestBody
            BoardNodeSaveRequest request
    ) {
        Long userId =
                jwtUserIdExtractor.extract(jwt);

        return boardNodeService.saveNode(
                userId,
                memoId,
                request
        );
    }
}