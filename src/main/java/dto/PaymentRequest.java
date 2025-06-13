package com.staynguide.backend.dto; // ⭐ 사용자님의 프로젝트 패키지 이름입니다.

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메서드를 자동으로 만들어줍니다.
@Setter // Lombok: 이 클래스의 모든 필드에 대한 Setter 메서드를 자동으로 만들어줍니다.
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 만들어줍니다.
@AllArgsConstructor // Lombok: 이 클래스의 모든 필드를 파라미터로 받는 생성자를 자동으로 만들어줍니다.
public class PaymentRequest {
    private Long bookingId; // 결제할 예약의 고유 ID
    private Double amount; // 결제할 금액
    private String paymentMethod; // 결제 수단 (예: "CARD", "BANK_TRANSFER")
    // 이 DTO는 결제 요청 시 웹사이트에서 서버로 보내는 요청 데이터를 정의합니다.
}
