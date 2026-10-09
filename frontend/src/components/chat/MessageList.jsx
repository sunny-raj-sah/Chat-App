 
import { useEffect, useRef } from "react";

import Message from "./Message";

const MessageList = ({ messages, currentUser, loading, onDelete }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="cw-message-pane flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center gap-2 text-muted">
          <span
            className="spinner-border spinner-border-sm"
            style={{ color: "var(--cw-primary)" }}
            role="status"
          />
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="cw-message-pane cw-scroll flex-grow-1 overflow-auto px-2 px-md-3 py-3">
      {messages.length === 0 ? (
        <div className="h-100 d-flex align-items-center justify-content-center text-center px-3">
          <div>
            <div className="cw-empty-badge">
              <i className="bi bi-chat-heart fs-3"></i>
            </div>

            <h5 className="mt-3 mb-2 fw-semibold cw-display">
              No messages yet
            </h5>

            <p className="text-muted mb-0">
              Send a message to start the conversation.
            </p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <Message
            key={message._id}
            message={message}
            currentUser={currentUser}
            onDelete={onDelete}
          />
        ))
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
