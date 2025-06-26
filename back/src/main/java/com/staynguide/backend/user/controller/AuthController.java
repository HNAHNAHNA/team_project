package com.staynguide.backend.user.controller;

import com.staynguide.backend.user.dto.UserLoginRequest;
import com.staynguide.backend.user.dto.UserLoginResponse;
import com.staynguide.backend.user.dto.TokenReissueRequest;
import com.staynguide.backend.user.service.AuthService;
import com.staynguide.backend.user.service.CustomUserDetails;
import com.staynguide.backend.user.config.jwt.JwtTokenProvider;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j // Lombok을 이용한 로깅
@RestController // REST API를 위한 컨트롤러임을 명시
@RequestMapping("/api/v1/auth") // 인증 관련 기본 URL 경로 설정
@RequiredArgsConstructor // final 필드를 이용한 생성자 자동 생성 (의존성 주입)
public class AuthController {

	private final AuthService authService; // AuthService 주입
	private final JwtTokenProvider jwtTokenProvider;

	/**
	 * 사용자 로그인 요청을 처리하고 JWT 토큰을 발급합니다.
	 * 
	 * @param request 로그인 요청 DTO (이메일, 비밀번호)
	 * @return 로그인 성공 시 Access Token 및 Refresh Token을 포함한 응답 DTO
	 */
	@PostMapping("/login") // POST /api/v1/auth/login 요청 처리
	public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
		log.info("로그인 요청 접수: {}", request.getEmail());

		// 인증 서비스의 로그인 로직 호출
		UserLoginResponse response = authService.login(request);

		log.info("로그인 성공 및 토큰 발급: {}", request.getEmail());
		log.info("유저 데이터 반환: {}", response);
		// 성공 응답 반환 (HTTP 상태 코드 200 OK)
		return ResponseEntity.ok(response);
	}

	/**
	 * 사용자 로그아웃 요청을 처리합니다.
	 * 
	 * @param customUserDetails 현재 로그인된 사용자의 정보
	 * @return 성공 메시지
	 */
	@PostMapping("/logout") // <<< 이 메서드를 추가합니다.
	public ResponseEntity<String> logout(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
		// @AuthenticationPrincipal 어노테이션은 Spring Security Context에서
		// 현재 인증된 사용자의 CustomUserDetails 객체를 주입받습니다.

		if (customUserDetails == null) {
			// Access Token이 없거나 유효하지 않은 경우 (Security Filter에서 이미 처리되겠지만, 방어적 코드)
			return ResponseEntity.badRequest().body("로그인 상태가 아닙니다. 유효한 토큰으로 요청해주세요.");
		}

		String email = customUserDetails.getUsername(); // CustomUserDetails에서 사용자 이메일(로그인 ID) 추출
		authService.logout(email); // 서비스 계층의 로그아웃 로직 호출
		log.info("SecurityContext Authentication 객체: {}", SecurityContextHolder.getContext().getAuthentication());

		return ResponseEntity.ok("로그아웃이 성공적으로 완료되었습니다.");
	}

	/**
	 * JWT Refresh Token을 이용하여 새로운 Access Token 및 Refresh Token을 재발급합니다.
	 * 
	 * @param request Refresh Token 재발급 요청 DTO
	 * @return 새로운 Access Token 및 Refresh Token을 포함한 응답 DTO
	 */
	@PostMapping("/reissue") // <<< 이 메서드를 추가합니다. POST /api/v1/auth/reissue 요청 처리
	public ResponseEntity<UserLoginResponse> reissueToken(@Valid @RequestBody TokenReissueRequest request) {
		log.info("토큰 재발급 요청 접수");
		UserLoginResponse response = authService.reissueToken(request);
		log.info("토큰 재발급 완료 (사용자: {})", jwtTokenProvider.getUsernameFromToken(request.getRefreshToken())); // jwtTokenProvider
																											// 필요 (주입
																											// 필요)
		return ResponseEntity.ok(response);
	}

	// 다른 백엔드 서버에서 JWT Token 유효성 검사하는 로직입니다 수정 ㄴㄴㄴㄴㄴㄴ
	@GetMapping("/validate")
	public ResponseEntity<Map<String, Object>> validate(@AuthenticationPrincipal CustomUserDetails userDetails) {
		if (userDetails == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "토큰이 유효하지 않거나 만료됨"));
		}

		Map<String, Object> response = new HashMap<>();
		response.put("user_id", userDetails.getUserId());
		response.put("email", userDetails.getUsername());
		response.put("role", userDetails.getRole());

		return ResponseEntity.ok(response);
	}
}