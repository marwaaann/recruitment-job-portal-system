package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.repository.RefreshTokenRepository;
import com.kiwisoft.jobportal.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.kiwisoft.jobportal.dto.response.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;

import com.kiwisoft.jobportal.dto.request.UpdateUserRequest;
import com.kiwisoft.jobportal.dto.response.UserResponse;
import com.kiwisoft.jobportal.exception.BadRequestException;

import com.kiwisoft.jobportal.dto.request.UserRequest;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {

        return userRepository.findByActiveTrue();
    }

    @Override
    public User getUserById(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        if (!user.isActive()) {
            throw new ResourceNotFoundException("User Not Found");
        }

        return user;
    }

    @Override
    public UserResponse createUser(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .loggedOut(false)
                .build();

        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .message("User Created Successfully")
                .build();
    }


    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {

            throw new BadRequestException("Email already exists");
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        userRepository.save(user);

        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .message("User Updated Successfully")
                .build();
    }


    @Override
    public void deleteUser(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        user.setActive(false);

        userRepository.save(user);

        refreshTokenRepository.deleteByUser(user);
    }


    @Override
    public void activateUser(Long id) {

        User user = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User Not Found"));

        user.setActive(true);

        userRepository.save(user);
    }




    @Override
    public UserProfileResponse getProfile(
            String email
    ) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User not found"
                                )
                        );

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .active(user.isActive())
                .build();
    }
}