package com.commitdrive.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_mock_test_attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MockTestAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String moduleId; // 'git', 'linux', 'sql'

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalQuestions = 10;

    @Column(nullable = false)
    private Integer percentage;

    @Column(nullable = false)
    private Boolean passed;

    @Column
    private Integer timeSpentSeconds;

    @Column(columnDefinition = "TEXT")
    private String categoryBreakdownJson; // JSON string for category diagnostics

    @Column(columnDefinition = "TEXT")
    private String answersJson; // JSON string for user choices

    @CreationTimestamp
    @Column(updatable = false)
    private ZonedDateTime createdAt;
}
