package com.staynguide.backend.dto; // ⭐ 사용자님의 프로젝트 패키지 이름입니다.

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate; // 날짜만 (년월일) 저장하기 위한 클래스

@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메서드를 자동으로 만들어줍니다.
@Setter // Lombok: 이 클래스의 모든 필드에 대한 Setter 메서드를 자동으로 만들어줍니다.
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 만들어줍니다.
@AllArgsConstructor // Lombok: 이 클래스의 모든 필드를 파라미터로 받는 생성자를 자동으로 만들어줍니다.
public class BookingRequest {
    private Long hotelId; // 예약하려는 숙소의 고유 ID
    private String userName; // 예약자 이름
    private String userEmail; // 예약자 이메일
    private LocalDate checkInDate; // 체크인 날짜
    private LocalDate checkOutDate; // 체크아웃 날짜
    private Integer numberOfRooms; // 예약할 객실 수
    // 이 DTO는 새로운 예약을 만들 때 웹사이트에서 서버로 보내는 요청 데이터를 정의합니다.
}
