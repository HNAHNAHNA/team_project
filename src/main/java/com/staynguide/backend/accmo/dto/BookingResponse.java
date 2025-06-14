package com.staynguide.backend.accmo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long hotelId;
    private String hotelName;
    private String userName;
    private String userEmail;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfRooms;
    private Double totalPrice;
    private String status;
    private String paymentStatus;
    private LocalDateTime bookedAt;
}
