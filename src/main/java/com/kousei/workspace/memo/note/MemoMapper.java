package com.kousei.workspace.memo.note;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MemoMapper {

    List<Memo> findAllByUserId(
            @Param("userId") Long userId
    );

    Memo findByIdAndUserId(
            @Param("memoId") Long memoId,
            @Param("userId") Long userId
    );

    int insert(Memo memo);

    int updateByIdAndUserId(
            @Param("memo") Memo memo,
            @Param("userId") Long userId
    );

    int deleteByIdAndUserId(
            @Param("memoId") Long memoId,
            @Param("userId") Long userId
    );
}