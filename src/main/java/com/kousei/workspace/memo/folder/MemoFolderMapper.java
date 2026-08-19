package com.kousei.workspace.memo.folder;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemoFolderMapper {

    List<MemoFolder> findAllByUserId(
            @Param("userId") Long userId
    );

    MemoFolder findByIdAndUserId(
            @Param("folderId") Long folderId,
            @Param("userId") Long userId
    );

    int insert(MemoFolder folder);

    int deleteByIdAndUserId(
            @Param("folderId") Long folderId,
            @Param("userId") Long userId
    );
}