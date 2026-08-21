package com.kousei.workspace.memo.board.node;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardNodeService {

    private final BoardNodeMapper boardNodeMapper;

    public List<BoardNodeResponse> getNodes(
            Long userId
    ) {
        return boardNodeMapper
                .findAllByUserId(userId)
                .stream()
                .map(BoardNodeResponse::from)
                .toList();
    }

    @Transactional
    public BoardNodeResponse saveNode(
            Long userId,
            Long memoId,
            BoardNodeSaveRequest request
    ) {
        BoardNode node = new BoardNode();

        node.setMemoId(memoId);
        node.setPositionX(request.getX());
        node.setPositionY(request.getY());
        node.setStackOrder(request.getStackOrder());

        int affectedRows =
                boardNodeMapper.upsertByMemoIdAndUserId(
                        node,
                        userId
                );

        if (affectedRows == 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Memo not found"
            );
        }

        BoardNode savedNode =
                boardNodeMapper.findByMemoIdAndUserId(
                        memoId,
                        userId
                );

        if (savedNode == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Board node not found"
            );
        }

        return BoardNodeResponse.from(savedNode);
    }
}