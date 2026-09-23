package com.commitdrive.controller;

import com.commitdrive.dto.AuthDtos.*;
import com.commitdrive.entity.User;
import com.commitdrive.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/checkin")
    public ResponseEntity<StreakCheckInResponse> checkIn(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId
    ) {
        return ResponseEntity.ok(authService.checkInUser(userId));
    }

    @GetMapping("/demo")
    public ResponseEntity<AuthResponse> getDemoStudent() {
        User demo = authService.getOrCreateDemoUser();
        AuthResponse response = AuthResponse.builder()
                .token(demo.getId().toString())
                .user(UserProfileDto.builder()
                        .id(demo.getId())
                        .email(demo.getEmail())
                        .fullName(demo.getFullName())
                        .role(demo.getRole())
                        .targetYear(demo.getTargetYear())
                        .streak(demo.getStreak())
                        .build())
                .message("Demo student loaded successfully")
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId
    ) {
        User user = authService.getUserByIdOrDemo(userId);
        return ResponseEntity.ok(UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .targetYear(user.getTargetYear())
                .streak(user.getStreak())
                .build());
    }
}
