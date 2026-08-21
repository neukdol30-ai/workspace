package com.kousei.workspace.memo.board;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardNodeMapper {

    List<BoardNode> findAllByUserId(
            @Param("userId") Long userId
    );

    BoardNode findByMemoIdAndUserId(
            @Param("memoId") Long memoId,
            @Param("userId") Long userId
    );

    int upsertByMemoIdAndUserId(
            @Param("node") BoardNode node,
            @Param("userId") Long userId
    );
}
