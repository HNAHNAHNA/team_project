package com.staynguide.backend.user.error; // 패키지 경로 변경

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class ErrorResponse {
    private final String message;
    private final String code;
    private final int status;
    private final List<FieldError> errors;

    @Getter
    @Builder
    public static class FieldError {
        private final String field;
        private final String defaultMessage;
    }

    public static ErrorResponse of(String message, int status, org.springframework.validation.BindingResult bindingResult) {
        List<FieldError> fieldErrors = bindingResult.getFieldErrors().stream()
                .map(error -> FieldError.builder()
                        .field(error.getField())
                        .defaultMessage(error.getDefaultMessage())
                        .build())
                .collect(Collectors.toList());

        return ErrorResponse.builder()
                .message(message)
                .status(status)
                .errors(fieldErrors)
                .build();
    }

    public static ErrorResponse of(String message, int status) {
        return ErrorResponse.builder()
                .message(message)
                .status(status)
                .errors(null)
                .build();
    }
}