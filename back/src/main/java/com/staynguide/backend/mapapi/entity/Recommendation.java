package com.staynguide.backend.mapapi.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer placeId;
    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private double rating;
    private Integer reviewcount;
    @Column(length = 1000)
    private String website;
    private String hotelName;
}
