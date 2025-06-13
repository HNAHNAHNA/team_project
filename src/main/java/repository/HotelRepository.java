package com.staynguide.backend.repository;

import com.staynguide.backend.entity.Hotel;; // 우리가 만든 Hotel 엔티티
import org.springframework.data.jpa.repository.JpaRepository; // 스프링에서 제공하는 데이터베이스 접근 도구
import org.springframework.stereotype.Repository; // 이 인터페이스가 데이터베이스 역할을 한다는 것을 알려줍니다.

@Repository
// By extending JpaRepository, you automatically get basic save, find, and delete functionalities for the Hotel entity.
// <Hotel, Long> means "manages the Hotel entity, and Hotel's primary key is of type Long".
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    // You can add additional query methods here if needed.
    // Example: Optional<Hotel> findByName(String name); // To find a hotel by name
}
