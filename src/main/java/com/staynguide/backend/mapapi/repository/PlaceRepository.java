package com.staynguide.backend.mapapi.repository;

import com.staynguide.backend.mapapi.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRepository extends JpaRepository<Place, Integer> {
    // 기본적인 findAll(), save(), findById() 등 제공됨
}
