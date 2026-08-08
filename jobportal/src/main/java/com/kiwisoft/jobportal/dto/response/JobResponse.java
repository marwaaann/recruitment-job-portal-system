package com.kiwisoft.jobportal.dto.response;

import com.kiwisoft.jobportal.enums.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobResponse {

    private Long id;

    private Long clientId;

    private String title;

    private String description;

    private Integer vacancyCount;

    private JobStatus status;

    private Long createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

}