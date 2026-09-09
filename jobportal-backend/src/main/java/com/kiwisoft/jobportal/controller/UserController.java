package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.service.UserService;

import com.kiwisoft.jobportal.dto.request.UserRequest;
import com.kiwisoft.jobportal.dto.request.UpdateUserRequest;

import com.kiwisoft.jobportal.dto.response.UserResponse;
import com.kiwisoft.jobportal.dto.response.UserProfileResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.security.Principal;
import java.util.List;
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @GetMapping("/{id}")
    public User getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PostMapping
    public UserResponse createUser(
            @Valid
            @RequestBody UserRequest request) {

        return userService.createUser(request);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @PutMapping("/{id}")
    public UserResponse updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        return userService.updateUser(id, request);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id) {

        userService.deleteUser(id);

        return "User Deleted Successfully";
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/{id}/activate")
    public String activateUser(
            @PathVariable Long id) {

        userService.activateUser(id);

        return "User Activated Successfully";
    }

    @GetMapping("/profile")
    public UserProfileResponse profile(
            Principal principal
    ) {

        return userService.getProfile(
                principal.getName()
        );
    }
}