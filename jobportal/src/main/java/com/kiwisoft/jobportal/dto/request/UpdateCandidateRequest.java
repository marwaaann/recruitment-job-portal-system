package com.kiwisoft.jobportal.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCandidateRequest {

    private String passportNumber;

    private String phoneNormalized;

    private String email;

    private String fullName;

    private LocalDate dob;

    private String nationality;

    private String experience;

    private String education;

    private String customFields;

}