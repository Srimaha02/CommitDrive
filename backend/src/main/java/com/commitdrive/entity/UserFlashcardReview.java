package com.commitdrive.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_flashcard_reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "subject", "topic_id", "card_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFlashcardReview {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String subject;

    @Column(nullable = false, length = 50)
    private String topicId;

    @Column(nullable = false, length = 50)
    private String cardId;

    @Column(length = 20)
    @Builder.Default
    private String status = "REVIEW_NEEDED"; // 'MASTERED' or 'REVIEW_NEEDED'

    @Column
    @Builder.Default
    private Integer reviewCount = 1;

    @Column
    @Builder.Default
    private ZonedDateTime lastReviewedAt = ZonedDateTime.now();
}
