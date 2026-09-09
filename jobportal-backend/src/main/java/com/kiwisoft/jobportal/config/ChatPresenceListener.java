package com.kiwisoft.jobportal.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
@RequiredArgsConstructor
public class ChatPresenceListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, AtomicInteger> sessionsByEmail = new ConcurrentHashMap<>();

    @EventListener
    public void onConnect(SessionConnectEvent event) {
        if (event.getUser() != null) {
            sessionsByEmail.forEach((email, sessions) -> {
                if (sessions.get() > 0) {
                    messagingTemplate.convertAndSendToUser(
                            event.getUser().getName(),
                            "/queue/presence",
                            Map.of("email", email, "online", true)
                    );
                }
            });
        }

        publishPresence(event.getUser(), true);
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        publishPresence(event.getUser(), false);
    }

    private void publishPresence(Principal principal, boolean connected) {
        if (principal == null || principal.getName() == null) {
            return;
        }

        String email = principal.getName();
        AtomicInteger sessions = sessionsByEmail.computeIfAbsent(
                email,
                ignored -> new AtomicInteger()
        );

        boolean online;
        if (connected) {
            online = sessions.incrementAndGet() > 0;
        } else {
            online = sessions.updateAndGet(count -> Math.max(0, count - 1)) > 0;
            if (!online) {
                sessionsByEmail.remove(email, sessions);
            }
        }

        messagingTemplate.convertAndSend(
                "/topic/presence",
                Map.of("email", email, "online", online)
        );
    }
}
