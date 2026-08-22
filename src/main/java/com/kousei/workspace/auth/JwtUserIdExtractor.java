package com.kousei.workspace.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class JwtUserIdExtractor {

    public Long extract(
            Jwt jwt
    ) {
        String subject = jwt.getSubject();

        if (subject == null || subject.isBlank()) {
            throw unauthorized();
        }

        try {
            return Long.valueOf(subject);
        } catch (NumberFormatException exception) {
            throw unauthorized();
        }
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid JWT subject"
        );
    }
}
