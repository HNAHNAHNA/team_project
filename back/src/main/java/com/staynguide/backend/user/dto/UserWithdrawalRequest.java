package com.staynguide.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder 
public class UserWithdrawalRequest {

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    private String password; // 탈퇴 확인을 위한 비밀번호
}