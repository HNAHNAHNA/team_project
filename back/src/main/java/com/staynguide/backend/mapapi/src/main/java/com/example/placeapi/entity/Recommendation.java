package com.staynguide.backend.placeapi.src.main.java.com.example.placeapi.entity;

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
    private String website;
}
