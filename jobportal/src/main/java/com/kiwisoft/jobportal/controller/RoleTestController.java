package com.kiwisoft.jobportal.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleTestController {

    @GetMapping("/super-admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public String superAdmin() {

        return "Welcome Super Admin";

    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin() {

        return "Welcome Admin";

    }

    @GetMapping("/partner")
    @PreAuthorize("hasRole('PARTNER')")
    public String partner() {

        return "Welcome Partner";

    }

    @GetMapping("/client")
    @PreAuthorize("hasRole('CLIENT')")
    public String client() {

        return "Welcome Client";

    }
}