package com.job.JOB.service;

import com.job.JOB.dto.QuestionDTO;
import com.job.JOB.entity.Question;
import com.job.JOB.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public QuestionDTO getRandomQuestionByDifficulty(Question.Difficulty difficulty) {
        return getRandomQuestionByTopicAndDifficulty("All", difficulty);
    }

    public QuestionDTO getRandomQuestionByTopicAndDifficulty(String topic, Question.Difficulty difficulty) {
        List<Question> questions;
        if (topic != null && !topic.isEmpty() && !topic.equalsIgnoreCase("All")) {
            questions = questionRepository.findByTopicAndDifficulty(topic, difficulty);
        } else {
            questions = questionRepository.findAllByDifficulty(difficulty);
        }
        
        if (questions == null || questions.isEmpty()) {
            return null;
        }
        // Get random question from list
        int randomIndex = (int) (Math.random() * questions.size());
        Question question = questions.get(randomIndex);
        return convertToDTO(question);
    }

    public List<QuestionDTO> getAllQuestionsByDifficulty(Question.Difficulty difficulty) {
        return questionRepository.findByDifficulty(difficulty)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Question getQuestionById(String questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));
    }

    @Transactional
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Transactional
    public Question updateQuestion(String id, Question questionDetails) {
        Question question = getQuestionById(id);
        
        if (questionDetails.getTopic() != null) question.setTopic(questionDetails.getTopic());
        if (questionDetails.getDifficulty() != null) question.setDifficulty(questionDetails.getDifficulty());
        if (questionDetails.getQuestionText() != null) question.setQuestionText(questionDetails.getQuestionText());
        if (questionDetails.getOptionA() != null) question.setOptionA(questionDetails.getOptionA());
        if (questionDetails.getOptionB() != null) question.setOptionB(questionDetails.getOptionB());
        if (questionDetails.getOptionC() != null) question.setOptionC(questionDetails.getOptionC());
        if (questionDetails.getOptionD() != null) question.setOptionD(questionDetails.getOptionD());
        if (questionDetails.getCorrectAnswer() != null) question.setCorrectAnswer(questionDetails.getCorrectAnswer());
        
        return questionRepository.save(question);
    }

    @Transactional
    public void deleteQuestion(String id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found with ID: " + id);
        }
        questionRepository.deleteById(id);
    }


    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setTopic(question.getTopic());
        dto.setDifficulty(question.getDifficulty());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        // Note: correctAnswer is NOT included in DTO
        return dto;
    }
}
