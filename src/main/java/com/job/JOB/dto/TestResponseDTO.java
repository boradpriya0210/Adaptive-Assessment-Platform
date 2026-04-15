package com.job.JOB.dto;

import com.job.JOB.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResponseDTO {

    private String testId;
    private QuestionDTO nextQuestion;
    private Question.Difficulty currentDifficulty;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Boolean isCorrect; // for feedback on last answer
    private Boolean testCompleted;
}
