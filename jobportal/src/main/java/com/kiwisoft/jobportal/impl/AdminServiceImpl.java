package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.request.AdminRequest;
import com.kiwisoft.jobportal.dto.response.AdminResponse;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.enums.Role;
import com.kiwisoft.jobportal.exception.ForbiddenException;
import com.kiwisoft.jobportal.exception.ResourceNotFoundException;
import com.kiwisoft.jobportal.exception.UnauthorizedException;
import com.kiwisoft.jobportal.repository.UserRepository;
import com.kiwisoft.jobportal.service.AdminService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import com.kiwisoft.jobportal.dto.request.ChangePasswordRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminResponse createAdmin(
            AdminRequest request
    ) {

        User admin = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ADMIN)
                .active(true)
                .build();

        User savedAdmin = userRepository.save(admin);

        return mapToResponse(savedAdmin);

    }

    @Override
    public List<AdminResponse> getAllAdmins() {

        return userRepository.findAll()
                .stream()
                .filter(
                        user -> user.getRole() == Role.ADMIN
                )
                .map(this::mapToResponse)
                .toList();

    }

    @Override
    public AdminResponse getProfile() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User Not Found"
                                )
                        );

        return mapToResponse(user);

    }

    @Override
    public AdminResponse getAdminById(
            Long id
    ) {

        User admin =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Admin Not Found"
                                )
                        );
        if (admin.getRole() != Role.ADMIN) {

            throw new ForbiddenException(
                    "User is not an Admin"
            );
        }
        return mapToResponse(admin);
    }

    @Override
    public AdminResponse updateAdmin(
            Long id,
            AdminRequest request
    ) {

        User admin =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Admin Not Found"
                                )
                        );

        if (admin.getRole() != Role.ADMIN) {

            throw new ForbiddenException(
                    "User is not an Admin"
            );

        }

        admin.setFullName(
                request.getFullName()
        );

        admin.setEmail(
                request.getEmail()
        );

        if (request.getPassword() != null
                && !request.getPassword().isBlank()) {

            admin.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()
                    )
            );

        }
        User updatedAdmin =
                userRepository.save(admin);
        return mapToResponse(updatedAdmin);

    }

    @Override
    public void deleteAdmin(Long id) {

        User admin =
                userRepository.findById(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Admin Not Found"
                                )
                        );

        if (admin.getRole() != Role.ADMIN) {

            throw new ForbiddenException(
                    "User is not an Admin"
            );

        }

        admin.setActive(false);

        userRepository.save(admin);

    }

    @Override
    public void changePassword(
            ChangePasswordRequest request
    ) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "User Not Found"
                                )
                        );
        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword()
        )) {

            throw new UnauthorizedException(
                    "Old Password is Incorrect"
            );

        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

    }

    private AdminResponse mapToResponse(
            User admin
    ) {

        return AdminResponse.builder()
                .id(admin.getId())
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .role(admin.getRole().name())
                .active(admin.isActive())
                .build();
    }



}







