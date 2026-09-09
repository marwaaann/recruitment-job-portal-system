package com.kiwisoft.jobportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateJobRequest {

    private String title;

    private String description;

    private Integer vacancyCount;

}