package com.staynguide.backend.accmo.repository;

import com.staynguide.backend.accmo.entity.Hotel; // 이 부분을 수정!
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
}