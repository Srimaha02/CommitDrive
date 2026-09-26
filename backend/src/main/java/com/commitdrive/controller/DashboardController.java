package com.commitdrive.controller;

import com.commitdrive.dto.ProgressDtos.DashboardStatsResponse;
import com.commitdrive.dto.ProgressDtos.LeaderboardEntryDto;
import com.commitdrive.security.SecurityUtils;
import com.commitdrive.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats(
            @AuthenticationPrincipal UUID userId
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(dashboardService.getDashboardStats(effectiveUserId));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard() {
        return ResponseEntity.ok(dashboardService.getLeaderboard());
    }
}
