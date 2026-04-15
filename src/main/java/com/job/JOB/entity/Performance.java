package com.job.JOB.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "performance")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String performanceId;

    private String userId;

    private String testId;

    private Double accuracy; // percentage

    private Double avgTime; // average seconds per question

    @Column(length = 1000)
    private String weakTopics; // comma-separated topics

    @Column(length = 1000)
    private String strengths; // comma-separated topics
}
