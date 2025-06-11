package com.staynguide.backend.user.service;

import com.staynguide.backend.user.entity.User;
import com.staynguide.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // 트랜잭션 관리

@Service // Spring Bean으로 등록
@RequiredArgsConstructor // final 필드를 이용한 생성자 자동 생성 (의존성 주입)
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션으로 설정
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 사용자 이메일(아이디)로 DB에서 사용자 정보를 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("이메일을 찾을 수 없습니다: " + email));

        // 조회된 User 엔티티를 CustomUserDetails 객체로 변환하여 반환
        return new CustomUserDetails(user);
    }
}