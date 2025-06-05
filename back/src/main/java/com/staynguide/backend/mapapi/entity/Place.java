package com.staynguide.backend.mapapi.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "place")
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "place_id")
    private Integer id;

    private double latitude;
    private double longitude;

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }
}

