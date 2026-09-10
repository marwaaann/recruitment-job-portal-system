package com.kiwisoft.jobportal.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class ChatPresenceListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, AtomicInteger> sessionsByEmail = new ConcurrentHashMap<>();
    private final Map<String, String> emailBySessionId = new ConcurrentHashMap<>();

    @EventListener
    public void onConnect(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String email = null;
        if (event.getUser() != null && event.getUser().getName() != null) {
            email = event.getUser().getName();
        } else if (accessor.getFirstNativeHeader("user") != null) {
            email = accessor.getFirstNativeHeader("user");
        } else if (accessor.getFirstNativeHeader("email") != null) {
            email = accessor.getFirstNativeHeader("email");
        }

        if (email != null && !email.isBlank()) {
            email = email.trim().toLowerCase();
            String sessionId = accessor.getSessionId();
            if (sessionId != null) {
                emailBySessionId.put(sessionId, email);
            }
            registerPresence(email, true);
        }
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String email = null;
        if (event.getUser() != null && event.getUser().getName() != null) {
            email = event.getUser().getName();
        } else if (sessionId != null) {
            email = emailBySessionId.remove(sessionId);
        }

        if (email != null && !email.isBlank()) {
            email = email.trim().toLowerCase();
            registerPresence(email, false);
        }
    }

    public void registerPresence(String email, boolean connected) {
        if (email == null || email.isBlank()) {
            return;
        }

        String normalized = email.trim().toLowerCase();
        AtomicInteger sessions = sessionsByEmail.computeIfAbsent(
                normalized,
                ignored -> new AtomicInteger()
        );

        boolean online;
        if (connected) {
            online = sessions.incrementAndGet() > 0;
        } else {
            online = sessions.updateAndGet(count -> Math.max(0, count - 1)) > 0;
            if (!online) {
                sessionsByEmail.remove(normalized);
            }
        }

        messagingTemplate.convertAndSend(
                "/topic/presence",
                Map.of("email", normalized, "online", online)
        );
    }

    public Map<String, Boolean> getOnlineUsers() {
        Map<String, Boolean> result = new ConcurrentHashMap<>();
        sessionsByEmail.forEach((email, count) -> {
            if (count.get() > 0) {
                result.put(email, true);
            }
        });
        return result;
    }
}

