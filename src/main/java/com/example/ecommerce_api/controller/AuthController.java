package com.example.ecommerce_api.controller;

import com.example.ecommerce_api.entity.User;
import com.example.ecommerce_api.service.AuthService;
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

    public AuthController(AuthService authService) {
        this.authService = authService;
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
            return ResponseEntity.ok(toResponse(authService.login(request.email(), request.password())));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exception.getMessage());
        }
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.isAdmin());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    public record AuthRequest(String name, String email, String password,
            @JsonProperty("admin") boolean admin) {
    }

    public record UserResponse(Long id, String name, String email, boolean admin) {
    }
}