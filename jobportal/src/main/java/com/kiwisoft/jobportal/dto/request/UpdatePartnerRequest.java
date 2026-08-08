package com.kiwisoft.jobportal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePartnerRequest {

    @NotBlank(message = "Company Name is required")
    private String companyName;

    @NotBlank(message = "Contact Person is required")
    private String contactPerson;

    @Email(message = "Invalid Email")
    private String email;

    private String phone;

    private String website;

    private String address;
}