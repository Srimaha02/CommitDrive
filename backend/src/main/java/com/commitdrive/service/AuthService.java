package com.commitdrive.service;

import com.commitdrive.dto.AuthDtos.*;
import com.commitdrive.entity.User;
import com.commitdrive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole() != null ? request.getRole() : "SDE Aspirant 2026")
                .targetYear(request.getTargetYear() != null ? request.getTargetYear() : "2026")
                .streak(1)
                .lastActiveDate(LocalDate.now())
                .build();

        User savedUser = userRepository.save(user);

        return AuthResponse.builder()
                .token(savedUser.getId().toString())
                .user(mapToProfile(savedUser))
                .message("Account created successfully")
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Update streak if needed
        LocalDate today = LocalDate.now();
        if (user.getLastActiveDate() != null && user.getLastActiveDate().isBefore(today.minusDays(1))) {
            user.setStreak(1); // Reset streak if missed more than 1 day
        } else if (user.getLastActiveDate() != null && user.getLastActiveDate().equals(today.minusDays(1))) {
            user.setStreak(user.getStreak() + 1); // Increment streak
        }
        user.setLastActiveDate(today);
        userRepository.save(user);

        return AuthResponse.builder()
                .token(user.getId().toString())
                .user(mapToProfile(user))
                .message("Logged in successfully")
                .build();
    }

    public UserProfileDto getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return mapToProfile(user);
    }

    @Transactional
    public User getOrCreateDemoUser() {
        return userRepository.findByEmail("cs.placement@prep.edu").orElseGet(() -> {
            User demo = User.builder()
                    .email("cs.placement@prep.edu")
                    .passwordHash(passwordEncoder.encode("student123"))
                    .fullName("Mikro Student")
                    .role("SDE Aspirant 2026")
                    .targetYear("2026")
                    .streak(3)
                    .lastActiveDate(LocalDate.now())
                    .build();
            return userRepository.save(demo);
        });
    }

    public User getUserByIdOrDemo(UUID userId) {
        if (userId == null) {
            return getOrCreateDemoUser();
        }
        return userRepository.findById(userId).orElseGet(this::getOrCreateDemoUser);
    }

    private UserProfileDto mapToProfile(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .targetYear(user.getTargetYear())
                .streak(user.getStreak())
                .build();
    }
}
