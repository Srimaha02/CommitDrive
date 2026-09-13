package com.commitdrive.repository;

import com.commitdrive.entity.User;
import com.commitdrive.entity.UserMissionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserMissionProgressRepository extends JpaRepository<UserMissionProgress, UUID> {
    List<UserMissionProgress> findByUser(User user);
    List<UserMissionProgress> findByUserAndModuleId(User user, String moduleId);
    Optional<UserMissionProgress> findByUserAndModuleIdAndMissionId(User user, String moduleId, String missionId);
    long countByUserAndCompletedTrue(User user);
    long countByUserAndModuleIdAndCompletedTrue(User user, String moduleId);
}
