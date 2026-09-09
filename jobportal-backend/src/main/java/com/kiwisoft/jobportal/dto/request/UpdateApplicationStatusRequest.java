package com.kiwisoft.jobportal.dto.request;

import com.kiwisoft.jobportal.enums.ApplicationStatus;
import lombok.*;

@Getter
@Setter

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateApplicationStatusRequest {

    private ApplicationStatus status;

}