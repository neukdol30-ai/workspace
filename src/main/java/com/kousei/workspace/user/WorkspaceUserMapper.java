package com.kousei.workspace.user;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface WorkspaceUserMapper {

    WorkspaceUser findByEmail(
            @Param("email") String email
    );
}