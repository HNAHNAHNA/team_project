package com.staynguide.backend.accmo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate; // 날짜만 (년월일) 저장하기 위한 클래스

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long hotelId;
    private String userName;
    private String userEmail;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfRooms;

}
