package com.staynguide.backend.user.service;

import com.staynguide.backend.user.entity.User;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

// --- 이 import 문을 추가해야 합니다! ---
import com.staynguide.backend.user.enums.UserStatus; // UserStatus enum의 실제 패키지 경로에 맞게 수정
// --- 여기까지 ---

@Getter
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetails {

    private final User user;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override
    public String getPassword() {
        return user.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        // User.UserStatus.ACTIVE -> UserStatus.ACTIVE 로 변경합니다.
        return user.getStatus() == UserStatus.ACTIVE;
    }

    public Long getUserId() {
        return user.getUserId();
    }

    public String getRole() {
        return user.getRole().name();
    }
}