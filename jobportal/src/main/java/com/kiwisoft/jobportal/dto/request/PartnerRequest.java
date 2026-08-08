package com.kiwisoft.jobportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRequest {

    private String companyName;

    private String contactPerson;

    private String email;

    private String password;

    private String phone;

    private String website;

    private String address;

}