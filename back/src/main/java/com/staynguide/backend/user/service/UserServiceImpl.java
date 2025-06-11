package com.staynguide.backend.user.service;

import com.staynguide.backend.user.dto.UserJoinRequest;
import com.staynguide.backend.user.entity.User;
import com.staynguide.backend.user.enums.Role;
import com.staynguide.backend.user.enums.UserStatus;
import com.staynguide.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    @Transactional
    public Long join(UserJoinRequest request) {
        if (!request.getPassword().equals(request.getPasswordConfirm())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }

        // isEmailExists 메서드를 사용하여 중복 체크
        if (isEmailExists(request.getEmail())) {
            // 이메일 중복은 409 Conflict로 처리되도록 GlobalExceptionHandler에서 메시지를 기반으로 분류
            throw new IllegalArgumentException("이미 사용 중인 이메일(아이디)입니다.");
        }

        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
             throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
        }

        String encodedPassword = bCryptPasswordEncoder.encode(request.getPassword());

        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(encodedPassword)
                .username(request.getUsername())
                .phoneNumber(request.getPhoneNumber())
                .zipcode(request.getZipcode())
                .addressMain(request.getAddressMain())
                .addressDetail(request.getAddressDetail())
                .role(Role.GUEST)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(newUser);
        return savedUser.getUserId();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}