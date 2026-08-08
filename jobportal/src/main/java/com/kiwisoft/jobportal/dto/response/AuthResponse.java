package com.kiwisoft.jobportal.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kiwisoft.jobportal.enums.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String accessToken;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String refreshToken;

    private String message;

    // Logged-in User Details
    private Long id;

    private String fullName;

    private String email;

    private Role role;

}