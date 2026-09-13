package com.commitdrive.service;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.entity.MockTestAttempt;
import com.commitdrive.entity.User;
import com.commitdrive.entity.UserMissionProgress;
import com.commitdrive.repository.MockTestAttemptRepository;
import com.commitdrive.repository.UserMissionProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticalProgressService {

    private final UserMissionProgressRepository missionRepository;
    private final MockTestAttemptRepository mockTestRepository;
    private final AuthService authService;

    public List<MissionProgressResponse> getUserMissions(UUID userId, String moduleId) {
        User user = authService.getUserByIdOrDemo(userId);
        List<UserMissionProgress> records = moduleId != null
                ? missionRepository.findByUserAndModuleId(user, moduleId.toLowerCase())
                : missionRepository.findByUser(user);

        return records.stream().map(m -> MissionProgressResponse.builder()
                .moduleId(m.getModuleId())
                .missionId(m.getMissionId())
                .completed(m.getCompleted())
                .attemptsCount(m.getAttemptsCount())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public MissionProgressResponse completeMission(UUID userId, MissionCompleteRequest request) {
        User user = authService.getUserByIdOrDemo(userId);
        String moduleId = request.getModuleId().toLowerCase();
        String missionId = request.getMissionId();

        UserMissionProgress progress = missionRepository
                .findByUserAndModuleIdAndMissionId(user, moduleId, missionId)
                .orElseGet(() -> UserMissionProgress.builder()
                        .user(user)
                        .moduleId(moduleId)
                        .missionId(missionId)
                        .completed(false)
                        .attemptsCount(0)
                        .build()
                );

        progress.setCompleted(true);
        progress.setAttemptsCount(request.getAttemptsCount() != null ? request.getAttemptsCount() : progress.getAttemptsCount() + 1);
        progress.setUnlockedSolutionUsed(Boolean.TRUE.equals(request.getUnlockedSolutionUsed()));
        progress.setCompletedAt(ZonedDateTime.now());

        UserMissionProgress saved = missionRepository.save(progress);

        return MissionProgressResponse.builder()
                .moduleId(saved.getModuleId())
                .missionId(saved.getMissionId())
                .completed(saved.getCompleted())
                .attemptsCount(saved.getAttemptsCount())
                .build();
    }

    @Transactional
    public MockTestAttemptResponse submitMockTest(UUID userId, MockTestSubmissionRequest request) {
        User user = authService.getUserByIdOrDemo(userId);

        MockTestAttempt attempt = MockTestAttempt.builder()
                .user(user)
                .moduleId(request.getModuleId().toLowerCase())
                .score(request.getScore())
                .totalQuestions(request.getTotalQuestions() != null ? request.getTotalQuestions() : 10)
                .percentage(request.getPercentage())
                .passed(request.getPassed())
                .timeSpentSeconds(request.getTimeSpentSeconds())
                .categoryBreakdownJson(request.getCategoryBreakdownJson())
                .answersJson(request.getAnswersJson())
                .build();

        MockTestAttempt saved = mockTestRepository.save(attempt);

        return MockTestAttemptResponse.builder()
                .id(saved.getId())
                .moduleId(saved.getModuleId())
                .score(saved.getScore())
                .totalQuestions(saved.getTotalQuestions())
                .percentage(saved.getPercentage())
                .passed(saved.getPassed())
                .categoryBreakdownJson(saved.getCategoryBreakdownJson())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    public List<MockTestAttemptResponse> getMockTestHistory(UUID userId, String moduleId) {
        User user = authService.getUserByIdOrDemo(userId);
        List<MockTestAttempt> attempts = moduleId != null
                ? mockTestRepository.findByUserAndModuleIdOrderByCreatedAtDesc(user, moduleId.toLowerCase())
                : mockTestRepository.findByUserOrderByCreatedAtDesc(user);

        return attempts.stream().map(a -> MockTestAttemptResponse.builder()
                .id(a.getId())
                .moduleId(a.getModuleId())
                .score(a.getScore())
                .totalQuestions(a.getTotalQuestions())
                .percentage(a.getPercentage())
                .passed(a.getPassed())
                .categoryBreakdownJson(a.getCategoryBreakdownJson())
                .createdAt(a.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }
}
