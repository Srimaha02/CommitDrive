package com.commitdrive.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_topic_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "subject", "topic_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserTopicProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String subject; // 'os', 'dbms', 'cn'

    @Column(nullable = false, length = 50)
    private String topicId; // e.g. 'os-1', 'dbms-4'

    @Column
    @Builder.Default
    private Boolean completed = false;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column
    private ZonedDateTime completedAt;

    @UpdateTimestamp
    private ZonedDateTime updatedAt;
}
