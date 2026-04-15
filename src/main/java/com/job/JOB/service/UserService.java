package com.job.JOB.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.job.JOB.dto.UserDTO;
import com.job.JOB.entity.User;
import com.job.JOB.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserDTO(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    public UserDTO updateProfile(String userId, com.job.JOB.dto.UpdateProfileDTO updateProfileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updateProfileDTO.getName() != null && !updateProfileDTO.getName().trim().isEmpty()) {
            user.setName(updateProfileDTO.getName());
        }
        
        // Handle password update: encode before saving
        if (updateProfileDTO.getPassword() != null && !updateProfileDTO.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateProfileDTO.getPassword()));
        }

        user = userRepository.save(user);
        return new UserDTO(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }
}
