package com.kiwisoft.jobportal.controller;

import com.kiwisoft.jobportal.dto.chat.ChatMessage;
import com.kiwisoft.jobportal.entity.ChatMessageEntity;
import com.kiwisoft.jobportal.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import com.kiwisoft.jobportal.dto.chat.ChatUserDTO;
import com.kiwisoft.jobportal.entity.User;
import com.kiwisoft.jobportal.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;

    @MessageMapping("/send")
    public void send(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        chatService.sendMessage(message);
    }

    @PostMapping("/send")
    public void sendViaRest(@RequestBody ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        chatService.sendMessage(message);
    }

    @GetMapping("/conversation")
    public List<ChatMessageEntity> getConversation(
            @RequestParam String user1,
            @RequestParam String user2
    ) {
        return chatService.getConversation(user1, user2);
    }

    @PutMapping("/conversation/seen")
    public void markConversationAsSeen(
            @RequestParam String sender,
            @RequestParam String receiver
    ) {

        chatService.markMessagesAsSeen(
                sender,
                receiver
        );
    }
    @PutMapping("/conversation/delivered")
    public void markConversationAsDelivered(
            @RequestParam String sender,
            @RequestParam String receiver
    ) {

        chatService.markMessagesAsDelivered(
                sender,
                receiver
        );
    }

    @GetMapping("/users")
    public List<ChatUserDTO> getChatUsers() {

        return userRepository.findByActiveTrue()
                .stream()
                .map(user -> ChatUserDTO.builder()
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .active(user.isActive())
                        .build())
                .toList();
    }



}