package com.staynguide.backend.user.entity; // 패키지 경로 변경

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.staynguide.backend.user.enums.Role;        // Enum 경로에 맞춰 수정
import com.staynguide.backend.user.enums.UserStatus; // Enum 경로에 맞춰 수정

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "u_user_id", nullable = false)
    private Long userId;

    @Column(name = "u_email", nullable = false  , unique = true, length = 100)
    private String email;

    @Column(name = "u_password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "u_username", nullable = false, length = 50)
    private String username;

    @Column(name = "u_phone_number", unique = true, length = 30)
    private String phoneNumber;

    @Column(name = "u_zipcode", length = 20)
    private String zipcode;

    @Column(name = "u_address_main", length = 255)
    private String addressMain;

    @Column(name = "u_address_detail", length = 255)
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    @Column(name = "u_role", nullable = false, length = 10)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(name = "u_status", nullable = false, length = 10)
    private UserStatus status;

    @Column(name = "u_refresh_token", length = 500)
    private String refreshToken;

    @Column(name = "u_token_expiry_date")
    private LocalDateTime tokenExpiryDate;

    @Column(name = "u_created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "u_updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}