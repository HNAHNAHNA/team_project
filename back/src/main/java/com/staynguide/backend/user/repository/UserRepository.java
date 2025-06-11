package com.staynguide.backend.user.repository; // 패키지 경로 변경

import com.staynguide.backend.user.entity.User; // User 엔티티의 경로 import
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    boolean existsByPhoneNumber(String phoneNumber); // PhoneNumber 필드의 존재 여부를 확인하는 메서드
    
    boolean existsByEmail(String email);
}