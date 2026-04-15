package com.job.JOB.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceDTO {

    private String userId;
    private Double overallAccuracy;
    private Double avgTime;
    private List<String> weakTopics;
    private List<String> strengths;
    private Map<String, Double> topicAccuracy;
    private Map<String, Double> speedAnalysis;
}
