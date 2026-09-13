package com.commitdrive.repository;

import com.commitdrive.entity.User;
import com.commitdrive.entity.UserTopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserTopicProgressRepository extends JpaRepository<UserTopicProgress, UUID> {
    List<UserTopicProgress> findByUser(User user);
    List<UserTopicProgress> findByUserAndSubject(User user, String subject);
    Optional<UserTopicProgress> findByUserAndSubjectAndTopicId(User user, String subject, String topicId);
    long countByUserAndCompletedTrue(User user);
    long countByUserAndSubjectAndCompletedTrue(User user, String subject);
}
