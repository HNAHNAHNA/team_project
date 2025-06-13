package com.staynguide.backend.dto; // ⭐ 사용자님의 프로젝트 패키지 이름입니다.

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메서드를 자동으로 만들어줍니다.
@Setter // Lombok: 이 클래스의 모든 필드에 대한 Setter 메서드를 자동으로 만들어줍니다.
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 만들어줍니다.
@AllArgsConstructor // Lombok: 이 클래스의 모든 필드를 파라미터로 받는 생성자를 자동으로 만들어줍니다.
public class BookingResponse {
    private Long id; // 예약의 고유 번호
    private Long hotelId; // 예약된 숙소의 고유 ID
    private String hotelName; // 예약된 숙소의 이름
    private String userName; // 예약자 이름
    private String userEmail; // 예약자 이메일
    private LocalDate checkInDate; // 체크인 날짜
    private LocalDate checkOutDate; // 체크아웃 날짜
    private Integer numberOfRooms; // 예약한 객실 수
    private Double totalPrice; // 총 결제 금액
    private String status; // ⭐ 예약 상태 (PENDING, CONFIRMED, CANCELLED, COMPLETED)
    private String paymentStatus; // ⭐ 결제 상태 (PENDING, PAID, REFUNDED, FAILED)
    private LocalDateTime bookedAt; // 예약이 생성된 시간
    // 이 DTO는 예약 정보를 웹사이트로 응답할 때 필요한 정보만 담습니다.
    // 'status'와 'paymentStatus'는 예약 및 결제 상태를 보여주기 위해 중요합니다.
}
