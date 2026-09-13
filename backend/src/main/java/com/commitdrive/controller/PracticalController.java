package com.commitdrive.controller;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.service.PracticalProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestParam(value = "moduleId", required = false) String moduleId
    ) {
        return ResponseEntity.ok(practicalService.getUserMissions(userId, moduleId));
    }

    @PostMapping("/mission/complete")
    public ResponseEntity<MissionProgressResponse> completeMission(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestBody MissionCompleteRequest request
    ) {
        return ResponseEntity.ok(practicalService.completeMission(userId, request));
    }

    @PostMapping("/mock-test/submit")
    public ResponseEntity<MockTestAttemptResponse> submitMockTest(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestBody MockTestSubmissionRequest request
    ) {
        return ResponseEntity.ok(practicalService.submitMockTest(userId, request));
    }

    @GetMapping("/mock-test/history")
    public ResponseEntity<List<MockTestAttemptResponse>> getMockTestHistory(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestParam(value = "moduleId", required = false) String moduleId
    ) {
        return ResponseEntity.ok(practicalService.getMockTestHistory(userId, moduleId));
    }
}
