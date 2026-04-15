package com.job.JOB.repository;

import com.job.JOB.entity.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, String> {

    List<Response> findByTestId(String testId);

    long countByTestIdAndIsCorrect(String testId, Boolean isCorrect);
}
