package com.kiwisoft.jobportal.dto.response;

import com.kiwisoft.jobportal.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

@Data
@Builder
public class JobApplicationResponse {

    private Long id;

    private Long jobId;

    private Long partnerId;

    private String candidateName;

    private Long candidateId;

    private String email;

    private String phone;

    private Integer experience;

    private String resumeUrl;

    private ApplicationStatus status;

    private Long createdBy;

    private LocalDateTime createdAt;

}