package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.LoginRequest;

import com.kiwisoft.jobportal.dto.request.RegisterRequest;
import com.kiwisoft.jobportal.dto.response.AuthResponse;
import com.kiwisoft.jobportal.entity.RefreshToken;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.enums.Role;
import com.kiwisoft.jobportal.repository.RefreshTokenRepository;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.security.CookieUtil;
import com.kiwisoft.jobportal.security.JwtUtil;
import com.kiwisoft.jobportal.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.kiwisoft.jobportal.dto.request.LogoutRequest;
import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;
import com.kiwisoft.jobportal.exception.BadRequestException;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.exception.UnauthorizedException;
import java.util.Random;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import com.kiwisoft.jobportal.dto.request.ForgotPasswordRequest;
import com.kiwisoft.jobportal.entity.PasswordResetOtp;
import com.kiwisoft.jobportal.repository.PasswordResetOtpRepository;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import jakarta.servlet.http.HttpServletResponse;
import com.kiwisoft.jobportal.dto.request.ResetPasswordRequest;
import com.kiwisoft.jobportal.entity.PasswordResetOtp;
import com.kiwisoft.jobportal.exception.BadRequestException;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetOtpRepository passwordResetOtpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CLIENT)
                .active(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .message("User Registered Successfully")
                .build();
    }

    @Override
    public AuthResponse login(
            LoginRequest request,
            HttpServletResponse response
    ) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid Email"));

        if (!user.isActive()) {
            throw new UnauthorizedException("User account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid Password");
        }

        user.setLoggedOut(false);
        userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);
        cookieUtil.createAccessTokenCookie(response, accessToken);
        cookieUtil.createRefreshTokenCookie(response, refreshToken);

// Save refresh token in DB
        RefreshToken refreshTokenEntity =
                RefreshToken.builder()
                        .token(refreshToken)
                        .expiryDate(LocalDateTime.now().plusDays(7))
                        .revoked(false)
                        .user(user)
                        .build();

        refreshTokenRepository.save(refreshTokenEntity);

        return AuthResponse.builder()
                .message("Login Successful")
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Override
    public AuthResponse refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        String refreshToken = null;

        if (request.getCookies() != null) {

            for (Cookie cookie : request.getCookies()) {

                if ("refreshToken".equals(cookie.getName())) {

                    refreshToken = cookie.getValue();
                    break;
                }

            }

        }

        if (refreshToken == null) {
            throw new UnauthorizedException("Refresh Token Missing");
        }




        RefreshToken storedToken = refreshTokenRepository
                .findByToken(refreshToken)
                .orElseThrow(() -> new ResourceNotFoundException("Refresh Token Not Found"));

        if (storedToken.getRevoked()) {
            throw new UnauthorizedException("Refresh Token Revoked");
        }

        if (storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh Token Expired");
        }

        User user = storedToken.getUser();

        String newAccessToken = jwtUtil.generateAccessToken(user);

        cookieUtil.createAccessTokenCookie(
                response,
                newAccessToken
        );

        return AuthResponse.builder()
                .message("Token Refreshed Successfully")
                .build();
    }

    @Override
    @Transactional
    public AuthResponse logout(
            LogoutRequest request,
            HttpServletResponse response
    ) {

        if (!jwtUtil.validateToken(request.getAccessToken())) {
            throw new UnauthorizedException("Invalid Access Token");
        }

        Long userId = jwtUtil.extractUserId(request.getAccessToken());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));

        user.setLoggedOut(true);
        userRepository.save(user);

// Delete Refresh Token from DB
        refreshTokenRepository.deleteByUser(user);

// Clear Browser Cookies
        cookieUtil.clearAccessTokenCookie(response);
        cookieUtil.clearRefreshTokenCookie(response);

        return AuthResponse.builder()
                .message("Logout Successful")
                .build();
    }


    @Override
    public AuthResponse forgotPassword(ForgotPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Email not found"));

        String otp = String.format("%06d",
                new Random().nextInt(999999));

        PasswordResetOtp passwordResetOtp =
                PasswordResetOtp.builder()
                        .email(user.getEmail())
                        .otp(otp)
                        .expiryTime(LocalDateTime.now().plusMinutes(5))
                        .verified(false)
                        .build();

        passwordResetOtpRepository.save(passwordResetOtp);

        System.out.println("==================================");
        System.out.println("OTP : " + otp);
        System.out.println("EMAIL : " + user.getEmail());
        System.out.println("==================================");

        return AuthResponse.builder()
                .message("OTP Generated Successfully")
                .build();
    }


    @Override
    public AuthResponse resetPassword(ResetPasswordRequest request) {

        PasswordResetOtp otp = passwordResetOtpRepository
                .findByEmailAndOtp(
                        request.getEmail(),
                        request.getOtp()

                )
                .orElseThrow(() ->
                        new BadRequestException("Invalid OTP"));

        if (otp.isVerified()) {
            throw new BadRequestException("OTP Already Used");
        }

        if (otp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("OTP Expired");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        otp.setVerified(true);

        passwordResetOtpRepository.save(otp);

        return AuthResponse.builder()
                .message("Password Reset Successful")
                .build();
    }
}