package com.job.JOB.controller;

import com.job.JOB.dto.ApiResponse;
import com.job.JOB.dto.PerformanceDTO;
import com.job.JOB.service.PerformanceService;
import com.job.JOB.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performance")
@CrossOrigin(origins = "*")
public class PerformanceController {

    @Autowired
    private PerformanceService performanceService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<ApiResponse<PerformanceDTO>> getUserPerformance(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);

            PerformanceDTO performance = performanceService.getUserPerformance(userId);
            return ResponseEntity.ok(ApiResponse.success("Performance data retrieved successfully", performance));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<java.util.List<com.job.JOB.dto.TestHistoryDTO>>> getUserTestHistory(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String userId = jwtUtil.extractUserId(token);

            java.util.List<com.job.JOB.dto.TestHistoryDTO> history = performanceService.getUserTestHistory(userId);
            return ResponseEntity.ok(ApiResponse.success("Test history retrieved successfully", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
