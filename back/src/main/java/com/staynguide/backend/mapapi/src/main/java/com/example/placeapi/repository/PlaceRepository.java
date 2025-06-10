package com.staynguide.backend.placeapi.src.main.java.com.example.placeapi.repository;

import com.example.placeapi.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRepository extends JpaRepository<Place, Integer> {
    // 기본적인 findAll(), save(), findById() 등 제공됨
}
