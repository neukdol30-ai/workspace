package com.kousei.workspace.auth;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private final String accessToken;
    private final String tokenType;
    private final long expiresIn;
    private final Long userId;
    private final String email;
    private final String userName;
}