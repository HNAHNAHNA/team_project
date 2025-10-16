package com.staynguide.backend.user.config.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; // SecretKey 임포트
import java.security.Key;
import java.util.Date;
import java.util.UUID; // UUID 임포트

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.access-token-expiration-in-minutes}")
    private long accessTokenExpirationInMinutes;

    @Value("${jwt.refresh-token-expiration-in-days}")
    private long refreshTokenExpirationInDays;

    private SecretKey signingKey; // Key 대신 SecretKey 타입 사용

    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostConstruct
    public void init() {
        this.signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
        log.info("JWT Secret Key initialized.");
        log.debug("DEBUG: [JwtTokenProvider] Injected secretKey (first 10 chars): {}", secretKey.substring(0, Math.min(secretKey.length(), 10)));
        log.info("DEBUG: [JwtTokenProvider] Injected accessTokenExpirationInMinutes: {}", accessTokenExpirationInMinutes);
        log.info("DEBUG: [JwtTokenProvider] Injected refreshTokenExpirationInDays: {}", refreshTokenExpirationInDays);
        log.info("DEBUG: [JwtTokenProvider] Injected accessTokenExpirationInMinutes: {}", accessTokenExpirationInMinutes);
        log.info("DEBUG: [JwtTokenProvider] Injected refreshTokenExpirationInDays: {}", refreshTokenExpirationInDays);
    }

    // Access Token 생성
    public String generateAccessToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpirationInMinutes * 60 * 1000);

        log.debug("DEBUG: [AccessToken] Using accessTokenExpirationInMinutes: {}", accessTokenExpirationInMinutes);
        log.debug("DEBUG: [AccessToken] now: {}, expiryDate: {}", now, expiryDate);
        String jti = UUID.randomUUID().toString(); // <<< 이 라인 그대로
        log.debug("DEBUG: [AccessToken] JTI 생성됨: {}", jti); // <<< 이 디버그 로그 추가 (확인용)
        
        return Jwts.builder()
                .setSubject(username) // 토큰 주체 (여기서는 이메일)
                .setIssuedAt(now) // 발행 시간
                .setExpiration(expiryDate) // 만료 시간
                .setId(UUID.randomUUID().toString()) // <<< JTI (JWT ID) 추가 - 매번 고유한 값 생성
                .signWith(signingKey, SignatureAlgorithm.HS256) // 서명 알고리즘 및 키
                .compact();
    }

    // Refresh Token 생성
    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationInDays * 24 * 60 * 60 * 1000);
        
        log.debug("DEBUG: [RefreshToken] now: {}, expiryDate: {}", now, expiryDate);
        String jti = UUID.randomUUID().toString(); // <<< 이 라인 그대로
        log.debug("DEBUG: [RefreshToken] JTI 생성됨: {}", jti); // <<< 이 디버그 로그 추가 (확인용)

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .setId(UUID.randomUUID().toString()) // <<< JTI (JWT ID) 추가 - 매번 고유한 값 생성
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT 토큰에서 사용자 이름(이메일) 추출
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                .verifyWith(signingKey) // key 대신 signingKey 사용
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(signingKey)
                    .clockSkewSeconds(5) // Allow 5 seconds clock skew
                    .build()
                    .parseSignedClaims(authToken);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.debug("DEBUG: [Validate] Invalid JWT Token: {}", authToken, e);
        } catch (ExpiredJwtException e) {
            log.debug("DEBUG: [Validate] Expired JWT Token: {}", authToken, e);
        } catch (UnsupportedJwtException e) {
            log.debug("DEBUG: [Validate] Unsupported JWT Token: {}", authToken, e);
        } catch (IllegalArgumentException e) {
            log.debug("DEBUG: [Validate] JWT claims string is empty: {}", authToken, e);
        }
        return false;
    }

    // JWT 토큰으로부터 인증 정보(Authentication) 객체 가져오기
    public Authentication getAuthentication(String token) {
        String username = getUsernameFromToken(token);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return new UsernamePasswordAuthenticationToken(userDetails, "", userDetails.getAuthorities());
    }
}