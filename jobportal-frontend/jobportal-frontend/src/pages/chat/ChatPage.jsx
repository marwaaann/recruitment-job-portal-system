import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/ws-chat/websocket",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("Connected");

        client.subscribe("/topic/messages", (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
        });
      },

      onStompError: (frame) => {
        console.error(frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => client.deactivate();
  }, []);

  const sendMessage = () => {
    if (!text.trim() || !stompClient) return;

    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({
        sender: "admin@jobportal.com",
        receiver: "client@gmail.com",
        message: text,
      }),
    });

    setText("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Real-Time Chat</h1>

      <div className="border rounded-lg h-96 overflow-y-auto p-4 bg-white mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{msg.sender}: </span>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
          placeholder="Type a message..."
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}