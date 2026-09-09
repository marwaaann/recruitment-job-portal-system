package com.kiwisoft.jobportal.repository;

import com.kiwisoft.jobportal.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {

    List<ChatMessageEntity> findBySenderAndReceiverOrReceiverAndSenderOrderBySentAtAsc(
            String sender1,
            String receiver1,
            String sender2,
            String receiver2
    );

    List<ChatMessageEntity> findBySenderAndReceiverAndDeliveredFalse(
            String sender,
            String receiver
    );

    List<ChatMessageEntity> findBySenderAndReceiverAndSeenFalse(
            String sender,
            String receiver
    );

    @Modifying
    @Query("""
        UPDATE ChatMessageEntity m
        SET m.seen = true
        WHERE m.sender = :sender
          AND m.receiver = :receiver
          AND m.seen = false
    """)
    void markMessagesAsSeen(
            @Param("sender") String sender,
            @Param("receiver") String receiver
    );
}