package com.commitdrive.controller;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.security.SecurityUtils;
import com.commitdrive.service.PracticalProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/practical")
@RequiredArgsConstructor
public class PracticalController {

    private final PracticalProgressService practicalService;

    @GetMapping("/missions")
    public ResponseEntity<List<MissionProgressResponse>> getMissions(
            @AuthenticationPrincipal UUID userId,
            @RequestParam(value = "moduleId", required = false) String moduleId
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(practicalService.getUserMissions(effectiveUserId, moduleId));
    }

    @PostMapping("/mission/complete")
    public ResponseEntity<MissionProgressResponse> completeMission(
            @AuthenticationPrincipal UUID userId,
            @RequestBody MissionCompleteRequest request
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(practicalService.completeMission(effectiveUserId, request));
    }

    @PostMapping("/mock-test/submit")
    public ResponseEntity<MockTestAttemptResponse> submitMockTest(
            @AuthenticationPrincipal UUID userId,
            @RequestBody MockTestSubmissionRequest request
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(practicalService.submitMockTest(effectiveUserId, request));
    }

    @GetMapping("/mock-test/history")
    public ResponseEntity<List<MockTestAttemptResponse>> getMockTestHistory(
            @AuthenticationPrincipal UUID userId,
            @RequestParam(value = "moduleId", required = false) String moduleId
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(practicalService.getMockTestHistory(effectiveUserId, moduleId));
    }
}
