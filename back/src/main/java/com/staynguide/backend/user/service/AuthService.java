package com.staynguide.backend.user.service;

import com.staynguide.backend.user.dto.UserLoginRequest;
import com.staynguide.backend.user.dto.UserLoginResponse;
import com.staynguide.backend.user.dto.TokenReissueRequest;

public interface AuthService {
	/**
	 * 사용자 로그인 및 JWT 토큰 발급.
	 * 
	 * @param request 로그인 요청 DTO (이메일, 비밀번호)
	 * @return 로그인 성공 시 Access Token 및 Refresh Token을 포함한 응답 DTO
	 */
	UserLoginResponse login(UserLoginRequest request);

	/**
	 * 사용자 로그아웃 처리. Refresh Token을 무효화하고, Access Token은 클라이언트에서 삭제하도록 유도.
	 * 
	 * @param email 로그아웃할 사용자의 이메일
	 */
	void logout(String email);

	/**
	 * Refresh Token을 사용하여 새로운 Access Token 및 Refresh Token을 재발급.
	 * 
	 * @param request Refresh Token 재발급 요청 DTO
	 * @return 새로운 Access Token 및 Refresh Token을 포함한 응답 DTO
	 */
	UserLoginResponse reissueToken(TokenReissueRequest request);
}