package com.kiwisoft.jobportal.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ChatUserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private boolean active;
}