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
        if (totalCompleted == 0) {
            diagnosticAlerts.add("Begin with Operating Systems theory in Study Corner or Git missions in Terminal Zone to start your readiness progress.");
        } else {
            if (cnCount < 3) {
                diagnosticAlerts.add("Computer Networks: Protocol packet structure & handshakes require practice.");
            }
            if (linuxCount < 3) {
                diagnosticAlerts.add("Linux CLI: Command pipelines (grep | wc) & file permission bitmasks need attention.");
            }
            if (gitCount < 3) {
                diagnosticAlerts.add("Git: Merge conflict resolution and stash workflows recommended before placement rounds.");
            }
        }

        int streak = (totalCompleted == 0 && (user.getStreak() == null || user.getStreak() <= 1))
                ? 0
                : (user.getStreak() != null ? user.getStreak() : 0);

        return DashboardStatsResponse.builder()
                .overallReadinessPct(overallPct)
                .streak(streak)
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
