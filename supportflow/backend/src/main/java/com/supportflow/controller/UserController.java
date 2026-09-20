package com.supportflow.controller;

import com.supportflow.dto.ApiResponse;
import com.supportflow.dto.UserResponse;
import com.supportflow.model.entity.Role;
import com.supportflow.model.entity.User;
import com.supportflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse userResponse = toResponse(user);
        return ResponseEntity.ok(ApiResponse.success(userResponse, "User profile retrieved"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users, "Users retrieved"));
    }

    @GetMapping("/agents")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAgents() {
        List<UserResponse> agents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.SUPPORT_AGENT)
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(agents, "Support agents retrieved"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }
}
