package com.staynguide.backend.user.error; // 패키지 경로 변경

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
// import org.springframework.web.bind.annotation.ControllerAdvice; // UserExceptionHandler라면 @ControllerAdvice 대신 @RestControllerAdvice

@RestControllerAdvice // 모든 @Controller에 적용되지만, 특정 컨트롤러만 지정하려면 @RestControllerAdvice(assignableTypes = {UserController.class})
public class UserExceptionHandler { // 클래스 이름 변경

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        ErrorResponse errorResponse = ErrorResponse.of(
                "회원가입 정보가 유효하지 않습니다. 입력 값을 다시 확인해주세요.", // 좀 더 사용자 친화적인 상위 메시지
                HttpStatus.BAD_REQUEST.value(),
                ex.getBindingResult()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        if (ex.getMessage().contains("이미 사용 중인 이메일") || ex.getMessage().contains("이미 사용 중인 전화번호")) {
            status = HttpStatus.CONFLICT;
        }

        ErrorResponse errorResponse = ErrorResponse.of(
                ex.getMessage(),
                status.value()
        );
        return new ResponseEntity<>(errorResponse, status);
    }

    // 개발 중 예외를 놓치지 않기 위한 제너럴 예외 핸들러 (선택 사항, 나중에 GlobalExceptionHandler로 옮길 수도 있음)
    // 이 핸들러를 여기에 두면, 다른 도메인에서 발생한 Exception도 여기서 잡힐 수 있으니 주의.
    // 궁극적으로는 애플리케이션 전반을 커버하는 GlobalExceptionHandler가 필요합니다.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAllExceptions(Exception ex) {
        ErrorResponse errorResponse = ErrorResponse.of(
                "회원가입 중 서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );
        ex.printStackTrace(); // 서버 로그에 스택 트레이스 출력
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}