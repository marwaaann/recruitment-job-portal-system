package com.kiwisoft.jobportal.service;

import com.kiwisoft.jobportal.dto.chat.ChatMessage;
import com.kiwisoft.jobportal.entity.ChatMessageEntity;

import java.util.List;

public interface ChatService {

    void sendMessage(ChatMessage message);

    java.util.List<ChatMessageEntity> getConversation(String user1, String user2);

    void markMessagesAsSeen(String sender, String receiver);

    void markMessagesAsDelivered(String sender, String receiver);
}