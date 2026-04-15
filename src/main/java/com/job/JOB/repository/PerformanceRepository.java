package com.job.JOB.repository;

import com.job.JOB.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, String> {

    List<Performance> findByUserId(String userId);

    Optional<Performance> findByUserIdAndTestId(String userId, String testId);
}
