package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository
        extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailOrderByIdDesc(String email);

    Optional<PasswordResetOtp> findByEmailAndOtp(
            String email,
            String otp
    );

}