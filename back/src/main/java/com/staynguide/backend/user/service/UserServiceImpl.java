package com.staynguide.backend.user.service;

import com.staynguide.backend.user.dto.UserJoinRequest;
import com.staynguide.backend.user.dto.UserResponseDto;
import com.staynguide.backend.user.dto.UserUpdateRequest;
import com.staynguide.backend.user.dto.UserPasswordUpdateRequest;
import com.staynguide.backend.user.dto.UserWithdrawalRequest;
import com.staynguide.backend.user.entity.User;
import com.staynguide.backend.user.enums.Role;
import com.staynguide.backend.user.enums.UserStatus;
import com.staynguide.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public Long join(UserJoinRequest request) {
		// 비밀번호와 비밀번호 확인 일치 검증
		if (!request.getPassword().equals(request.getPasswordConfirm())) {
			throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
		}
		// 이메일 중복 체크
		if (isEmailExists(request.getEmail())) {
			throw new IllegalArgumentException("이미 사용 중인 이메일(아이디)입니다.");
		}
		// 전화번호 중복 체크 (선택 사항)
		if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
			throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
		}

		// 비밀번호 암호화
		String encodedPassword = passwordEncoder.encode(request.getPassword());

		// 새 사용자 엔티티 생성
		User newUser = User.builder().email(request.getEmail()).passwordHash(encodedPassword)
				.username(request.getUsername()).phoneNumber(request.getPhoneNumber()).zipcode(request.getZipcode())
				.addressMain(request.getAddressMain()).addressDetail(request.getAddressDetail()).role(Role.GUEST) // 기본
																													// 역할은
																													// GUEST
				.status(UserStatus.ACTIVE) // 기본 상태는 ACTIVE
				.build();

		// 사용자 저장
		User savedUser = userRepository.save(newUser);
		return savedUser.getUserId();
	}

	@Override
	@Transactional(readOnly = true)
	public boolean isEmailExists(String email) {
		return userRepository.existsByEmail(email);
	}

	@Override
	@Transactional(readOnly = true)
	public UserResponseDto getUserInfo(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.warn("사용자 정보를 찾을 수 없습니다: {}", email);
			return new IllegalArgumentException("사용자 정보를 찾을 수 없습니다.");
		});

		return new UserResponseDto(user);
	}

	@Override
	@Transactional
	public UserResponseDto updateUserInfo(String email, UserUpdateRequest request) {
		// 이메일로 사용자 조회
		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.warn("사용자 정보 업데이트를 위한 사용자를 찾을 수 없습니다: {}", email);
			return new IllegalArgumentException("사용자를 찾을 수 없습니다.");
		});

		// 사용자 이름 업데이트
		user.setUsername(request.getUsername());

		// 전화번호 업데이트 (null 처리 및 중복 확인)
		if (request.getPhoneNumber() != null) {
			// 다른 사용자가 이미 해당 전화번호를 사용하는지 확인 (단, 현재 사용자 본인 제외)
			if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
				User existingUserWithPhone = userRepository.findByPhoneNumber(request.getPhoneNumber()).get();
				if (!existingUserWithPhone.getUserId().equals(user.getUserId())) {
					throw new IllegalArgumentException("이미 사용 중인 전화번호입니다.");
				}
			}
			user.setPhoneNumber(request.getPhoneNumber());
		} else {
			// 요청에서 전화번호가 null로 오면, DB의 전화번호도 null로 업데이트
			user.setPhoneNumber(null);
		}

		// 주소 정보 업데이트
		user.setZipcode(request.getZipcode());
		user.setAddressMain(request.getAddressMain());
		user.setAddressDetail(request.getAddressDetail());

		// 변경된 User 엔티티 저장
		User updatedUser = userRepository.save(user);

		log.info("사용자 정보 업데이트 완료: {}", email);
		return new UserResponseDto(updatedUser);
	}

	@Override
	@Transactional
	public void updatePassword(String email, UserPasswordUpdateRequest request) {
		// 1. 사용자 조회
		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.warn("비밀번호 변경을 위한 사용자를 찾을 수 없습니다: {}", email);
			return new IllegalArgumentException("사용자를 찾을 수 없습니다.");
		});

		// 2. 현재 비밀번호 검증
		// 사용자가 입력한 현재 비밀번호(request.getCurrentPassword())와 DB에 저장된 암호화된
		// 비밀번호(user.getPasswordHash()) 비교
		if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
			log.warn("비밀번호 변경 실패: 현재 비밀번호 불일치 - {}", email);
			throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
		}

		// 3. 새 비밀번호와 새 비밀번호 확인 일치 여부 검증
		if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
			log.warn("비밀번호 변경 실패: 새 비밀번호 불일치 - {}", email);
			throw new IllegalArgumentException("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
		}

		// 4. 새 비밀번호 암호화 및 저장
		String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
		user.setPasswordHash(encodedNewPassword);
		userRepository.save(user); // 변경된 비밀번호 저장

		log.info("사용자 비밀번호 변경 완료: {}", email);
	}

	@Override
	@Transactional
	public void withdrawUser(String email, UserWithdrawalRequest request) {
		// 1. 사용자 조회
		User user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.warn("회원 탈퇴를 위한 사용자를 찾을 수 없습니다: {}", email);
			return new IllegalArgumentException("사용자를 찾을 수 없습니다.");
		});

		// 2. 비밀번호 확인 (탈퇴 보안을 위해 필수)
		if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
			log.warn("회원 탈퇴 실패: 비밀번호 불일치 - {}", email);
			throw new IllegalArgumentException("비밀번호가 일치하지 않습니다. 회원 탈퇴를 진행할 수 없습니다.");
		}

		// 3. 사용자 삭제
		userRepository.delete(user); // JPA의 delete 메서드를 사용하여 사용자 삭제

		// 4. Spring Security Context 초기화 (현재 로그인 세션 제거)
		SecurityContextHolder.clearContext();
		// Refresh Token은 DB에서 해당 사용자의 레코드 자체가 삭제되므로 자동으로 사라집니다.

		log.info("회원 탈퇴 완료: {}", email);
	}
}