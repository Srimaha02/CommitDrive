package com.commitdrive.controller;

import com.commitdrive.dto.AuthDtos.*;
import com.commitdrive.entity.User;
import com.commitdrive.security.JwtService;
import com.commitdrive.security.SecurityUtils;
import com.commitdrive.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

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
            @AuthenticationPrincipal UUID userId
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(authService.checkInUser(effectiveUserId));
    }

    @GetMapping("/demo")
    public ResponseEntity<AuthResponse> getDemoStudent() {
        User demo = authService.getOrCreateDemoUser();
        String token = jwtService.generateToken(demo);
        AuthResponse response = AuthResponse.builder()
                .token(token)
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
            @AuthenticationPrincipal UUID userId
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        User user = authService.getUserByIdOrDemo(effectiveUserId);
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
