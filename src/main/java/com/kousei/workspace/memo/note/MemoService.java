package com.kousei.workspace.memo.note;

import com.kousei.workspace.memo.folder.MemoFolder;
import com.kousei.workspace.memo.folder.MemoFolderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemoService {

    private final MemoMapper memoMapper;
    private final MemoFolderMapper memoFolderMapper;

    public List<MemoResponse> getMemos(Long userId) {
        return memoMapper
                .findAllByUserId(userId)
                .stream()
                .map(MemoResponse::from)
                .toList();
    }

    public MemoResponse getMemo(
            Long userId,
            Long memoId
    ) {
        return MemoResponse.from(
                findMemoOrThrow(userId, memoId)
        );
    }

    @Transactional
    public MemoResponse createMemo(
            Long userId,
            MemoCreateRequest request
    ) {
        MemoFolder folder =
                memoFolderMapper.findByIdAndUserId(
                        request.getFolderId(),
                        userId
                );

        if (folder == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Folder not found"
            );
        }

        Memo memo = new Memo();

        memo.setFolderId(request.getFolderId());
        memo.setTitle(
                request.getTitle() == null
                        ? "새 메모"
                        : request.getTitle()
        );
        memo.setContent(
                request.getContent() == null
                        ? ""
                        : request.getContent()
        );

        memoMapper.insert(memo);

        return MemoResponse.from(
                findMemoOrThrow(
                        userId,
                        memo.getMemoId()
                )
        );
    }

    @Transactional
    public MemoResponse updateMemo(
            Long userId,
            Long memoId,
            MemoUpdateRequest request
    ) {
        Memo memo = findMemoOrThrow(
                userId,
                memoId
        );

        if (request.getTitle() != null) {
            memo.setTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            memo.setContent(request.getContent());
        }

        memoMapper.updateByIdAndUserId(
                memo,
                userId
        );

        return MemoResponse.from(
                findMemoOrThrow(userId, memoId)
        );
    }

    @Transactional
    public void deleteMemo(
            Long userId,
            Long memoId
    ) {
        findMemoOrThrow(userId, memoId);

        memoMapper.deleteByIdAndUserId(
                memoId,
                userId
        );
    }

    private Memo findMemoOrThrow(
            Long userId,
            Long memoId
    ) {
        Memo memo =
                memoMapper.findByIdAndUserId(
                        memoId,
                        userId
                );

        if (memo == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Memo not found"
            );
        }

        return memo;
    }
}