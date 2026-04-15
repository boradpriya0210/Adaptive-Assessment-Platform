package com.job.JOB.dto;

import com.job.JOB.entity.Question;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TestHistoryDTO {
    private String testId;
    private String topic;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Question.Difficulty currentDifficulty;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double accuracy;
    private Long timeTakenSeconds;
}
