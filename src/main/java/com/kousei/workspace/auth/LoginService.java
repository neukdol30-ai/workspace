package com.kousei.workspace.auth;

import com.kousei.workspace.user.WorkspaceUser;
import com.kousei.workspace.user.WorkspaceUserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class LoginService {

    private final WorkspaceUserMapper workspaceUserMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    public LoginService(
            WorkspaceUserMapper workspaceUserMapper,
            PasswordEncoder passwordEncoder,
            JwtTokenService jwtTokenService
    ) {
        this.workspaceUserMapper = workspaceUserMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenService = jwtTokenService;
    }

    public LoginResponse login(
            LoginRequest request
    ) {
        String normalizedEmail =
                request
                        .getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT);

        WorkspaceUser user =
                workspaceUserMapper.findByEmail(
                        normalizedEmail
                );

        if (
                user == null ||
                        user.getPasswordHash() == null ||
                        user.getPasswordHash().isBlank() ||
                        !passwordEncoder.matches(
                                request.getPassword(),
                                user.getPasswordHash()
                        )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        String accessToken =
                jwtTokenService.createAccessToken(user);

        return new LoginResponse(
                accessToken,
                "Bearer",
                jwtTokenService
                        .getAccessTokenExpirationSeconds(),
                user.getUserId(),
                user.getEmail(),
                user.getUserName()
        );
    }
}