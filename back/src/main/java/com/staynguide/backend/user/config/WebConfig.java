package com.staynguide.backend.user.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// 이 클래스가 스프링의 '설정'을 담당하는 클래스임을 나타내는 어노테이션
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS 관련 설정을 재정의하기 위한 메소드
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 애플리케이션의 모든 API 경로에 대해 CORS 설정을 적용
                .allowedOrigins("*") // 모든 출처(도메인)에서의 요청을 허용 (테스트용으로 '*' 사용)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS") // 허용할 HTTP 메소드를 지정
                .allowedHeaders("*"); // 모든 HTTP 헤더를 허용
    }
}