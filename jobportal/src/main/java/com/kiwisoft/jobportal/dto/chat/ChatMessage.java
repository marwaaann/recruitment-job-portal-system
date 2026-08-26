package com.kiwisoft.jobportal.dto.chat;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    private Long id;

    private String sender;

    private String receiver;

    private String message;

    private LocalDateTime timestamp;

    private boolean delivered;

    private boolean seen;
}