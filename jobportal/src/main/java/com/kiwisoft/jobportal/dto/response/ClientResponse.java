package com.kiwisoft.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String company;

    private String address;

    private boolean active;

}