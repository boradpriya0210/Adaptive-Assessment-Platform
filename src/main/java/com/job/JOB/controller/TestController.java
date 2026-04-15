package com.job.JOB.controller;

import com.job.JOB.dto.ApiResponse;
import com.job.JOB.dto.SubmitAnswerDTO;
import com.job.JOB.dto.TestResponseDTO;
import com.job.JOB.service.TestService;
import com.job.JOB.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private TestService testService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/start")
    public ResponseEntity<ApiResponse<TestResponseDTO>> startTest(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody com.job.JOB.dto.StartTestRequestDTO requestDTO) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);

            TestResponseDTO response = testService.startTest(userId, requestDTO);
            return ResponseEntity.ok(ApiResponse.success("Test started successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/submit-answer")
    public ResponseEntity<ApiResponse<TestResponseDTO>> submitAnswer(
            @Valid @RequestBody SubmitAnswerDTO submitAnswerDTO) {
        try {
            TestResponseDTO response = testService.submitAnswer(submitAnswerDTO);
            return ResponseEntity.ok(ApiResponse.success("Answer submitted successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
