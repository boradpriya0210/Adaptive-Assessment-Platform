package com.job.JOB.dto;

import com.job.JOB.entity.Question;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StartTestRequestDTO {

    @NotBlank(message = "Topic is required")
    private String topic;

    private Question.Difficulty difficulty = Question.Difficulty.EASY; // default
}
