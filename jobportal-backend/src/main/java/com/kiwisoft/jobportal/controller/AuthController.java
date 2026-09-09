package com.kiwisoft.jobportal.controller;
import com.kiwisoft.jobportal.dto.request.*;
import com.kiwisoft.jobportal.dto.response.AuthResponse;
import com.kiwisoft.jobportal.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(
            @Valid
            @RequestBody RegisterRequest request){
        return authService
                .register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(
            @Valid
            @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {

        return authService.login(
                request,
                response
        );

    }

    @PostMapping("/refresh")
    public AuthResponse refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        return authService.refreshToken(
                request,
                response
        );

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        return ResponseEntity.ok(
                authService.forgotPassword(request)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(
            @Valid
            @RequestBody ResetPasswordRequest request) {

        return ResponseEntity.ok(
                authService.resetPassword(request)
        );
    }

    @PostMapping("/logout")
    public AuthResponse logout(
            @Valid
            @RequestBody LogoutRequest request,
            HttpServletResponse response
    ) {

        return authService.logout(
                request,
                response
        );

    }




}