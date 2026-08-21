package com.kousei.workspace.memo.board.edge;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardEdgeMapper {

    List<BoardEdge> findAllByUserId(
            @Param("userId") Long userId
    );

    BoardEdge findByIdAndUserId(
            @Param("edgeId") Long edgeId,
            @Param("userId") Long userId
    );

    BoardEdge findByMemoPairAndUserId(
            @Param("folderId") Long folderId,
            @Param("sourceMemoId") Long sourceMemoId,
            @Param("targetMemoId") Long targetMemoId,
            @Param("userId") Long userId
    );

    int insert(BoardEdge edge);

    int deleteByIdAndUserId(
            @Param("edgeId") Long edgeId,
            @Param("userId") Long userId
    );
}