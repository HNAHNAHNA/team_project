package com.staynguide.backend.user.config.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter; // 요청당 한 번만 실행되도록 보장

import io.jsonwebtoken.ExpiredJwtException;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider; // JWT 토큰 제공자 주입

    // @Override
    // protected void doFilterInternal(HttpServletRequest request,
    // HttpServletResponse response,
    // FilterChain filterChain) throws ServletException, IOException {
    // try {
    // // 1. Request Header에서 JWT 토큰 추출
    // String jwt = resolveToken(request);

    // // 2. 토큰 유효성 검증
    // if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
    // // 토큰이 유효하면 인증 정보를 가져와 SecurityContext에 저장
    // Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
    // SecurityContextHolder.getContext().setAuthentication(authentication);
    // log.debug("인증 정보를 Security Context에 설정했습니다: {}", authentication.getName());
    // }
    // } catch (Exception ex) {
    // log.error("Security Context에 사용자 인증을 설정할 수 없습니다.", ex);
    // // 인증 실패 시 401 Unauthorized 오류를 반환하도록 설정 (필요시)
    // // response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
    // return; // 필터 체인 중단
    // }

    // // 다음 필터로 요청 전달
    // filterChain.doFilter(request, response);
    // }
    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String jwt = resolveToken(request);

        try {
            if (jwt != null) {
                if (jwtTokenProvider.validateToken(jwt)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(jwt);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    // 토큰이 있지만 유효하지 않음(만료 포함) → 401 내려서 프론트가 리프레시 시도하게
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setHeader("X-Token-Invalid", "true"); // 선택: 프론트 힌트
                    return;
                }
            }
        } catch (ExpiredJwtException e) {
            // 명시적으로 만료 케이스 401
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setHeader("X-Token-Expired", "true");
            return;
        } catch (Exception ex) {
            // 기타 파싱/서명 오류도 401
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }

    // Request Header에서 Bearer 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 제거 후 토큰 값만 반환
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.equals("/api/v1/auth/reissue");
        // 또는 path.startsWith("/api/v1/auth/reissue") 로 확장 가능
    }
}