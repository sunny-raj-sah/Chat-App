import ConversationItem from "./ConversationItem";

const ConversationList = ({
  conversations,
  currentUser,
  activeConversation,
  onSelect,
}) => {
  if (!conversations.length) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center text-center px-4 py-5">
        <div>
          <div className="cw-empty-badge" style={{ width: "64px", height: "64px" }}>
            <i className="bi bi-chat-left-text fs-4"></i>
          </div>

          <p className="mt-3 mb-1 fw-semibold cw-display">
            No conversations yet
          </p>

          <small className="text-muted">
            Search for a user to start chatting.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation._id}
          conversation={conversation}
          currentUser={currentUser}
          active={activeConversation?._id === conversation._id}
          onClick={() => onSelect(conversation)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
