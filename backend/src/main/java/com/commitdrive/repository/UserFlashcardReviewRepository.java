package com.commitdrive.repository;

import com.commitdrive.entity.User;
import com.commitdrive.entity.UserFlashcardReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserFlashcardReviewRepository extends JpaRepository<UserFlashcardReview, UUID> {
    List<UserFlashcardReview> findByUser(User user);
    List<UserFlashcardReview> findByUserAndSubjectAndTopicId(User user, String subject, String topicId);
    Optional<UserFlashcardReview> findByUserAndSubjectAndTopicIdAndCardId(User user, String subject, String topicId, String cardId);
    long countByUserAndStatus(User user, String status);
}
