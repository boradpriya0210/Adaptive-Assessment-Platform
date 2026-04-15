package com.job.JOB.service;

import com.job.JOB.dto.LoginDTO;
import com.job.JOB.dto.LoginResponseDTO;
import com.job.JOB.dto.UserDTO;
import com.job.JOB.entity.User;
import com.job.JOB.repository.UserRepository;
import com.job.JOB.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public UserDTO register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : User.Role.USER);

        user = userRepository.save(user);

        return new UserDTO(user.getUserId(), user.getName(), user.getEmail(), user.getRole());
    }

    public LoginResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId(), user.getRole().name());
        UserDTO userDTO = new UserDTO(user.getUserId(), user.getName(), user.getEmail(), user.getRole());

        return new LoginResponseDTO(token, userDTO);
    }

    public boolean validateToken(String token) {
        try {
            String username = jwtUtil.extractUsername(token);
            return jwtUtil.validateToken(token, username);
        } catch (Exception e) {
            return false;
        }
    }
}
