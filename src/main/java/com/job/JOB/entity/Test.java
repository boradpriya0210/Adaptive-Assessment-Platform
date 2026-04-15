package com.job.JOB.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String testId;

    private String userId;

    private String topic;

    @CreationTimestamp
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private Question.Difficulty currentDifficulty = Question.Difficulty.EASY;

    private Integer score = 0;

    private Integer totalQuestions = 0;

    private Integer correctAnswers = 0;
}
