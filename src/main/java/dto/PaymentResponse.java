package com.staynguide.backend.dto; // ⭐ 사용자님의 프로젝트 패키지 이름입니다.

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메서드를 자동으로 만들어줍니다.
@Setter // Lombok: 이 클래스의 모든 필드에 대한 Setter 메서드를 자동으로 만들어줍니다.
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 만들어줍니다.
@AllArgsConstructor // Lombok: 이 클래스의 모든 필드를 파라미터로 받는 생성자를 자동으로 만들어줍니다.
public class PaymentResponse {
    private Long bookingId; // 결제가 처리된 예약의 고유 ID
    private String status; // ⭐ 결제 처리 결과 (예: "SUCCESS" - 성공, "FAILED" - 실패)
    private String message; // 결제 처리 관련 메시지
    private Double paidAmount; // 실제로 결제된 금액
    // 이 DTO는 결제 처리 후 서버가 웹사이트로 보내는 응답 데이터를 정의합니다.
    // 'status' 필드가 결제 성공 여부를 나타내는 핵심 정보입니다.
}
