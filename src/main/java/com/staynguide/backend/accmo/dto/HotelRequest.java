package com.staynguide.backend.accmo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HotelRequest {
    private String name;
    private String address;
    private String description;
    private Double pricePerNight;
    private Integer totalRooms;
}