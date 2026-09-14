package com.commitdrive.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class ProgressDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopicToggleRequest {
        private String subject; // 'os', 'dbms', 'cn'
        private String topicId; // 'os-1', 'dbms-3'
        private Boolean completed;
        private String notes;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlashcardReviewRequest {
        private String subject;
        private String topicId;
        private String cardId;
        private String status; // 'MASTERED' or 'REVIEW_NEEDED'
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissionCompleteRequest {
        private String moduleId; // 'git', 'linux', 'sql'
        private String missionId; // 'git-1', 'linux-4'
        private Integer attemptsCount;
        private Boolean unlockedSolutionUsed;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MockTestSubmissionRequest {
        private String moduleId;
        private Integer score;
        private Integer totalQuestions;
        private Integer percentage;
        private Boolean passed;
        private Integer timeSpentSeconds;
        private Integer timeTakenSeconds;
        private String categoryBreakdownJson;
        private String answersJson;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopicProgressResponse {
        private String subject;
        private String topicId;
        private Boolean completed;
        private ZonedDateTime completedAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FlashcardReviewResponse {
        private String subject;
        private String topicId;
        private String cardId;
        private String status;
        private Integer reviewCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MissionProgressResponse {
        private String moduleId;
        private String missionId;
        private Boolean completed;
        private Integer attemptsCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MockTestAttemptResponse {
        private UUID id;
        private String moduleId;
        private Integer score;
        private Integer totalQuestions;
        private Integer percentage;
        private Boolean passed;
        private String categoryBreakdownJson;
        private ZonedDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DashboardStatsResponse {
        private Integer overallReadinessPct;
        private Integer streak;
        private Integer osMasteredCount;
        private Integer dbmsMasteredCount;
        private Integer cnMasteredCount;
        private Integer gitMissionsPassedCount;
        private Integer linuxMissionsPassedCount;
        private Integer sqlMissionsPassedCount;
        private List<String> diagnosticAlerts;
    }
}
