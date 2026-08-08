package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.request.AdminRequest;
import com.kiwisoft.jobportal.dto.response.AdminResponse;
import com.kiwisoft.jobportal.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.kiwisoft.jobportal.dto.request.ChangePasswordRequest;
import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping
    public AdminResponse createAdmin(
            @Valid
            @RequestBody AdminRequest request
    ) {

        return adminService.createAdmin(
                request
        );
    }

    @GetMapping
    public List<AdminResponse> getAllAdmins() {

        return adminService.getAllAdmins();
    }

    @GetMapping("/profile")
    public AdminResponse getProfile() {

        return adminService.getProfile();

    }

    @GetMapping("/{id}")
    public AdminResponse getAdminById(
            @PathVariable Long id
    ) {

        return adminService.getAdminById(id);
    }

    @PutMapping("/{id}")
    public AdminResponse updateAdmin(
            @PathVariable Long id,
            @Valid @RequestBody AdminRequest request
    ) {
        return adminService.updateAdmin(id, request);

    }




    @DeleteMapping("/{id}")
    public String deleteAdmin(@PathVariable Long id) {

        System.out.println("DELETE ADMIN API HIT");

        adminService.deleteAdmin(id);

        return "Admin Deleted Successfully";
    }


    @PutMapping("/change-password")
    public String changePassword(
            @Valid
            @RequestBody ChangePasswordRequest request
    ) {

        adminService.changePassword(request);

        return "Password Changed Successfully";
    }
}