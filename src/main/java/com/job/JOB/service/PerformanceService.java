package com.job.JOB.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.job.JOB.dto.PerformanceDTO;
import com.job.JOB.dto.ResultDTO;
import com.job.JOB.entity.Performance;
import com.job.JOB.entity.Question;
import com.job.JOB.entity.Response;
import com.job.JOB.entity.Test;
import com.job.JOB.repository.PerformanceRepository;
import com.job.JOB.repository.ResponseRepository;
import com.job.JOB.repository.TestRepository;

@Service
public class PerformanceService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private PerformanceRepository performanceRepository;

    @Autowired
    private AdaptiveDifficultyEngine adaptiveDifficultyEngine;

    public ResultDTO getTestResult(String testId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));

        List<Response> responses = responseRepository.findByTestId(testId);

        // Calculate difficulty distribution
        long easyCount = responses.stream().filter(r -> r.getDifficulty() == Question.Difficulty.EASY).count();
        long mediumCount = responses.stream().filter(r -> r.getDifficulty() == Question.Difficulty.MEDIUM).count();
        long hardCount = responses.stream().filter(r -> r.getDifficulty() == Question.Difficulty.HARD).count();

        // Calculate total time
        long totalTime = 0;
        if (test.getStartTime() != null && test.getEndTime() != null) {
            totalTime = Duration.between(test.getStartTime(), test.getEndTime()).getSeconds();
        }

        // Calculate accuracy
        double accuracy = test.getTotalQuestions() > 0
                ? (double) test.getCorrectAnswers() / test.getTotalQuestions() * 100
                : 0.0;

        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setTestId(test.getTestId());
        resultDTO.setScore(test.getScore());
        resultDTO.setTotalQuestions(test.getTotalQuestions());
        resultDTO.setCorrectAnswers(test.getCorrectAnswers());
        resultDTO.setAccuracy(accuracy);
        resultDTO.setTimeTaken(totalTime);
        resultDTO.setEasyQuestions((int) easyCount);
        resultDTO.setMediumQuestions((int) mediumCount);
        resultDTO.setHardQuestions((int) hardCount);

        // Save performance data
        savePerformanceData(test, responses, accuracy);

        return resultDTO;
    }

    public PerformanceDTO getUserPerformance(String userId) {
        List<Test> tests = testRepository.findByUserId(userId);

        if (tests.isEmpty()) {
            return new PerformanceDTO();
        }

        // Get all responses for all tests
        List<Response> allResponses = new ArrayList<>();
        for (Test test : tests) {
            allResponses.addAll(responseRepository.findByTestId(test.getTestId()));
        }

        // Calculate overall accuracy
        long totalCorrect = allResponses.stream().filter(Response::getIsCorrect).count();
        double overallAccuracy = allResponses.size() > 0
                ? (double) totalCorrect / allResponses.size() * 100
                : 0.0;

        // Calculate average time
        double avgTime = allResponses.stream()
                .mapToInt(Response::getTimeTaken)
                .average()
                .orElse(0.0);

        // Topic-wise accuracy - calculate using responses and question topics
        Map<String, Double> topicAccuracy = adaptiveDifficultyEngine.analyzeTopicPerformanceByResponses(allResponses);

        // Identify weak topics and strengths
        List<String> weakTopics = adaptiveDifficultyEngine.identifyWeakTopics(topicAccuracy);
        List<String> strengths = adaptiveDifficultyEngine.identifyStrengths(topicAccuracy);

        // Speed analysis by difficulty
        Map<String, Double> speedAnalysis = new HashMap<>();
        Map<Question.Difficulty, List<Response>> difficultyResponses = allResponses.stream()
                .collect(Collectors.groupingBy(Response::getDifficulty));

        for (Map.Entry<Question.Difficulty, List<Response>> entry : difficultyResponses.entrySet()) {
            double avgSpeed = entry.getValue().stream()
                    .mapToInt(Response::getTimeTaken)
                    .average()
                    .orElse(0.0);
            speedAnalysis.put(entry.getKey().name(), avgSpeed);
        }

        PerformanceDTO performanceDTO = new PerformanceDTO();
        performanceDTO.setUserId(userId);
        performanceDTO.setOverallAccuracy(overallAccuracy);
        performanceDTO.setAvgTime(avgTime);
        performanceDTO.setWeakTopics(weakTopics);
        performanceDTO.setStrengths(strengths);
        performanceDTO.setTopicAccuracy(topicAccuracy);
        performanceDTO.setSpeedAnalysis(speedAnalysis);

        return performanceDTO;
    }

    public List<com.job.JOB.dto.TestHistoryDTO> getUserTestHistory(String userId) {
        List<Test> tests = testRepository.findByUserId(userId);

        tests.sort((t1, t2) -> {
            if (t1.getStartTime() == null || t2.getStartTime() == null) return 0;
            return t2.getStartTime().compareTo(t1.getStartTime());
        });

        return tests.stream().map(test -> {
            com.job.JOB.dto.TestHistoryDTO dto = new com.job.JOB.dto.TestHistoryDTO();
            dto.setTestId(test.getTestId());
            dto.setTopic(test.getTopic());
            dto.setStartTime(test.getStartTime());
            dto.setEndTime(test.getEndTime());
            dto.setCurrentDifficulty(test.getCurrentDifficulty());
            dto.setScore(test.getScore() != null ? test.getScore() : 0);
            dto.setTotalQuestions(test.getTotalQuestions() != null ? test.getTotalQuestions() : 0);
            dto.setCorrectAnswers(test.getCorrectAnswers() != null ? test.getCorrectAnswers() : 0);

            double accuracy = dto.getTotalQuestions() > 0
                    ? (double) dto.getCorrectAnswers() / dto.getTotalQuestions() * 100
                    : 0.0;
            dto.setAccuracy(accuracy);

            if (test.getEndTime() != null && test.getStartTime() != null) {
                dto.setTimeTakenSeconds(Duration.between(test.getStartTime(), test.getEndTime()).getSeconds());
            } else {
                dto.setTimeTakenSeconds(0L);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    private void savePerformanceData(Test test, List<Response> responses, double accuracy) {
        // Calculate topic performance
        Map<String, Double> topicAccuracy = adaptiveDifficultyEngine.analyzeTopicPerformance(test.getTestId());
        List<String> weakTopics = adaptiveDifficultyEngine.identifyWeakTopics(topicAccuracy);
        List<String> strengths = adaptiveDifficultyEngine.identifyStrengths(topicAccuracy);

        // Calculate average time
        double avgTime = responses.stream()
                .mapToInt(Response::getTimeTaken)
                .average()
                .orElse(0.0);

        Performance performance = new Performance();
        performance.setUserId(test.getUserId());
        performance.setTestId(test.getTestId());
        performance.setAccuracy(accuracy);
        performance.setAvgTime(avgTime);
        performance.setWeakTopics(String.join(",", weakTopics));
        performance.setStrengths(String.join(",", strengths));

        performanceRepository.save(performance);
    }
}
