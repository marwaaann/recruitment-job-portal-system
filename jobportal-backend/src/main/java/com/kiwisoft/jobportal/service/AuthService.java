package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.LoginRequest;
import com.kiwisoft.jobportal.dto.request.RegisterRequest;
import com.kiwisoft.jobportal.dto.request.LogoutRequest;
import com.kiwisoft.jobportal.dto.request.ForgotPasswordRequest;
import com.kiwisoft.jobportal.dto.request.ResetPasswordRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.kiwisoft.jobportal.dto.response.AuthResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(
            LoginRequest request,
            HttpServletResponse response
    );

    AuthResponse refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    );

    AuthResponse logout(
            LogoutRequest request,
            HttpServletResponse response
    );

    AuthResponse forgotPassword(ForgotPasswordRequest request);

    AuthResponse resetPassword(ResetPasswordRequest request);

}