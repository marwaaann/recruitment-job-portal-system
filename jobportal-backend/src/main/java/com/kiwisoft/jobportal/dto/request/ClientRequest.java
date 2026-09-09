package com.kiwisoft.jobportal.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {

    private String fullName;

    private String email;

    private String password;

    private String phone;

    private String company;

    private String address;

}