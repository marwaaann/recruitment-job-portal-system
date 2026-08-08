package com.kiwisoft.jobportal.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/profile")
    public String profile(
            Authentication authentication
    ) {

        return authentication.getName();

    }

}