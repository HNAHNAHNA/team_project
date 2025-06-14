package com.staynguide.backend.mapapi.repository;

import com.staynguide.backend.mapapi.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository //JpaRepository는 CRUD 기능이 자동으로 준비되어 있는 인터페이스
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByHotelName(String hotelName);
}
