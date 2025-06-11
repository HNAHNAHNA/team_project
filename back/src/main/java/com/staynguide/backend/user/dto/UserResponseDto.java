package com.staynguide.backend.user.dto;

import com.staynguide.backend.user.entity.User;
import com.staynguide.backend.user.enums.Role;
import com.staynguide.backend.user.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDto {

    private Long userId;
    private String email;
    private String username;
    private String phoneNumber;
    private String zipcode;
    private String addressMain;
    private String addressDetail;
    private Role role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // User 엔티티를 받아서 DTO로 변환하는 생성자
    public UserResponseDto(User user) {
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.phoneNumber = user.getPhoneNumber();
        this.zipcode = user.getZipcode();
        this.addressMain = user.getAddressMain();
        this.addressDetail = user.getAddressDetail();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
}