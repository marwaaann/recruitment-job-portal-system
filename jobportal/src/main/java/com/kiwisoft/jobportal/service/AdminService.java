package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.request.AdminRequest;
import com.kiwisoft.jobportal.dto.request.ChangePasswordRequest;
import com.kiwisoft.jobportal.dto.response.AdminResponse;

import java.util.List;

public interface AdminService {

    AdminResponse createAdmin(AdminRequest request);
    List<AdminResponse> getAllAdmins();

    AdminResponse getAdminById(Long id);
    AdminResponse getProfile();

    AdminResponse updateAdmin(
            Long id,
            AdminRequest request
    );

    void deleteAdmin(Long id);

    void changePassword(ChangePasswordRequest request);
}