package com.kiwisoft.jobportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobRequest {

    private Long clientId;

    private String title;

    private String description;

    private Integer vacancyCount;

}