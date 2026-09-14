package com.commitdrive.service;

import com.commitdrive.dto.ProgressDtos.DashboardStatsResponse;
import com.commitdrive.dto.ProgressDtos.LeaderboardEntryDto;
import com.commitdrive.entity.User;
import com.commitdrive.repository.UserMissionProgressRepository;
import com.commitdrive.repository.UserRepository;
import com.commitdrive.repository.UserTopicProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
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

        // Calculate exact progress percentage across all 6 core categories (OS, DBMS, CN, Git, Linux, SQL)
        double osPct = (osCount / 10.0) * 100.0;
        double dbmsPct = (dbmsCount / 10.0) * 100.0;
        double cnPct = (cnCount / 10.0) * 100.0;
        double gitPct = (gitCount / 8.0) * 100.0;
        double linuxPct = (linuxCount / 8.0) * 100.0;
        double sqlPct = (sqlCount / 8.0) * 100.0;
        int overallPct = (int) Math.round((osPct + dbmsPct + cnPct + gitPct + linuxPct + sqlPct) / 6.0);
        long totalCompleted = osCount + dbmsCount + cnCount + gitCount + linuxCount + sqlCount;

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

    public List<LeaderboardEntryDto> getLeaderboard() {
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            User demo = authService.getUserByIdOrDemo(null);
            if (demo != null) {
                users = List.of(demo);
            }
        }

        List<LeaderboardEntryDto> entries = new ArrayList<>();
        for (User user : users) {
            long osCount = topicRepository.countByUserAndSubjectAndCompletedTrue(user, "os");
            long dbmsCount = topicRepository.countByUserAndSubjectAndCompletedTrue(user, "dbms");
            long cnCount = topicRepository.countByUserAndSubjectAndCompletedTrue(user, "cn");

            long gitCount = missionRepository.countByUserAndModuleIdAndCompletedTrue(user, "git");
            long linuxCount = missionRepository.countByUserAndModuleIdAndCompletedTrue(user, "linux");
            long sqlCount = missionRepository.countByUserAndModuleIdAndCompletedTrue(user, "sql");

            double osPct = (osCount / 10.0) * 100.0;
            double dbmsPct = (dbmsCount / 10.0) * 100.0;
            double cnPct = (cnCount / 10.0) * 100.0;
            double gitPct = (gitCount / 8.0) * 100.0;
            double linuxPct = (linuxCount / 8.0) * 100.0;
            double sqlPct = (sqlCount / 8.0) * 100.0;
            int overallPct = (int) Math.round((osPct + dbmsPct + cnPct + gitPct + linuxPct + sqlPct) / 6.0);

            long totalTopics = osCount + dbmsCount + cnCount;
            long totalMissions = gitCount + linuxCount + sqlCount;
            long totalCompleted = totalTopics + totalMissions;

            int streak = (totalCompleted == 0 && (user.getStreak() == null || user.getStreak() <= 1))
                    ? 0
                    : (user.getStreak() != null ? user.getStreak() : 0);

            int totalXp = (int) (totalTopics * 100 + totalMissions * 125 + streak * 50);

            entries.add(LeaderboardEntryDto.builder()
                    .userId(user.getId())
                    .fullName(user.getFullName() != null ? user.getFullName() : "Candidate")
                    .email(user.getEmail())
                    .role(user.getRole() != null ? user.getRole() : "SDE Aspirant 2026")
                    .targetYear(user.getTargetYear() != null ? user.getTargetYear() : "2026")
                    .streak(streak)
                    .overallReadinessPct(overallPct)
                    .totalTopicsMastered((int) totalTopics)
                    .totalMissionsPassed((int) totalMissions)
                    .totalXp(totalXp)
                    .build());
        }

        // Sort by readiness percentage descending, then total XP descending
        entries.sort((a, b) -> {
            int cmp = Integer.compare(b.getOverallReadinessPct(), a.getOverallReadinessPct());
            if (cmp != 0) return cmp;
            return Integer.compare(b.getTotalXp(), a.getTotalXp());
        });

        return entries;
    }
}
