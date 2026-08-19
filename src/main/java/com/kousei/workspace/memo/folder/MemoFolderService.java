package com.kousei.workspace.memo.folder;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemoFolderService {

    private final MemoFolderMapper memoFolderMapper;

    public List<MemoFolderResponse> getFolders(
            Long userId
    ) {
        return memoFolderMapper
                .findAllByUserId(userId)
                .stream()
                .map(MemoFolderResponse::from)
                .toList();
    }

    @Transactional
    public MemoFolderResponse createFolder(
            Long userId,
            MemoFolderCreateRequest request
    ) {
        MemoFolder folder = new MemoFolder();

        folder.setUserId(userId);
        folder.setFolderName(request.getName().trim());
        folder.setSystemFlag("N");

        memoFolderMapper.insert(folder);

        return MemoFolderResponse.from(folder);
    }

    @Transactional
    public void deleteFolder(
            Long userId,
            Long folderId
    ) {
        MemoFolder folder =
                memoFolderMapper.findByIdAndUserId(
                        folderId,
                        userId
                );

        if (folder == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Folder not found"
            );
        }

        if ("Y".equals(folder.getSystemFlag())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "System folder cannot be deleted"
            );
        }

        memoFolderMapper.deleteByIdAndUserId(
                folderId,
                userId
        );
    }

}
