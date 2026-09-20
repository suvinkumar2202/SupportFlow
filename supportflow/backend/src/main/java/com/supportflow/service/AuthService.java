package com.supportflow.service;

import com.supportflow.dto.LoginRequest;
import com.supportflow.dto.LoginResponse;
import com.supportflow.dto.RegisterRequest;
import com.supportflow.model.entity.Role;
import com.supportflow.model.entity.User;
import com.supportflow.repository.UserRepository;
import com.supportflow.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return LoginResponse.success(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                "Login successful"
        );
    }

    public LoginResponse register(RegisterRequest request) {
        // Check for existing email to give a clean 409-style failure
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email address is already in use");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getName(),
                request.getEmail(),
                hashedPassword,
                Role.CUSTOMER
        );

        User saved;
        try {
            saved = userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalArgumentException("Email address is already in use");
        }

        String token = jwtService.generateToken(saved.getEmail(), saved.getRole().name());

        return LoginResponse.success(
                token,
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                saved.getRole().name(),
                "Registration successful"
        );
    }
}
