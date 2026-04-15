package com.job.JOB.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResultDTO {

    private String testId;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double accuracy; // percentage
    private Long timeTaken; // total time in seconds
    private Integer easyQuestions;
    private Integer mediumQuestions;
    private Integer hardQuestions;
}
