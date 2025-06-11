package com.staynguide.backend.user.service;

import com.staynguide.backend.user.config.jwt.JwtTokenProvider;
import com.staynguide.backend.user.dto.UserLoginRequest;
import com.staynguide.backend.user.dto.UserLoginResponse;
import com.staynguide.backend.user.dto.TokenReissueRequest;
import com.staynguide.backend.user.entity.User;
import com.staynguide.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Value("${jwt.access-token-expiration-in-minutes}")
    private long accessTokenExpirationInMinutes;

    @Value("${jwt.refresh-token-expiration-in-days}")
    private long refreshTokenExpirationInDays;


    @Override
    @Transactional
    public UserLoginResponse login(UserLoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            long expiresInSeconds = accessTokenExpirationInMinutes * 60;

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("로그인 인증에 성공했으나 사용자 정보를 찾을 수 없습니다."));

            user.setRefreshToken(refreshToken);
            user.setTokenExpiryDate(LocalDateTime.now().plusDays(refreshTokenExpirationInDays));
            userRepository.save(user);

            log.info("로그인 성공 및 토큰 발급/저장 완료: {}", request.getEmail());
            return UserLoginResponse.builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .expiresIn(expiresInSeconds)
                    .build();

        } catch (AuthenticationException e) {
            log.warn("로그인 실패: 이메일 또는 비밀번호 불일치 - {}", request.getEmail());
            throw new IllegalArgumentException("로그인 정보가 유효하지 않습니다. 이메일 또는 비밀번호를 확인해주세요.");
        } catch (Exception e) {
            log.error("로그인 처리 중 예상치 못한 오류 발생: {}", request.getEmail(), e);
            throw new RuntimeException("로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    @Override
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("로그아웃할 사용자를 찾을 수 없습니다: " + email));

        user.setRefreshToken(null);
        user.setTokenExpiryDate(null);
        userRepository.save(user);

        SecurityContextHolder.clearContext();

        log.info("로그아웃 완료: {}", email);
    }

    @Override
    @Transactional 
    public UserLoginResponse reissueToken(TokenReissueRequest request) {
        // --- 여기부터 디버그 로그 추가 시작 ---
        log.debug("DEBUG: [Reissue] reissueToken 메서드 시작. 요청 Refresh Token: {}", request.getRefreshToken());

        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            log.warn("유효하지 않은 Refresh Token으로 재발급 시도: {}", refreshToken);
            throw new IllegalArgumentException("유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.");
        }
        log.debug("DEBUG: [Reissue] Refresh Token 유효성 검증 통과.");

        String email = jwtTokenProvider.getUsernameFromToken(refreshToken);
        log.debug("DEBUG: [Reissue] Refresh Token에서 추출한 이메일: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Refresh Token 사용 중 사용자를 찾을 수 없음: {}", email);
                    return new IllegalArgumentException("사용자를 찾을 수 없습니다.");
                });
        log.debug("DEBUG: [Reissue] DB에서 사용자 정보 조회 완료. 사용자 ID: {}", user.getUserId());

        if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
            log.warn("DB와 일치하지 않는 Refresh Token으로 재발급 시도 (사용자: {}). DB: {}, 요청: {}", email, user.getRefreshToken(), refreshToken);
            throw new IllegalArgumentException("저장된 Refresh Token과 일치하지 않습니다. 다시 로그인해주세요.");
        }
        log.debug("DEBUG: [Reissue] DB 저장 Refresh Token 일치 확인 통과.");

        if (user.getTokenExpiryDate() == null || user.getTokenExpiryDate().isBefore(LocalDateTime.now())) {
            log.warn("만료된 Refresh Token으로 재발급 시도 (사용자: {}). 만료일: {}", email, user.getTokenExpiryDate());
            throw new IllegalArgumentException("Refresh Token이 만료되었습니다. 다시 로그인해주세요.");
        }
        log.debug("DEBUG: [Reissue] Refresh Token 만료 여부 확인 통과.");

        // 새로운 Access Token 및 Refresh Token 발급
        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                customUserDetails,
                null,
                customUserDetails.getAuthorities()
        );

        String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);
        log.debug("DEBUG: [Reissue] 새로운 Access/Refresh Token 발급 완료.");

        // 새로 발급된 Refresh Token으로 DB 업데이트
        user.setRefreshToken(newRefreshToken);
        user.setTokenExpiryDate(LocalDateTime.now().plusDays(refreshTokenExpirationInDays));
        
        // --- 이 두 줄의 로그가 핵심입니다. ---
        log.debug("DEBUG: [Reissue] user 엔티티 Refresh Token 및 만료일자 업데이트 직전. 새 토큰: {}", newRefreshToken); 
        userRepository.save(user); // <<< 이 라인!
        log.debug("DEBUG: [Reissue] user 엔티티 저장 완료. UPDATE 쿼리 발생 확인!"); 
        // ------------------------------------

        log.info("Access Token 재발급 완료 (사용자: {})", email);
        return UserLoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .expiresIn(accessTokenExpirationInMinutes * 60)
                .build();
    }
}