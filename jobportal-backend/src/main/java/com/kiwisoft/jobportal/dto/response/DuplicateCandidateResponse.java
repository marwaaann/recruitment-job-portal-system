package com.kiwisoft.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DuplicateCandidateResponse {

    private boolean duplicate;

    private Long candidateId;

    private String message;

}