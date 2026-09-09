package com.kiwisoft.jobportal.impl;

import com.kiwisoft.jobportal.dto.chat.ChatMessage;
import com.kiwisoft.jobportal.entity.ChatMessageEntity;
import com.kiwisoft.jobportal.repository.ChatMessageRepository;
import com.kiwisoft.jobportal.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;

    @Override
    public void sendMessage(ChatMessage message) {

        // Save to PostgreSQL
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .sender(message.getSender())
                .receiver(message.getReceiver())
                .message(message.getMessage())
                .sentAt(message.getTimestamp())
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
                "/topic/messages/" + message.getReceiver(),
                message
        );

        // Send to sender (so sender sees own message instantly)
        messagingTemplate.convertAndSend(
                "/topic/messages/" + message.getSender(),
                message
        );
    }

    @Override
    public List<ChatMessageEntity> getConversation(String user1, String user2) {
        return chatMessageRepository
                .findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(
                        user1, user2,
                        user2, user1
                );
    }


    @Override
    @Transactional
    public void markMessagesAsSeen(
            String sender,
            String receiver
    ) {
        List<ChatMessageEntity> messages =
                chatMessageRepository.findBySenderAndReceiverAndSeenFalse(
                        sender,
                        receiver
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

        List<ChatMessageEntity> messages =
                chatMessageRepository.findBySenderAndReceiverAndDeliveredFalse(
                        sender,
                        receiver
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