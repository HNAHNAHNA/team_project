package com.staynguide.backend.user.controller; 

import com.staynguide.backend.user.dto.UserJoinRequest; 
import com.staynguide.backend.user.dto.UserResponseDto;
import com.staynguide.backend.user.dto.UserUpdateRequest;
import com.staynguide.backend.user.dto.UserPasswordUpdateRequest;
import com.staynguide.backend.user.dto.UserWithdrawalRequest;
import com.staynguide.backend.user.entity.User;
import com.staynguide.backend.user.service.UserService;   
import com.staynguide.backend.user.service.CustomUserDetails;
import jakarta.validation.Valid; 
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus; // HTTP 상태 코드
import org.springframework.http.ResponseEntity; // HTTP 응답 객체
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping; // 아이디 중복 체크를 위한 GetMapping
import org.springframework.web.bind.annotation.PutMapping; 
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam; // 쿼리 파라미터 받기 위함

@Slf4j
@RestController // REST API를 위한 컨트롤러임을 명시
@RequestMapping("/api/v1/users") // 기본 URL 경로 설정
@RequiredArgsConstructor // final 필드를 이용한 생성자 자동 생성 (의존성 주입)
public class UserController {

    private final UserService userService; // UserService 주입

    /**
     * 회원가입을 처리하는 API 엔드포인트.
     * @param request 회원가입 요청 DTO (JSON 형태로 받음)
     * @return 성공 시 201 Created 응답과 메시지 반환
     */
    @PostMapping("/join") // POST /api/v1/users/join 요청 처리
    public ResponseEntity<String> join(@Valid @RequestBody UserJoinRequest request) {
        // @Valid: UserJoinRequest DTO에 설정된 @NotBlank, @Email 등의 유효성 검증을 수행
        // @RequestBody: HTTP 요청 본문의 JSON 데이터를 UserJoinRequest 객체로 매핑

        // 서비스 계층의 회원가입 로직 호출
        Long userId = userService.join(request);

        // 성공 응답 반환 (HTTP 상태 코드 201 Created)
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("회원가입이 성공적으로 완료되었습니다. 사용자 ID: " + userId);
    }

    /**
     * 이메일(아이디) 중복을 체크하는 API 엔드포인트.
     * @param email 중복 체크할 이메일 주소
     * @return 중복 여부에 따라 적절한 메시지 반환
     */
    @GetMapping("/check-email")
    public ResponseEntity<String> checkEmailDuplicate(@RequestParam("email") String email) {
        // @RequestParam: 쿼리 파라미터에서 'email' 값을 받음

        try {
            // 서비스 계층에 email 중복 체크 메서드를 위임 (아래 UserService 수정 참고)
            boolean isExists = userService.isEmailExists(email);
            if (isExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 이메일입니다.");
            } else {
                return ResponseEntity.ok("사용 가능한 이메일입니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 중복 확인 중 오류가 발생했습니다.");
        }
    }
    
    /**
     * 로그인된 사용자 본인의 정보를 조회합니다.
     * @param user 현재 로그인된 사용자 객체 (Access Token 기반으로 Security Context에서 주입)
     * @return 조회된 사용자 정보를 담은 UserResponseDto DTO
     */
    @GetMapping("/me") // <<< 이 메서드를 추가합니다. GET /api/v1/users/me 요청 처리
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal CustomUserDetails customUserDetails) { 
        // @AuthenticationPrincipal User user: Spring Security Context에 저장된 UserDetails (우리의 User 엔티티) 객체를 직접 주입받음
        // SecurityConfig에서 "/api/v1/users/me"를 .authenticated()로 설정하면 Access Token이 필수로 필요

        if (customUserDetails == null) {
            // 이 코드는 사실상 호출될 일이 거의 없음. Access Token이 없으면 JwtAuthenticationFilter에서 이미 401 반환.
            // 만약 CustomUserDetails를 썼다면 null 체크를 해야 하지만, User 엔티티 직접 쓰므로 인증 실패 시 User 객체 자체가 주입되지 않음
            log.warn("인증되지 않은 사용자가 /api/v1/users/me 접근 시도.");
            throw new IllegalArgumentException("인증된 사용자만 접근할 수 있습니다."); // GlobalExceptionHandler에서 처리됨
        }

        log.info("사용자 정보 조회 요청: {}", customUserDetails.getUsername());
        UserResponseDto userInfo = userService.getUserInfo(customUserDetails.getUsername()); 
        return ResponseEntity.ok(userInfo);
    }
    
    /**
     * 로그인된 사용자 본인의 정보를 수정합니다.
     * @param customUserDetails 현재 로그인된 사용자 객체 (Access Token 기반으로 Security Context에서 주입)
     * @param request 수정할 정보를 담은 UserUpdateRequest DTO
     * @return 수정된 사용자 정보를 담은 UserResponseDto DTO
     */
    @PutMapping("/me") // <<< 이 메서드를 추가합니다. PUT /api/v1/users/me 요청 처리
    public ResponseEntity<UserResponseDto> updateMyInfo(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @Valid @RequestBody UserUpdateRequest request) { // <<< @Valid와 UserUpdateRequest 사용
        
        if (customUserDetails == null) {
            log.warn("인증되지 않은 사용자가 /api/v1/users/me (PUT) 접근 시도.");
            throw new IllegalArgumentException("인증된 사용자만 접근할 수 있습니다.");
        }

        log.info("사용자 정보 수정 요청: {}", customUserDetails.getUsername());
        UserResponseDto updatedUserInfo = userService.updateUserInfo(customUserDetails.getUsername(), request);
        return ResponseEntity.ok(updatedUserInfo);
    }
    
    /**
     * 로그인된 사용자의 비밀번호를 변경합니다.
     * @param customUserDetails 현재 로그인된 사용자 객체 (Access Token 기반으로 Security Context에서 주입)
     * @param request 비밀번호 변경 요청 DTO
     * @return 성공 메시지
     */
    @PutMapping("/password")
    public ResponseEntity<String> updatePassword(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @Valid @RequestBody UserPasswordUpdateRequest request) { 
    	
        if (customUserDetails == null) {
            log.warn("인증되지 않은 사용자가 /api/v1/users/password 접근 시도.");
            throw new IllegalArgumentException("인증된 사용자만 접근할 수 있습니다.");
        }

        log.info("사용자 비밀번호 변경 요청: {}", customUserDetails.getUsername());
        userService.updatePassword(customUserDetails.getUsername(), request);
        return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
    }
    
    /**
     * 로그인된 사용자의 계정을 탈퇴(삭제)합니다.
     * @param customUserDetails 현재 로그인된 사용자 객체 (Access Token 기반으로 Security Context에서 주입)
     * @param request 탈퇴 확인을 위한 비밀번호를 담은 UserWithdrawalRequest DTO
     * @return 성공 메시지
     */
    @DeleteMapping("/me") // <<< 이 메서드를 추가합니다. DELETE /api/v1/users/me 요청 처리
    public ResponseEntity<String> withdrawUser(
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @Valid @RequestBody UserWithdrawalRequest request) { // <<< @Valid와 UserWithdrawalRequest 사용
        
        if (customUserDetails == null) {
            log.warn("인증되지 않은 사용자가 /api/v1/users/me (DELETE) 접근 시도.");
            throw new IllegalArgumentException("인증된 사용자만 접근할 수 있습니다.");
        }

        log.info("회원 탈퇴 요청: {}", customUserDetails.getUsername());
        userService.withdrawUser(customUserDetails.getUsername(), request); // 서비스 호출
        return ResponseEntity.ok("회원 탈퇴가 성공적으로 완료되었습니다!!");
    }
}