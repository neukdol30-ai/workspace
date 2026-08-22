package com.kousei.workspace.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class WorkspaceUser {

    private Long userId;
    private String email;
    private String passwordHash;
    private String userName;
    private LocalDateTime createdAt;
}