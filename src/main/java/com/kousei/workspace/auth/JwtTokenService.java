package com.kousei.workspace.auth;

import com.kousei.workspace.user.WorkspaceUser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtTokenService {

    private static final String ISSUER =
            "workspace-api";

    private final JwtEncoder jwtEncoder;
    private final long accessTokenExpirationSeconds;

    public JwtTokenService(
            JwtEncoder jwtEncoder,

            @Value(
                    "${workspace.jwt." +
                            "access-token-expiration-seconds}"
            )
            long accessTokenExpirationSeconds
    ) {
        this.jwtEncoder = jwtEncoder;
        this.accessTokenExpirationSeconds =
                accessTokenExpirationSeconds;
    }

    public String createAccessToken(
            WorkspaceUser user
    ) {
        Instant issuedAt = Instant.now();

        Instant expiresAt =
                issuedAt.plusSeconds(
                        accessTokenExpirationSeconds
                );

        JwtClaimsSet claims =
                JwtClaimsSet
                        .builder()
                        .issuer(ISSUER)
                        .issuedAt(issuedAt)
                        .expiresAt(expiresAt)
                        .subject(
                                user.getUserId().toString()
                        )
                        .claim(
                                "email",
                                user.getEmail()
                        )
                        .claim(
                                "name",
                                user.getUserName()
                        )
                        .build();

        JwsHeader header =
                JwsHeader
                        .with(MacAlgorithm.HS256)
                        .build();

        JwtEncoderParameters parameters =
                JwtEncoderParameters.from(
                        header,
                        claims
                );

        return jwtEncoder
                .encode(parameters)
                .getTokenValue();
    }

    public long getAccessTokenExpirationSeconds() {
        return accessTokenExpirationSeconds;
    }
}