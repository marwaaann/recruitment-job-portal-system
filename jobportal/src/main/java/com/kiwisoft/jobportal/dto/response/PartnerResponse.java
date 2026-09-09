package com.kiwisoft.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerResponse {

    private Long id;

    private String companyName;

    private String contactPerson;

    private String email;

    private String phone;

    private String website;

    private String address;

    private boolean active;

}