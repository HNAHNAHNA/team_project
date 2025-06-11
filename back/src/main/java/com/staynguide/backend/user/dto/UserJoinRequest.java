package com.staynguide.backend.user.dto; // DTO는 보통 별도의 'dto' 패키지에 위치합니다.

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
public class UserJoinRequest {

    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "유효한 이메일 주소를 입력해주세요.")
    private String email; // 로그인 ID (u_email)

    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}",
            message = "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8~20자리여야 합니다.")
    private String password; // 평문 비밀번호 (u_password_hash로 변환될 값)

    @NotBlank(message = "비밀번호 확인은 필수 입력 값입니다.")
    private String passwordConfirm; // 비밀번호 확인

    @NotBlank(message = "사용자 이름은 필수 입력 값입니다.")
    private String username; // 사용자 실명 또는 닉네임 (u_username)

    @Pattern(regexp = "^(010|011|016|017|018|019)-[0-9]{3,4}-[0-9]{4}$",
            message = "유효한 전화번호 형식(010-XXXX-XXXX)으로 입력해주세요.")
    private String phoneNumber; // 연락처 (u_phone_number)

    private String zipcode;        // 우편번호 (u_zipcode)
    private String addressMain;    // 기본 주소 (u_address_main)
    private String addressDetail;  // 상세 주소 (u_address_detail)
}