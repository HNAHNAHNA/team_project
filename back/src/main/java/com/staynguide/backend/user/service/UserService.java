package com.staynguide.backend.user.service; // 서비스는 별도의 'service' 패키지에 위치합니다.

import com.staynguide.backend.user.dto.UserJoinRequest;
import com.staynguide.backend.user.dto.UserResponseDto;
import com.staynguide.backend.user.dto.UserUpdateRequest;
import com.staynguide.backend.user.dto.UserPasswordUpdateRequest;
import com.staynguide.backend.user.dto.UserWithdrawalRequest;

public interface UserService {

	/**
	 * 새로운 회원을 가입시키는 메서드.
	 * 
	 * @param request 회원가입 요청 DTO
	 * @return 가입 성공 시 true, 실패 시 false (또는 가입된 User 엔티티의 ID 등)
	 */
	Long join(UserJoinRequest request); // 가입 성공 시 사용자 ID 반환

	boolean isEmailExists(String email); // 이메일 중복 체크를 위한 메서드

	/**
	 * 특정 사용자의 정보를 조회.
	 * 
	 * @param email 조회할 사용자의 이메일 (로그인된 사용자의 이메일)
	 * @return 조회된 사용자 정보를 담은 UserResponseDto DTO
	 */
	UserResponseDto getUserInfo(String email);

	/**
	 * 사용자의 프로필 정보를 수정합니다.
	 * 
	 * @param email   수정할 사용자의 이메일 (로그인된 사용자의 이메일)
	 * @param request 수정할 정보를 담은 UserUpdateRequest DTO
	 * @return 수정된 사용자 정보를 담은 UserResponseDto DTO
	 */
	UserResponseDto updateUserInfo(String email, UserUpdateRequest request);

	/**
	 * 사용자의 비밀번호를 변경합니다.
	 * 
	 * @param email   비밀번호를 변경할 사용자의 이메일 (로그인된 사용자의 이메일)
	 * @param request 비밀번호 변경 요청 DTO (현재 비밀번호, 새 비밀번호)
	 */
	void updatePassword(String email, UserPasswordUpdateRequest request);

	/**
	 * 사용자의 계정을 탈퇴(삭제)합니다.
	 * 
	 * @param email   탈퇴할 사용자의 이메일 (로그인된 사용자의 이메일)
	 * @param request 탈퇴 확인을 위한 비밀번호를 담은 UserWithdrawalRequest DTO
	 */
	void withdrawUser(String email, UserWithdrawalRequest request);

}