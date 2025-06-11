package com.staynguide.backend.user.service; // 서비스는 별도의 'service' 패키지에 위치합니다.

import com.staynguide.backend.user.dto.UserJoinRequest;

public interface UserService {
    /**
     * 새로운 회원을 가입시키는 메서드.
     * @param request 회원가입 요청 DTO
     * @return 가입 성공 시 true, 실패 시 false (또는 가입된 User 엔티티의 ID 등)
     */
    Long join(UserJoinRequest request); // 가입 성공 시 사용자 ID 반환
    
    boolean isEmailExists(String email); // 이메일 중복 체크를 위한 메서드
    
}