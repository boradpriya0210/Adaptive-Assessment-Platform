package com.job.JOB.repository;

import com.job.JOB.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, String> {

    List<Question> findByDifficulty(Question.Difficulty difficulty);

    List<Question> findByTopicAndDifficulty(String topic, Question.Difficulty difficulty);

    long countByDifficulty(Question.Difficulty difficulty);

    // Will implement random selection in service layer
    List<Question> findAllByDifficulty(Question.Difficulty difficulty);
}
