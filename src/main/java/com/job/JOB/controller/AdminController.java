package com.job.JOB.controller;

import com.job.JOB.dto.ApiResponse;
import com.job.JOB.entity.Test;
import com.job.JOB.entity.User;
import com.job.JOB.repository.QuestionRepository;
import com.job.JOB.repository.TestRepository;
import com.job.JOB.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TestRepository testRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalQuestions", questionRepository.count());
            stats.put("totalUsers", userRepository.count());
            stats.put("totalTests", testRepository.count());
            
            // Add some difficulty breakdown
            Map<String, Long> difficultyStats = new HashMap<>();
            difficultyStats.put("EASY", questionRepository.countByDifficulty(com.job.JOB.entity.Question.Difficulty.EASY));
            difficultyStats.put("MEDIUM", questionRepository.countByDifficulty(com.job.JOB.entity.Question.Difficulty.MEDIUM));
            difficultyStats.put("HARD", questionRepository.countByDifficulty(com.job.JOB.entity.Question.Difficulty.HARD));
            stats.put("difficultyBreakdown", difficultyStats);

            return ResponseEntity.ok(ApiResponse.success("Stats fetched successfully", stats));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch stats: " + e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            // Remove passwords before sending
            users.forEach(u -> u.setPassword(null));
            return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/recent-tests")
    public ResponseEntity<ApiResponse<List<Test>>> getRecentTests() {
        try {
            List<Test> tests = testRepository.findAll();
            // Ideally we'd have a findTop10ByOrderByStartTimeDesc method
            // But for now let's just return all and take top 10 if we want
            return ResponseEntity.ok(ApiResponse.success("Recent tests fetched successfully", tests));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to fetch recent tests: " + e.getMessage()));
        }
    }
}
