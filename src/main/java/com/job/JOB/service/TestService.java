package com.job.JOB.service;

import com.job.JOB.dto.QuestionDTO;
import com.job.JOB.dto.SubmitAnswerDTO;
import com.job.JOB.dto.TestResponseDTO;
import com.job.JOB.dto.StartTestRequestDTO;
import com.job.JOB.entity.Question;
import com.job.JOB.entity.Response;
import com.job.JOB.entity.Test;
import com.job.JOB.repository.ResponseRepository;
import com.job.JOB.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private AdaptiveDifficultyEngine adaptiveDifficultyEngine;

    private static final int MAX_QUESTIONS = 10; // Maximum questions per test

    @Transactional
    public TestResponseDTO startTest(String userId, StartTestRequestDTO requestDTO) {
        // Create new test
        Test test = new Test();
        test.setUserId(userId);
        test.setTopic(requestDTO.getTopic());
        test.setStartTime(LocalDateTime.now());
        test.setCurrentDifficulty(requestDTO.getDifficulty() != null ? requestDTO.getDifficulty() : Question.Difficulty.EASY);
        test.setScore(0);
        test.setTotalQuestions(0);
        test.setCorrectAnswers(0);
        test = testRepository.save(test);

        // Get first question
        QuestionDTO firstQuestion = questionService.getRandomQuestionByTopicAndDifficulty(test.getTopic(), test.getCurrentDifficulty());
        if (firstQuestion == null) {
            throw new RuntimeException("No questions found for topic: " + test.getTopic() + ". Please ensure the database is seeded.");
        }

        TestResponseDTO response = new TestResponseDTO();
        response.setTestId(test.getTestId());
        response.setNextQuestion(firstQuestion);
        response.setCurrentDifficulty(test.getCurrentDifficulty());
        response.setTotalQuestions(0);
        response.setCorrectAnswers(0);
        response.setTestCompleted(false);

        return response;
    }

    @Transactional
    public TestResponseDTO submitAnswer(SubmitAnswerDTO submitAnswerDTO) {
        // Get test
        Test test = testRepository.findById(submitAnswerDTO.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        // Get question
        Question question = questionService.getQuestionById(submitAnswerDTO.getQuestionId());

        // Check if answer is correct
        boolean isCorrect = question.getCorrectAnswer().equalsIgnoreCase(submitAnswerDTO.getSelectedOption());

        // Save response
        Response response = new Response();
        response.setTestId(test.getTestId());
        response.setQuestionId(question.getQuestionId());
        response.setSelectedOption(submitAnswerDTO.getSelectedOption().toUpperCase());
        response.setIsCorrect(isCorrect);
        response.setTimeTaken(submitAnswerDTO.getTimeTaken());
        response.setDifficulty(test.getCurrentDifficulty());
        responseRepository.save(response);

        // Update test statistics
        test.setTotalQuestions(test.getTotalQuestions() + 1);
        if (isCorrect) {
            test.setCorrectAnswers(test.getCorrectAnswers() + 1);
            test.setScore(test.getScore() + getDifficultyPoints(test.getCurrentDifficulty()));
        }

        // Check if test should end
        if (test.getTotalQuestions() >= MAX_QUESTIONS) {
            test.setEndTime(LocalDateTime.now());
            testRepository.save(test);

            TestResponseDTO responseDTO = new TestResponseDTO();
            responseDTO.setTestId(test.getTestId());
            responseDTO.setNextQuestion(null);
            responseDTO.setCurrentDifficulty(test.getCurrentDifficulty());
            responseDTO.setTotalQuestions(test.getTotalQuestions());
            responseDTO.setCorrectAnswers(test.getCorrectAnswers());
            responseDTO.setIsCorrect(isCorrect);
            responseDTO.setTestCompleted(true);

            return responseDTO;
        }

        // Calculate next difficulty using adaptive engine
        Question.Difficulty nextDifficulty = adaptiveDifficultyEngine.getNextDifficulty(test, response);
        test.setCurrentDifficulty(nextDifficulty);
        testRepository.save(test);

        // Get next question
        QuestionDTO nextQuestion = questionService.getRandomQuestionByTopicAndDifficulty(test.getTopic(), nextDifficulty);

        TestResponseDTO responseDTO = new TestResponseDTO();
        responseDTO.setTestId(test.getTestId());
        responseDTO.setNextQuestion(nextQuestion);
        responseDTO.setCurrentDifficulty(nextDifficulty);
        responseDTO.setTotalQuestions(test.getTotalQuestions());
        responseDTO.setCorrectAnswers(test.getCorrectAnswers());
        responseDTO.setIsCorrect(isCorrect);
        
        // If no more questions found for this topic/difficulty, end the test
        if (nextQuestion == null) {
            test.setEndTime(LocalDateTime.now());
            testRepository.save(test);
            responseDTO.setTestCompleted(true);
        } else {
            responseDTO.setTestCompleted(false);
        }

        return responseDTO;
    }

    public Test getTestById(String testId) {
        return testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }

    public List<Test> getUserTests(String userId) {
        return testRepository.findByUserIdOrderByStartTimeDesc(userId);
    }

    private int getDifficultyPoints(Question.Difficulty difficulty) {
        switch (difficulty) {
            case EASY:
                return 10;
            case MEDIUM:
                return 20;
            case HARD:
                return 30;
            default:
                return 0;
        }
    }
}
