package com.staynguide.backend.user.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder // 빌더 패턴으로 객체 생성 용이
public class UserLoginResponse {
    private String accessToken;
    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer"; // JWT 토큰 타입 (일반적으로 "Bearer")
    
    private Long expiresIn; // Access Token 만료 시간 (초 단위)

    private UserInfo user;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserInfo {
        private Long id;
        private String email;
        private String name;
        private String role;
        
    }
}