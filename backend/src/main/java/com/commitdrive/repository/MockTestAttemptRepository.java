package com.commitdrive.repository;

import com.commitdrive.entity.MockTestAttempt;
import com.commitdrive.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MockTestAttemptRepository extends JpaRepository<MockTestAttempt, UUID> {
    List<MockTestAttempt> findByUserOrderByCreatedAtDesc(User user);
    List<MockTestAttempt> findByUserAndModuleIdOrderByCreatedAtDesc(User user, String moduleId);
}
