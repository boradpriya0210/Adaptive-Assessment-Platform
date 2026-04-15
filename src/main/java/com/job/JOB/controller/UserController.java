package com.job.JOB.controller;

import com.job.JOB.dto.ApiResponse;
import com.job.JOB.dto.UserDTO;
import com.job.JOB.service.UserService;
import com.job.JOB.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(HttpServletRequest request) {
        try {
            String token = extractToken(request);
            String userId = jwtUtil.extractUserId(token);
            UserDTO userDTO = userService.getProfile(userId);
            return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", userDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(HttpServletRequest request,
            @Valid @RequestBody com.job.JOB.dto.UpdateProfileDTO updateProfileDTO) {
        try {
            String token = extractToken(request);
            String userId = jwtUtil.extractUserId(token);
            UserDTO updatedUser = userService.updateProfile(userId, updateProfileDTO);
            return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new RuntimeException("No token found");
    }
}
