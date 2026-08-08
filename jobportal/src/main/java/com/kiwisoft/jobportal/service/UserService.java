package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.dto.response.UserProfileResponse;
import com.kiwisoft.jobportal.dto.request.UserRequest;
import com.kiwisoft.jobportal.dto.response.UserResponse;
import com.kiwisoft.jobportal.dto.request.UpdateUserRequest;
import java.util.List;

public interface UserService {
    UserProfileResponse getProfile(String email);

    List<User> getAllUsers();


    User getUserById(Long id);
    UserResponse createUser(UserRequest request);

    UserResponse updateUser(Long id, UpdateUserRequest request);


    void deleteUser(Long id);
    void activateUser(Long id);
}