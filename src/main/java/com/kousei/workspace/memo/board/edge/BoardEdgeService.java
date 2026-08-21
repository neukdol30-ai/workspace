package com.kousei.workspace.memo.board.edge;

import com.kousei.workspace.memo.note.Memo;
import com.kousei.workspace.memo.note.MemoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoardEdgeService {

    private final BoardEdgeMapper boardEdgeMapper;
    private final MemoMapper memoMapper;

    public List<BoardEdgeResponse> getEdges(
            Long userId
    ) {
        return boardEdgeMapper
                .findAllByUserId(userId)
                .stream()
                .map(BoardEdgeResponse::from)
                .toList();
    }

    @Transactional
    public BoardEdgeResponse createEdge(
            Long userId,
            BoardEdgeCreateRequest request
    ) {
        if (
                request.getSourceMemoId().equals(
                        request.getTargetMemoId()
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A memo cannot connect to itself"
            );
        }

        Memo sourceMemo =
                memoMapper.findByIdAndUserId(
                        request.getSourceMemoId(),
                        userId
                );

        Memo targetMemo =
                memoMapper.findByIdAndUserId(
                        request.getTargetMemoId(),
                        userId
                );

        if (sourceMemo == null || targetMemo == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Memo not found"
            );
        }

        boolean sourceInRequestedFolder =
                sourceMemo.getFolderId().equals(
                        request.getFolderId()
                );

        boolean targetInRequestedFolder =
                targetMemo.getFolderId().equals(
                        request.getFolderId()
                );

        if (
                !sourceInRequestedFolder ||
                        !targetInRequestedFolder
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Memos must belong to the same folder"
            );
        }

        BoardEdge existingEdge =
                boardEdgeMapper.findByMemoPairAndUserId(
                        request.getFolderId(),
                        request.getSourceMemoId(),
                        request.getTargetMemoId(),
                        userId
                );

        if (existingEdge != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Memos are already connected"
            );
        }

        BoardEdge edge = new BoardEdge();

        edge.setFolderId(request.getFolderId());
        edge.setSourceMemoId(
                request.getSourceMemoId()
        );
        edge.setTargetMemoId(
                request.getTargetMemoId()
        );
        edge.setEdgeType(
                request.getEdgeType() == null
                        ? "RELATED"
                        : request.getEdgeType()
        );

        int affectedRows =
                boardEdgeMapper.insert(edge);

        if (affectedRows == 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Board edge was not created"
            );
        }

        BoardEdge savedEdge =
                boardEdgeMapper.findByIdAndUserId(
                        edge.getEdgeId(),
                        userId
                );

        if (savedEdge == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Created board edge not found"
            );
        }

        return BoardEdgeResponse.from(savedEdge);
    }

    @Transactional
    public void deleteEdge(
            Long userId,
            Long edgeId
    ) {
        BoardEdge edge =
                boardEdgeMapper.findByIdAndUserId(
                        edgeId,
                        userId
                );

        if (edge == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Board edge not found"
            );
        }

        boardEdgeMapper.deleteByIdAndUserId(
                edgeId,
                userId
        );
    }
}