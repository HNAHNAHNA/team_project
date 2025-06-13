package com.staynguide.backend.dto; // ⭐ 사용자님의 프로젝트 패키지 이름입니다.

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메서드를 자동으로 만들어줍니다.
@Setter // Lombok: 이 클래스의 모든 필드에 대한 Setter 메서드를 자동으로 만들어줍니다.
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 만들어줍니다.
@AllArgsConstructor // Lombok: 이 클래스의 모든 필드를 파라미터로 받는 생성자를 자동으로 만들어줍니다.
public class HotelResponse {
    private Long id; // 숙소의 고유 번호
    private String name; // 숙소 이름
    private String address; // 숙소 주소
    private String description; // 숙소 설명
    private Double pricePerNight; // 1박당 가격
    private Integer totalRooms; // 총 객실 수
    private Integer availableRooms; // ⭐ 현재 예약 가능한 객실 수 (숙소 상태 관리)
    private String status; // ⭐ 숙소 전체 상태 (예: "AVAILABLE" - 예약 가능, "UNAVAILABLE" - 예약 불가능) (숙소 상태 관리)
    // 이 DTO는 숙소 정보를 웹사이트로 응답할 때 필요한 정보만 담습니다.
    // 특히 'availableRooms'와 'status'는 숙소의 현재 예약 가능 상태를 보여주기 위해 중요합니다.
}
