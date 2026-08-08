package com.kiwisoft.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateDocumentResponse {

    private Long id;

    private String fileName;

    private String documentType;

    private String fileUrl;

}