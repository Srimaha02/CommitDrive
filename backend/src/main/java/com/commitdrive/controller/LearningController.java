package com.commitdrive.controller;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.service.LearningProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestParam(value = "subject", required = false) String subject
    ) {
        return ResponseEntity.ok(learningService.getUserTopics(userId, subject));
    }

    @PostMapping("/topic/toggle")
    public ResponseEntity<TopicProgressResponse> toggleTopic(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestBody TopicToggleRequest request
    ) {
        return ResponseEntity.ok(learningService.toggleTopicCompletion(userId, request));
    }

    @GetMapping("/flashcards")
    public ResponseEntity<List<FlashcardReviewResponse>> getFlashcards(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestParam("subject") String subject,
            @RequestParam("topicId") String topicId
    ) {
        return ResponseEntity.ok(learningService.getUserFlashcards(userId, subject, topicId));
    }

    @PostMapping("/flashcard/review")
    public ResponseEntity<FlashcardReviewResponse> reviewFlashcard(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestBody FlashcardReviewRequest request
    ) {
        return ResponseEntity.ok(learningService.saveFlashcardReview(userId, request));
    }
}
