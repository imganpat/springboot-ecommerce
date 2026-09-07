package com.example.ecommerce_api.controller;

import com.example.ecommerce_api.entity.User;
import com.example.ecommerce_api.service.AuthService;
import com.example.ecommerce_api.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.fasterxml.jackson.annotation.JsonProperty;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, JwtService jwtService) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody AuthRequest request) {
        if (isBlank(request.name()) || isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest().body("Name, email, and password are required");
        }

        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(
                    authService.register(request.name(), request.email(), request.password(), request.admin())));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(exception.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody AuthRequest request) {
        if (isBlank(request.email()) || isBlank(request.password())) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        try {
            User user = authService.login(request.email(), request.password());
            return ResponseEntity.ok(toLoginResponse(user));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
        }
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.isAdmin());
    }

    private LoginResponse toLoginResponse(User user) {
        return new LoginResponse(user.getId(), user.getName(), user.getEmail(), user.isAdmin(),
                jwtService.generateToken(user));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public record AuthRequest(String name, String email, String password,
            @JsonProperty("admin") boolean admin) {
    }

    public record UserResponse(Long id, String name, String email, boolean admin) {
    }

    public record LoginResponse(Long id, String name, String email, boolean admin, String token) {
    }
}