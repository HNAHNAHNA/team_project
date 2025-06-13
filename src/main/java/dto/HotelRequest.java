package com.staynguide.backend.dto; // ⭐ 사용자님의 프로젝트 패키지 이름입니다.

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter // Lombok: 이 클래스의 모든 필드에 대한 Getter 메서드를 자동으로 만들어줍니다.
@Setter // Lombok: 이 클래스의 모든 필드에 대한 Setter 메서드를 자동으로 만들어줍니다.
@NoArgsConstructor // Lombok: 파라미터가 없는 기본 생성자를 자동으로 만들어줍니다.
@AllArgsConstructor // Lombok: 이 클래스의 모든 필드를 파라미터로 받는 생성자를 자동으로 만들어줍니다.
public class HotelRequest {
    private String name; // 숙소 이름
    private String address; // 숙소 주소
    private String description; // 숙소 설명
    private Double pricePerNight; // 1박당 가격
    private Integer totalRooms; // 총 객실 수
    // 이 DTO는 숙소 생성 또는 수정 요청 시 필요한 정보만 담습니다.
    // 숙소의 상태나 현재 예약 가능한 객실 수는 이 요청을 받는 서버의 로직에서 자동으로 처리됩니다.
}
