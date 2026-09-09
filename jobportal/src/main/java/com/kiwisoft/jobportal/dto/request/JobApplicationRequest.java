package com.kiwisoft.jobportal.dto.request;

import lombok.*;

@Getter
@Setter

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobApplicationRequest {

    private String candidateName;
    private Long candidateId;

    private Long jobId;

    private String email;

    private String phone;

    private Integer experience;

    private String resumeUrl;

}