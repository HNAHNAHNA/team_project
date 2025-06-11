package com.staynguide.backend.user.controller; // 컨트롤러는 별도의 'controller' 패키지에 위치합니다.

import com.staynguide.backend.user.dto.UserJoinRequest; // DTO import
import com.staynguide.backend.user.service.UserService;   // Service import
import jakarta.validation.Valid; // @Valid 어노테이션 사용을 위해 import
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // HTTP 상태 코드
import org.springframework.http.ResponseEntity; // HTTP 응답 객체
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping; // 아이디 중복 체크를 위한 GetMapping
import org.springframework.web.bind.annotation.RequestParam; // 쿼리 파라미터 받기 위함

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

        // UserRepository를 직접 사용하거나, UserService에 별도의 중복 체크 메서드를 추가할 수 있습니다.
        // 여기서는 서비스 계층에 existsByEmail 메서드를 추가한다고 가정합니다.
        // 실제로는 UserRepository를 주입받아 직접 사용하는 것이 더 일반적일 수 있습니다.
        // 하지만 서비스 계층에서 유효성 검증 또는 추가 비즈니스 로직이 있다면 서비스 메서드를 호출하는 것이 좋습니다.

        // TODO: UserService에 existsByEmail 메서드를 추가하여 사용하거나,
        // 현재는 UserRepository를 직접 주입받아 사용하는 것으로 임시 처리합니다.
        // 의존성 주입을 위해 UserService 대신 UserRepository를 주입받거나, UserService에 checkEmailExists 메서드 추가 필요.
        // 여기서는 UserService에 이메일 중복 체크 메서드를 추가한다고 가정하겠습니다.

        // 아래 코드는 UserService에 checkEmailExists(String email) 메서드가 있다고 가정한 것입니다.
        // 만약 UserService에 이메일 중복 체크 메서드를 따로 만들지 않고 UserRepository를 직접 사용하고 싶다면
        // UserController에 UserRepository를 주입받아 사용해야 합니다.
        // 예: private final UserRepository userRepository;

        try {
            // Service에 중복 체크 로직을 위임 (Service 메서드 추가 예정)
            // 현재 UserService에는 join만 있으므로, 이메일 중복 체크용 메서드를 UserService에 추가해야 합니다.
            // 일단은 아래에 임시로 로직을 구현해두겠습니다.
            // (실제 프로젝트에서는 UserService에 existsByEmail 메서드를 추가하는 것이 좋습니다.)

            // 임시: UserRepository를 주입받아 직접 사용
            // private final UserRepository userRepository; 를 추가해야 합니다.
            // if (userRepository.existsByEmail(email)) {
            //    return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 이메일입니다.");
            // } else {
            //    return ResponseEntity.ok("사용 가능한 이메일입니다.");
            // }

            // UserService에 existsByEmail(String email) 메서드를 추가했다고 가정하고 사용
            // return userService.checkEmailExists(email); // 이메일이 존재하면 true, 없으면 false
            // 위 메서드가 true/false를 반환하면 아래와 같이 응답 처리
            // if (userService.isEmailExists(email)) { // isEmailExists라는 메서드를 UserService에 추가한다고 가정
            //     return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 이메일입니다.");
            // } else {
            //     return ResponseEntity.ok("사용 가능한 이메일입니다.");
            // }

            // 가장 간단하게, UserService가 이미 이메일 중복 체크 로직을 가지고 있으므로,
            // 별도의 API는 클라이언트가 직접 이메일 필드에 입력할 때 비동기적으로 호출하는 용도로 사용하고,
            // 실제 회원가입 시에는 서비스 내부에서 최종 검증을 하는 것이 좋습니다.

            // 일단 Service에 직접 중복 체크 메서드를 추가하는 것으로 진행하겠습니다.
            // 아래에 `isEmailExists` 메서드를 UserService 인터페이스 및 구현체에 추가할 것입니다.

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
}