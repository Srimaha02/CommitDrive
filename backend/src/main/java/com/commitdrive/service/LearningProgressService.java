package com.commitdrive.service;

import com.commitdrive.dto.ProgressDtos.*;
import com.commitdrive.entity.User;
import com.commitdrive.entity.UserFlashcardReview;
import com.commitdrive.entity.UserTopicProgress;
import com.commitdrive.repository.UserFlashcardReviewRepository;
import com.commitdrive.repository.UserRepository;
import com.commitdrive.repository.UserTopicProgressRepository;
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
public class LearningProgressService {

    private final UserTopicProgressRepository topicRepository;
    private final UserFlashcardReviewRepository flashcardRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public List<TopicProgressResponse> getUserTopics(UUID userId, String subject) {
        User user = authService.getUserByIdOrDemo(userId);
        List<UserTopicProgress> records = subject != null 
                ? topicRepository.findByUserAndSubject(user, subject.toLowerCase())
                : topicRepository.findByUser(user);

        return records.stream().map(t -> TopicProgressResponse.builder()
                .subject(t.getSubject())
                .topicId(t.getTopicId())
                .completed(t.getCompleted())
                .completedAt(t.getCompletedAt())
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    public TopicProgressResponse toggleTopicCompletion(UUID userId, TopicToggleRequest request) {
        User user = authService.getUserByIdOrDemo(userId);
        String subject = request.getSubject().toLowerCase();
        String topicId = request.getTopicId();

        UserTopicProgress progress = topicRepository
                .findByUserAndSubjectAndTopicId(user, subject, topicId)
                .orElseGet(() -> UserTopicProgress.builder()
                        .user(user)
                        .subject(subject)
                        .topicId(topicId)
                        .completed(false)
                        .build()
                );

        boolean newCompletedState = request.getCompleted() != null 
                ? request.getCompleted() 
                : !Boolean.TRUE.equals(progress.getCompleted());

        progress.setCompleted(newCompletedState);
        progress.setNotes(request.getNotes() != null ? request.getNotes() : progress.getNotes());
        progress.setCompletedAt(newCompletedState ? ZonedDateTime.now() : null);

        UserTopicProgress saved = topicRepository.save(progress);

        if (newCompletedState && (user.getStreak() == null || user.getStreak() == 0)) {
            user.setStreak(1);
            user.setLastActiveDate(LocalDate.now());
            userRepository.save(user);
        }

        return TopicProgressResponse.builder()
                .subject(saved.getSubject())
                .topicId(saved.getTopicId())
                .completed(saved.getCompleted())
                .completedAt(saved.getCompletedAt())
                .build();
    }

    @Transactional
    public FlashcardReviewResponse saveFlashcardReview(UUID userId, FlashcardReviewRequest request) {
        User user = authService.getUserByIdOrDemo(userId);
        String subject = request.getSubject().toLowerCase();
        String topicId = request.getTopicId();
        String cardId = request.getCardId();

        UserFlashcardReview review = flashcardRepository
                .findByUserAndSubjectAndTopicIdAndCardId(user, subject, topicId, cardId)
                .orElseGet(() -> UserFlashcardReview.builder()
                        .user(user)
                        .subject(subject)
                        .topicId(topicId)
                        .cardId(cardId)
                        .reviewCount(0)
                        .build()
                );

        review.setStatus(request.getStatus() != null ? request.getStatus() : "REVIEW_NEEDED");
        review.setReviewCount(review.getReviewCount() + 1);
        review.setLastReviewedAt(ZonedDateTime.now());

        UserFlashcardReview saved = flashcardRepository.save(review);

        return FlashcardReviewResponse.builder()
                .subject(saved.getSubject())
                .topicId(saved.getTopicId())
                .cardId(saved.getCardId())
                .status(saved.getStatus())
                .reviewCount(saved.getReviewCount())
                .build();
    }

    public List<FlashcardReviewResponse> getUserFlashcards(UUID userId, String subject, String topicId) {
        User user = authService.getUserByIdOrDemo(userId);
        List<UserFlashcardReview> records = flashcardRepository.findByUserAndSubjectAndTopicId(user, subject.toLowerCase(), topicId);

        return records.stream().map(f -> FlashcardReviewResponse.builder()
                .subject(f.getSubject())
                .topicId(f.getTopicId())
                .cardId(f.getCardId())
                .status(f.getStatus())
                .reviewCount(f.getReviewCount())
                .build()
        ).collect(Collectors.toList());
    }
}
