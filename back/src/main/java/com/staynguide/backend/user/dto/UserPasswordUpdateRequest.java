package com.staynguide.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPasswordUpdateRequest {

	@NotBlank(message = "현재 비밀번호는 필수 입력 값입니다.")
	private String currentPassword; // 사용자가 입력한 현재 비밀번호

	@NotBlank(message = "새 비밀번호는 필수 입력 값입니다.")
	@Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,20}", message = "새 비밀번호는 영문 대소문자, 숫자, 특수문자를 포함하여 8~20자리여야 합니다.")
	private String newPassword; // 사용자가 입력한 새 비밀번호

	@NotBlank(message = "새 비밀번호 확인은 필수 입력 값입니다.")
	private String newPasswordConfirm; // 사용자가 입력한 새 비밀번호 확인
}
