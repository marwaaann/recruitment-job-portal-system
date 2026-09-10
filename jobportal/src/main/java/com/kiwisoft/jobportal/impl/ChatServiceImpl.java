package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.chat.ChatMessage;
import com.kiwisoft.jobportal.entity.ChatMessageEntity;
import com.kiwisoft.jobportal.repository.ChatMessageRepository;
import com.kiwisoft.jobportal.service.ChatService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatServiceImpl implements ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;

    public ChatServiceImpl(
            SimpMessagingTemplate messagingTemplate,
            ChatMessageRepository chatMessageRepository
    ) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public void sendMessage(ChatMessage message) {

        String sender = message.getSender() != null ? message.getSender().trim().toLowerCase() : "";
        String receiver = message.getReceiver() != null ? message.getReceiver().trim().toLowerCase() : "";

        message.setSender(sender);
        message.setReceiver(receiver);

        // Save to PostgreSQL
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .message(message.getMessage())
                .sentAt(message.getTimestamp() != null ? message.getTimestamp() : java.time.LocalDateTime.now())
                .delivered(false)
                .seen(false)
                .build();

        ChatMessageEntity saved = chatMessageRepository.save(entity);

        // Update DTO with DB values
        message.setId(saved.getId());
        message.setTimestamp(saved.getSentAt());
        message.setDelivered(saved.isDelivered());
        message.setSeen(saved.isSeen());

        // Send to receiver
        messagingTemplate.convertAndSend(
                "/topic/messages/" + receiver,
                message
        );

        // Send to sender (so sender sees own message instantly, only if not same recipient)
        if (!receiver.equalsIgnoreCase(sender)) {
            messagingTemplate.convertAndSend(
                    "/topic/messages/" + sender,
                    message
            );
        }
    }

    @Override
    public java.util.List<ChatMessageEntity> getConversation(String user1, String user2) {
        String u1 = user1 != null ? user1.trim().toLowerCase() : "";
        String u2 = user2 != null ? user2.trim().toLowerCase() : "";
        return chatMessageRepository
                .findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(
                        u1, u2,
                        u2, u1
                );
    }


    @Override
    @Transactional
    public void markMessagesAsSeen(
            String sender,
            String receiver
    ) {
        String s = sender != null ? sender.trim().toLowerCase() : "";
        String r = receiver != null ? receiver.trim().toLowerCase() : "";

        java.util.List<ChatMessageEntity> messages =
                chatMessageRepository.findBySenderAndReceiverAndSeenFalse(
                        s,
                        r
                );

        messages.forEach(message -> message.setSeen(true));
        chatMessageRepository.saveAll(messages);

        messages.forEach(message -> messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getSender(),
                toMessage(message)
        ));
    }

    @Override
    @Transactional
    public void markMessagesAsDelivered(
            String sender,
            String receiver
    ) {
        String s = sender != null ? sender.trim().toLowerCase() : "";
        String r = receiver != null ? receiver.trim().toLowerCase() : "";

        java.util.List<ChatMessageEntity> messages =
                chatMessageRepository.findBySenderAndReceiverAndDeliveredFalse(
                        s,
                        r
                );

        messages.forEach(message -> message.setDelivered(true));

        chatMessageRepository.saveAll(messages);

        messages.forEach(message -> messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getSender(),
                toMessage(message)
        ));
    }

        private ChatMessage toMessage(ChatMessageEntity entity) {
                return ChatMessage.builder()
                                .id(entity.getId())
                                .sender(entity.getSender())
                                .receiver(entity.getReceiver())
                                .message(entity.getMessage())
                                .timestamp(entity.getSentAt())
                                .delivered(entity.isDelivered())
                                .seen(entity.isSeen())
                                .build();
        }

}