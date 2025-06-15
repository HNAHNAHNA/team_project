package com.staynguide.backend.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size; // 문자열 길이 제한을 위해 추가
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // 빌더 패턴으로 객체 생성 용이
public class UserUpdateRequest {

    // 이름은 필수 입력, 2~50자
    @NotBlank(message = "사용자 이름은 필수 입력 값입니다.")
    @Size(min = 2, max = 50, message = "사용자 이름은 2자 이상 50자 이하여야 합니다.")
    private String username;

    // 전화번호는 선택 사항이지만, 입력되면 형식 검증
    @Pattern(regexp = "^(010|011|016|017|018|019)-[0-9]{3,4}-[0-9]{4}$",
            message = "유효한 전화번호 형식(010-XXXX-XXXX)으로 입력해주세요.",
            // null 허용을 위해 optional=true
            // (NotBlank가 없으므로 필드 자체가 null일 경우 Pattern 검증을 건너뜀)
            // (하지만, 빈 문자열 ""이 오면 Pattern 검증이 작동함)
            // 즉, null은 통과, ""은 실패. 프론트에서 빈값이면 null로 보내도록 처리 필요.
            groups = {Pattern.Flag.class} // Pattern.Flag 사용을 위해 (여기서는 필수 아님)
    )
    private String phoneNumber;

    private String zipcode;
    private String addressMain;
    private String addressDetail;
}