package com.commitdrive.controller;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.security.SecurityUtils;
import com.commitdrive.service.LearningProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning")
@RequiredArgsConstructor
public class LearningController {

    private final LearningProgressService learningService;

    @GetMapping("/topics")
    public ResponseEntity<List<TopicProgressResponse>> getTopics(
            @AuthenticationPrincipal UUID userId,
            @RequestParam(value = "subject", required = false) String subject
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(learningService.getUserTopics(effectiveUserId, subject));
    }

    @PostMapping("/topic/toggle")
    public ResponseEntity<TopicProgressResponse> toggleTopic(
            @AuthenticationPrincipal UUID userId,
            @RequestBody TopicToggleRequest request
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(learningService.toggleTopicCompletion(effectiveUserId, request));
    }

    @GetMapping("/flashcards")
    public ResponseEntity<List<FlashcardReviewResponse>> getFlashcards(
            @AuthenticationPrincipal UUID userId,
            @RequestParam("subject") String subject,
            @RequestParam("topicId") String topicId
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(learningService.getUserFlashcards(effectiveUserId, subject, topicId));
    }

    @PostMapping("/flashcard/review")
    public ResponseEntity<FlashcardReviewResponse> reviewFlashcard(
            @AuthenticationPrincipal UUID userId,
            @RequestBody FlashcardReviewRequest request
    ) {
        UUID effectiveUserId = userId != null ? userId : SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(learningService.saveFlashcardReview(effectiveUserId, request));
    }
}
