package com.job.JOB.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswerDTO {

    @NotNull(message = "Test ID is required")
    private String testId;

    @NotNull(message = "Question ID is required")
    private String questionId;

    @NotBlank(message = "Selected option is required")
    private String selectedOption;

    @NotNull(message = "Time taken is required")
    private Integer timeTaken; // in seconds
}
