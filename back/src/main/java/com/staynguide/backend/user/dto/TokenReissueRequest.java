package com.staynguide.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenReissueRequest {

	/*
	 * JWT Access Token 재발급 기능 구현 이 기능은 클라이언트가 만료된 Access Token 대신 Refresh Token을
	 * 보내면, 서버가 이를 검증하고 새로운 Access Token을 발급해주는 역할을 합니다.
	 */
	
    @NotBlank(message = "Refresh Token은 필수 값입니다!!!")
    private String refreshToken; // 재발급 요청에 사용될 Refresh Token
}