package com.commitdrive.service;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.entity.MockTestAttempt;
import com.commitdrive.entity.User;
import com.commitdrive.entity.UserMissionProgress;
import com.commitdrive.repository.MockTestAttemptRepository;
import com.commitdrive.repository.UserMissionProgressRepository;
import com.commitdrive.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PracticalProgressService {

    private final UserMissionProgressRepository missionRepository;
    private final MockTestAttemptRepository mockTestRepository;
    private final UserRepository userRepository;
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

        if (user.getStreak() == null || user.getStreak() == 0) {
            user.setStreak(1);
            user.setLastActiveDate(LocalDate.now());
            userRepository.save(user);
        }

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

        boolean passed = request.getPassed() != null
                ? request.getPassed()
                : (request.getPercentage() != null ? request.getPercentage() >= 70 : (request.getScore() != null && request.getScore() >= 7));

        int timeSpent = request.getTimeSpentSeconds() != null
                ? request.getTimeSpentSeconds()
                : (request.getTimeTakenSeconds() != null ? request.getTimeTakenSeconds() : 0);

        int totalQuestions = request.getTotalQuestions() != null ? request.getTotalQuestions() : 10;
        int score = request.getScore() != null ? request.getScore() : 0;
        int percentage = request.getPercentage() != null
                ? request.getPercentage()
                : (totalQuestions > 0 ? (int) Math.round(((double) score / totalQuestions) * 100.0) : 0);

        MockTestAttempt attempt = MockTestAttempt.builder()
                .user(user)
                .moduleId(request.getModuleId() != null ? request.getModuleId().toLowerCase() : "linux")
                .score(score)
                .totalQuestions(totalQuestions)
                .percentage(percentage)
                .passed(passed)
                .timeSpentSeconds(timeSpent)
                .categoryBreakdownJson(request.getCategoryBreakdownJson() != null ? request.getCategoryBreakdownJson() : "{}")
                .answersJson(request.getAnswersJson() != null ? request.getAnswersJson() : "{}")
                .build();

        MockTestAttempt saved = mockTestRepository.save(attempt);

        if (user.getStreak() == null || user.getStreak() == 0) {
            user.setStreak(1);
            user.setLastActiveDate(LocalDate.now());
            userRepository.save(user);
        }

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
