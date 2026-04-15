package com.job.JOB.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String responseId;

    private String testId;

    private String questionId;

    private String selectedOption;

    private Boolean isCorrect;

    private Integer timeTaken; // in seconds

    @Enumerated(EnumType.STRING)
    private Question.Difficulty difficulty;
}
