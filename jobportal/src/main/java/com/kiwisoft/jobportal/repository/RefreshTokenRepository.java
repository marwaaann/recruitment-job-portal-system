package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.RefreshToken;
import com.kiwisoft.jobportal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByToken(String token);

    void deleteByUser(User user);
}