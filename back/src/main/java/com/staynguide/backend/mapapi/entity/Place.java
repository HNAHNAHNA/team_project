package com.staynguide.backend.mapapi.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "place")
@Data
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer placeId;

    private Integer userId;

    private String hotelName;

    private String address;

    private Double latitude;

    private Double longitude;

    private LocalDate checkIn;

    private LocalDate checkOut;
}
