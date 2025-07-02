package com.staynguide.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("http://") // 또는 "/*"로 전체 허용
                .allowedOrigins("*") 
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true); // 로그인 세션 등 필요 시
    }
}