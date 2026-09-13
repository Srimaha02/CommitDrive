package com.commitdrive.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_mission_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "module_id", "mission_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMissionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String moduleId; // 'git', 'linux', 'sql'

    @Column(nullable = false, length = 50)
    private String missionId; // e.g. 'git-1', 'linux-3'

    @Column
    @Builder.Default
    private Boolean completed = false;

    @Column
    @Builder.Default
    private Integer attemptsCount = 1;

    @Column
    @Builder.Default
    private Boolean unlockedSolutionUsed = false;

    @Column
    @Builder.Default
    private ZonedDateTime completedAt = ZonedDateTime.now();
}
