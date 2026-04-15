package com.job.JOB.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.job.JOB.entity.Question;
import com.job.JOB.entity.Response;
import com.job.JOB.entity.Test;
import com.job.JOB.repository.QuestionRepository;
import com.job.JOB.repository.ResponseRepository;

@Service
public class AdaptiveDifficultyEngine {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    private static final double INCREASE_THRESHOLD = 0.70; // 70% accuracy to increase difficulty
    private static final double DECREASE_THRESHOLD = 0.50; // Below 50% accuracy to decrease difficulty
    private static final int MIN_QUESTIONS_FOR_CHANGE = 3; // Minimum questions before difficulty change

    public Question.Difficulty getNextDifficulty(Test test, Response latestResponse) {
        List<Response> responses = responseRepository.findByTestId(test.getTestId());

        if (responses.size() < MIN_QUESTIONS_FOR_CHANGE) {
            return test.getCurrentDifficulty();
        }

        // HashMap for difficulty-wise accuracy calculation
        Map<Question.Difficulty, Integer> correctCount = new HashMap<>();
        Map<Question.Difficulty, Integer> totalCount = new HashMap<>();

        for (Response response : responses) {
            Question.Difficulty diff = response.getDifficulty();
            totalCount.put(diff, totalCount.getOrDefault(diff, 0) + 1);
            if (response.getIsCorrect()) {
                correctCount.put(diff, correctCount.getOrDefault(diff, 0) + 1);
            }
        }

        // Calculate current difficulty accuracy
        Question.Difficulty currentDifficulty = test.getCurrentDifficulty();
        int total = totalCount.getOrDefault(currentDifficulty, 0);
        int correct = correctCount.getOrDefault(currentDifficulty, 0);

        if (total == 0) {
            return currentDifficulty;
        }

        double accuracy = (double) correct / total;

        // Adaptive logic
        if (accuracy >= INCREASE_THRESHOLD && currentDifficulty != Question.Difficulty.HARD) {
            return getNextHigherDifficulty(currentDifficulty);
        } else if (accuracy < DECREASE_THRESHOLD && currentDifficulty != Question.Difficulty.EASY) {
            return getNextLowerDifficulty(currentDifficulty);
        }

        return currentDifficulty;
    }

    public Question.Difficulty adjustForTime(Test test, List<Response> responses) {
        if (responses.size() < MIN_QUESTIONS_FOR_CHANGE) {
            return test.getCurrentDifficulty();
        }

        double avgTime = responses.stream()
                .mapToInt(Response::getTimeTaken)
                .average()
                .orElse(60.0);

        Question.Difficulty currentDifficulty = test.getCurrentDifficulty();

        // If too fast (< 30% of average), increase difficulty
        if (avgTime < 20 && currentDifficulty != Question.Difficulty.HARD) {
            return getNextHigherDifficulty(currentDifficulty);
        }
        // If too slow (> 150% of average), decrease difficulty
        else if (avgTime > 90 && currentDifficulty != Question.Difficulty.EASY) {
            return getNextLowerDifficulty(currentDifficulty);
        }

        return currentDifficulty;
    }

    public Map<String, Double> analyzeTopicPerformance(String testId) {
        List<Response> responses = responseRepository.findByTestId(testId);
        return analyzeTopicPerformanceByResponses(responses);
    }

    public Map<String, Double> analyzeTopicPerformanceByResponses(List<Response> responses) {
        Map<String, Integer> correctCount = new HashMap<>();
        Map<String, Integer> totalCount = new HashMap<>();

        if (responses == null || responses.isEmpty()) {
            return new HashMap<>();
        }

        // Collect question IDs and fetch questions in bulk
        Set<String> questionIds = new HashSet<>();
        for (Response r : responses) {
            if (r.getQuestionId() != null) questionIds.add(r.getQuestionId());
        }

        Map<String, Question> questionMap = new HashMap<>();
        if (!questionIds.isEmpty()) {
            questionRepository.findAllById(questionIds).forEach(q -> questionMap.put(q.getQuestionId(), q));
        }

        for (Response r : responses) {
            Question q = questionMap.get(r.getQuestionId());
            String topic = (q != null && q.getTopic() != null) ? q.getTopic() : "Unknown";

            totalCount.put(topic, totalCount.getOrDefault(topic, 0) + 1);
            if (Boolean.TRUE.equals(r.getIsCorrect())) {
                correctCount.put(topic, correctCount.getOrDefault(topic, 0) + 1);
            }
        }

        Map<String, Double> topicAccuracy = new HashMap<>();
        for (Map.Entry<String, Integer> entry : totalCount.entrySet()) {
            String topic = entry.getKey();
            int total = entry.getValue();
            int correct = correctCount.getOrDefault(topic, 0);
            double percent = total > 0 ? (double) correct / total * 100.0 : 0.0;
            topicAccuracy.put(topic, percent);
        }

        return topicAccuracy;
    }

    public List<String> identifyWeakTopics(Map<String, Double> topicAccuracy) {
        List<String> weakTopics = new ArrayList<>();
        for (Map.Entry<String, Double> entry : topicAccuracy.entrySet()) {
            if (entry.getValue() < 60.0) {
                weakTopics.add(entry.getKey());
            }
        }
        return weakTopics;
    }

    public List<String> identifyStrengths(Map<String, Double> topicAccuracy) {
        List<String> strengths = new ArrayList<>();
        for (Map.Entry<String, Double> entry : topicAccuracy.entrySet()) {
            if (entry.getValue() >= 80.0) {
                strengths.add(entry.getKey());
            }
        }
        return strengths;
    }

    private Question.Difficulty getNextHigherDifficulty(Question.Difficulty current) {
        switch (current) {
            case EASY:
                return Question.Difficulty.MEDIUM;
            case MEDIUM:
                return Question.Difficulty.HARD;
            default:
                return current;
        }
    }

    private Question.Difficulty getNextLowerDifficulty(Question.Difficulty current) {
        switch (current) {
            case HARD:
                return Question.Difficulty.MEDIUM;
            case MEDIUM:
                return Question.Difficulty.EASY;
            default:
                return current;
        }
    }
}
