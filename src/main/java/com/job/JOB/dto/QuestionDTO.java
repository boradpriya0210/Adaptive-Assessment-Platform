package com.job.JOB.dto;

import com.job.JOB.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDTO {

    private String questionId;
    private String topic;
    private Question.Difficulty difficulty;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    // Note: correctAnswer is not included to prevent exposing it to the client
}
