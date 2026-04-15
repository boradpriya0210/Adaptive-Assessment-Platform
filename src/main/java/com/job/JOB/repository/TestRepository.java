package com.job.JOB.repository;

import com.job.JOB.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, String> {

    List<Test> findByUserId(String userId);

    List<Test> findByUserIdOrderByStartTimeDesc(String userId);
}
