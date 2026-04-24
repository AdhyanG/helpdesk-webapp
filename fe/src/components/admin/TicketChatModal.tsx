// src/components/admin/TicketChatModal.tsx

import { useEffect, useState } from "react";
import api from "../../api/config";
import "./TicketChatModal.css";

type Props = {
  ticket: any;
  onClose: () => void;
};

export default function TicketChatModal({
  ticket,
  onClose,
}: Props) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchThread = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `/tickets/${ticket.id}/thread`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to load thread", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticket?.id) {
      fetchThread();
    }
  }, [ticket]);

  const handleSend = async () => {
   if (!message.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await api.post(
        `/tickets/${ticket.id}/message`,
        {
    
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("");
      fetchThread();
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="chat-overlay">
      <div className="chat-modal">

        <div className="chat-header">
          <div>
            <h2>Ticket Conversation</h2>
            <p>{ticket.id}</p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="chat-body">
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages found.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.messageId}
                className={`chat-message ${
                  msg.role === "Admin"
                    ? "admin-msg"
                    : "agent-msg"
                }`}
              >
                <div className="msg-top">
                  <strong>{msg.sender}</strong>
                  <span>{msg.role}</span>
                </div>

                <p>{msg.message}</p>

                <small>
                  {new Date(
                    msg.created_at
                  ).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type reply..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />

          <button onClick={handleSend}>
            Send
          </button>
        </div>

      </div>
    </div>
  );
}