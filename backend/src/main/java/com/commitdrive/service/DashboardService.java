package com.commitdrive.service;

import com.commitdrive.dto.ProgressDtos.DashboardStatsResponse;
import com.commitdrive.entity.User;
import com.commitdrive.repository.UserMissionProgressRepository;
import com.commitdrive.repository.UserTopicProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserTopicProgressRepository topicRepository;
    private final UserMissionProgressRepository missionRepository;
    private final AuthService authService;

    public DashboardStatsResponse getDashboardStats(UUID userId) {
        User user = authService.getUserByIdOrDemo(userId);

        long osCount = topicRepository.countByUserAndSubjectAndCompletedTrue(user, "os");
        long dbmsCount = topicRepository.countByUserAndSubjectAndCompletedTrue(user, "dbms");
        long cnCount = topicRepository.countByUserAndSubjectAndCompletedTrue(user, "cn");

        long gitCount = missionRepository.countByUserAndModuleIdAndCompletedTrue(user, "git");
        long linuxCount = missionRepository.countByUserAndModuleIdAndCompletedTrue(user, "linux");
        long sqlCount = missionRepository.countByUserAndModuleIdAndCompletedTrue(user, "sql");

        // Total weighted curriculum progress (30 topics + 24 missions = 54 total milestones)
        long totalCompleted = osCount + dbmsCount + cnCount + gitCount + linuxCount + sqlCount;
        int overallPct = (int) Math.round(((double) totalCompleted / 54.0) * 100.0);

        List<String> diagnosticAlerts = new ArrayList<>();
        if (cnCount < 3) {
            diagnosticAlerts.add("Computer Networks: Protocol packet structure & handshakes require practice.");
        }
        if (linuxCount < 3) {
            diagnosticAlerts.add("Linux CLI: Command pipelines (grep | wc) & file permission bitmasks need attention.");
        }
        if (gitCount < 3) {
            diagnosticAlerts.add("Git: Merge conflict resolution and stash workflows recommended before placement rounds.");
        }

        return DashboardStatsResponse.builder()
                .overallReadinessPct(Math.max(overallPct, 15)) // friendly baseline floor
                .streak(user.getStreak() != null ? user.getStreak() : 3)
                .osMasteredCount((int) osCount)
                .dbmsMasteredCount((int) dbmsCount)
                .cnMasteredCount((int) cnCount)
                .gitMissionsPassedCount((int) gitCount)
                .linuxMissionsPassedCount((int) linuxCount)
                .sqlMissionsPassedCount((int) sqlCount)
                .diagnosticAlerts(diagnosticAlerts)
                .build();
    }
}
