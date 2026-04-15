package com.job.JOB.controller;

import com.job.JOB.dto.ApiResponse;
import com.job.JOB.dto.ResultDTO;
import com.job.JOB.service.PerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/result")
@CrossOrigin(origins = "*")
public class ResultController {

    @Autowired
    private PerformanceService performanceService;

    @GetMapping("/{testId}")
    public ResponseEntity<ApiResponse<ResultDTO>> getTestResult(@PathVariable String testId) {
        try {
            ResultDTO result = performanceService.getTestResult(testId);
            return ResponseEntity.ok(ApiResponse.success("Result retrieved successfully", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
