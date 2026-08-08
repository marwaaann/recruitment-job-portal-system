package com.kiwisoft.jobportal.dto.response;

import com.kiwisoft.jobportal.enums.CandidateStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateResponse {

    private Long id;

    private String passportNumber;

    private String phoneNormalized;

    private String email;

    private String fullName;

    private LocalDate dob;

    private String nationality;

    private String experience;

    private String education;

    private String customFields;

    private CandidateStatus canonicalStatus;

    private Long createdByUserId;

    private Long createdByPartnerId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}