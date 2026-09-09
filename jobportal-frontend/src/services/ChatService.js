import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

let isConnected = false;

// Messages waiting while WebSocket is connecting
let pendingMessages = [];

// Callback for connection status
let connectionStatusCallback = null;
let messageSubscription = null;

export const connect = (
  currentUserEmail,
  onMessageReceived,
  onConnectionChange,
  onPresenceReceived
) => {
  // Prevent creating multiple connections
  if (stompClient) {
    console.log("WebSocket already exists");
    return;
  }

  connectionStatusCallback = onConnectionChange;

  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws-chat"),

    reconnectDelay: 5000,

    onConnect: () => {
      console.log(
        "✅ Connected to WebSocket as:",
        currentUserEmail
      );

      isConnected = true;

      if (connectionStatusCallback) {
        connectionStatusCallback(true);
      }

      /*
       * Subscribe to this user's messages
       */
      if (!messageSubscription) {
        messageSubscription = stompClient.subscribe(
        `/topic/messages/${currentUserEmail}`,
        (message) => {
          try {
            const body = JSON.parse(message.body);

            console.log(
              "📩 WebSocket received:",
              body
            );

            onMessageReceived(body);
          } catch (error) {
            console.error(
              "Failed to parse WebSocket message:",
              error
            );
          }
        }
        );
      }

      if (onPresenceReceived && !stompClient.presenceSubscription) {
        stompClient.presenceSubscription = stompClient.subscribe(
          "/topic/presence",
          (message) => {
            try {
              onPresenceReceived(JSON.parse(message.body));
            } catch (error) {
              console.error("Failed to parse presence message:", error);
            }
          }
        );

        stompClient.presenceSnapshotSubscription = stompClient.subscribe(
          "/user/queue/presence",
          (message) => {
            try {
              onPresenceReceived(JSON.parse(message.body));
            } catch (error) {
              console.error("Failed to parse presence snapshot:", error);
            }
          }
        );
      }

      /*
       * Send any messages that were waiting
       */
      if (pendingMessages.length > 0) {
        console.log(
          "📤 Sending queued messages:",
          pendingMessages.length
        );

        pendingMessages.forEach((msg) => {
          stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify(msg),
          });
        });

        pendingMessages = [];
      }
    },

    onDisconnect: () => {
      console.log("❌ WebSocket disconnected");

      isConnected = false;

      if (connectionStatusCallback) {
        connectionStatusCallback(false);
      }
    },

    onWebSocketClose: () => {
      console.log("⚠️ WebSocket connection closed");

      isConnected = false;

      if (connectionStatusCallback) {
        connectionStatusCallback(false);
      }
    },

    onStompError: (frame) => {
      console.error(
        "❌ STOMP error:",
        frame
      );
    },

    onWebSocketError: (error) => {
      console.error(
        "❌ WebSocket error:",
        error
      );
    },
  });

  stompClient.activate();
};


/*
 * Send message
 */
export const sendMessage = (message) => {

  /*
   * If connected → send immediately
   */
  if (
    stompClient &&
    stompClient.connected &&
    isConnected
  ) {
    console.log(
      "📤 Sending immediately:",
      message
    );

    stompClient.publish({
      destination: "/app/send",
      body: JSON.stringify(message),
    });

    return;
  }

  /*
   * If not connected → queue it
   */
  console.log(
    "⏳ WebSocket not connected. Queueing message:",
    message
  );

  pendingMessages.push(message);
};


/*
 * Check connection
 */
export const getConnectionStatus = () => {
  return isConnected;
};


/*
 * Disconnect
 */
export const disconnect = () => {

  if (stompClient) {
    console.log(
      "🔌 Disconnecting WebSocket"
    );

    stompClient.deactivate();

    stompClient = null;
  }

  messageSubscription = null;

  isConnected = false;

  pendingMessages = [];

  connectionStatusCallback = null;
};