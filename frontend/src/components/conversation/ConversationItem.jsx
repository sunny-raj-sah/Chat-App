// //  import { useEffect, useState } from "react";

// // import { subscribeToSocket } from "../../services/socket";

// // const ConversationItem = ({ conversation, currentUser, active, onClick }) => {
// //   const [isTyping, setIsTyping] = useState(false);

// //   const otherUser = conversation.participants.find(
// //     (user) => String(user._id) !== String(currentUser._id)
// //   );

// //   // --------------------------------
// //   // Listen for typing events
// //   // --------------------------------

// //   useEffect(() => {
// //     const handleSocket = (socket) => {
// //       const handleTypingStart = ({ conversationId, userId }) => {
// //         // Only show typing for this conversation
// //         if (conversationId !== conversation._id) {
// //           return;
// //         }

// //         // Don't show our own typing
// //         if (String(userId) === String(currentUser._id)) {
// //           return;
// //         }

// //         setIsTyping(true);
// //       };

// //       const handleTypingStop = ({ conversationId, userId }) => {
// //         if (conversationId !== conversation._id) {
// //           return;
// //         }

// //         if (String(userId) === String(currentUser._id)) {
// //           return;
// //         }

// //         setIsTyping(false);
// //       };

// //       socket.on("typing:start", handleTypingStart);
// //       socket.on("typing:stop", handleTypingStop);

// //       return () => {
// //         socket.off("typing:start", handleTypingStart);
// //         socket.off("typing:stop", handleTypingStop);
// //       };
// //     };

// //     const unsubscribe = subscribeToSocket(handleSocket);

// //     return () => {
// //       unsubscribe();
// //     };
// //   }, [conversation._id, currentUser._id]);

// //   return (
// //     <button
// //       type="button"
// //       className={`cw-conv-item cw-focusable btn w-100 text-start border-0 rounded-0 p-2 p-md-3 d-flex align-items-center gap-2 gap-md-3 ${
// //         active ? "is-active" : ""
// //       }`}
// //       onClick={onClick}
// //     >
// //       {/* Avatar */}
// //       <div
// //         className={`cw-avatar cw-avatar-ring ${
// //           otherUser?.isOnline ? "is-online" : ""
// //         }`}
// //         style={{ width: "44px", height: "44px", fontSize: "16px" }}
// //       >
// //         {otherUser?.name?.charAt(0).toUpperCase()}
// //       </div>

// //       {/* Conversation Content */}
// //       <div className="flex-grow-1 min-width-0 overflow-hidden">
// //         {/* Name + Time */}
// //         <div className="d-flex align-items-center justify-content-between gap-2">
// //           <strong className="text-truncate" style={{ color: "var(--cw-ink)" }}>
// //             {otherUser?.name}
// //           </strong>

// //           {conversation.lastMessageAt && (
// //             <small className="text-muted text-nowrap flex-shrink-0">
// //               {new Date(conversation.lastMessageAt).toLocaleTimeString([], {
// //                 hour: "2-digit",
// //                 minute: "2-digit",
// //               })}
// //             </small>
// //           )}
// //         </div>

// //         {/* Last Message */}
// //         <div className="mt-1">
// //           {isTyping ? (
// //             <span className="cw-typing-label small">
// //               typing
// //               <span className="cw-typing-dots">
// //                 <span />
// //                 <span />
// //                 <span />
// //               </span>
// //             </span>
// //           ) : (
// //             <small className="text-muted text-truncate d-block">
// //               {conversation.lastMessage?.text || "No messages yet"}
// //             </small>
// //           )}
// //         </div>
// //       </div>
// //     </button>
// //   );
// // };

// // export default ConversationItem;
// // -----------------------------------------------------------------------
// // new

// // import { useEffect, useState } from "react";
// // import { subscribeToSocket } from "../../services/socket";

// // const ConversationItem = ({
// //   conversation,
// //   currentUser,
// //   active,
// //   onClick,
// // }) => {
// //   const [isTyping, setIsTyping] = useState(false);

// //   const otherUser = conversation.participants?.find(
// //     (user) => String(user._id) !== String(currentUser._id)
// //   );

// //   const unreadCount = Number(conversation.unreadCount || 0);
// //   const hasUnread = unreadCount > 0 && !active;

// //   useEffect(() => {
// //     const handleSocket = (socket) => {
// //       const handleTypingStart = ({ conversationId, userId }) => {
// //         if (String(conversationId) !== String(conversation._id)) return;
// //         if (String(userId) === String(currentUser._id)) return;

// //         setIsTyping(true);
// //       };

// //       const handleTypingStop = ({ conversationId, userId }) => {
// //         if (String(conversationId) !== String(conversation._id)) return;
// //         if (String(userId) === String(currentUser._id)) return;

// //         setIsTyping(false);
// //       };

// //       socket.on("typing:start", handleTypingStart);
// //       socket.on("typing:stop", handleTypingStop);

// //       return () => {
// //         socket.off("typing:start", handleTypingStart);
// //         socket.off("typing:stop", handleTypingStop);
// //       };
// //     };

// //     const unsubscribe = subscribeToSocket(handleSocket);

// //     return () => unsubscribe();
// //   }, [conversation._id, currentUser._id]);

// //   const lastMessageText =
// //     typeof conversation.lastMessage === "string"
// //       ? conversation.lastMessage
// //       : conversation.lastMessage?.text;

// //   return (
// //     <button
// //       type="button"
// //       className={`cw-conv-item cw-focusable btn w-100 text-start border-0 rounded-0 p-2 p-md-3 d-flex align-items-center gap-2 gap-md-3 ${
// //         active ? "is-active" : ""
// //       }`}
// //       onClick={onClick}
// //     >
// //       {/* Avatar */}
// //       <div
// //         className={`cw-avatar cw-avatar-ring flex-shrink-0 ${
// //           otherUser?.isOnline ? "is-online" : ""
// //         }`}
// //         style={{ width: "44px", height: "44px", fontSize: "16px" }}
// //       >
// //         {otherUser?.name?.charAt(0).toUpperCase() || "?"}
// //       </div>

// //       {/* Conversation Content */}
// //       <div className="flex-grow-1 min-width-0 overflow-hidden">
// //         {/* Name + Time */}
// //         <div className="d-flex align-items-center justify-content-between gap-2">
// //           <strong
// //             className={`text-truncate ${
// //               hasUnread ? "fw-bold" : ""
// //             }`}
// //             style={{ color: "var(--cw-ink)" }}
// //           >
// //             {otherUser?.name || "Unknown user"}
// //           </strong>

// //           {conversation.lastMessageAt && (
// //             <small
// //               className={`text-nowrap flex-shrink-0 ${
// //                 hasUnread ? "text-success fw-semibold" : "text-muted"
// //               }`}
// //             >
// //               {new Date(conversation.lastMessageAt).toLocaleTimeString([], {
// //                 hour: "2-digit",
// //                 minute: "2-digit",
// //               })}
// //             </small>
// //           )}
// //         </div>

// //         {/* Last message + unread badge */}
// //         <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
// //           <div className="flex-grow-1 overflow-hidden">
// //             {isTyping ? (
// //               <span className="cw-typing-label small">
// //                 typing
// //                 <span className="cw-typing-dots">
// //                   <span />
// //                   <span />
// //                   <span />
// //                 </span>
// //               </span>
// //             ) : (
// //               <small
// //                 className={`text-truncate d-block ${
// //                   hasUnread ? "fw-semibold text-dark" : "text-muted"
// //                 }`}
// //               >
// //                 {lastMessageText || "No messages yet"}
// //               </small>
// //             )}
// //           </div>

// //           {hasUnread && (
// //             <span
// //               className="badge rounded-pill bg-success flex-shrink-0"
// //               aria-label={`${unreadCount} unread ${
// //                 unreadCount === 1 ? "message" : "messages"
// //               }`}
// //             >
// //               {unreadCount > 99 ? "99+" : unreadCount}
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     </button>
// //   );
// // };

// // export default ConversationItem;
// // --------------------------------------------------------------
// import { useEffect, useRef, useState } from "react";
// import { subscribeToSocket } from "../../services/socket";

// // If a "typing:stop" is ever missed (user closes the tab, loses network),
// // the indicator would stay on forever. This clears it automatically.
// const TYPING_TIMEOUT_MS = 5000;

// // What to show under the contact's name.
// //
// // IMPORTANT: when the backend does not .populate("lastMessage"), the field
// // is just an ObjectId STRING like "665f1c2a9b3e4d0012ab34cd". The old code
// // rendered that string as the preview, which looks like an "encrypted
// // value". We never render a plain string here.
// const getPreviewText = (conversation) => {
//   const { lastMessage, lastMessageAt } = conversation;

//   if (lastMessage && typeof lastMessage === "object") {
//     return lastMessage.text || "";
//   }

//   // Un-populated id, or no message at all.
//   return lastMessageAt ? "New message" : "";
// };

// const ConversationItem = ({ conversation, currentUser, active, onClick }) => {
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimerRef = useRef(null);

//   const otherUser = conversation.participants?.find(
//     (user) => String(user._id) !== String(currentUser._id)
//   );

//   const unreadCount = Number(conversation.unreadCount || 0);
//   const hasUnread = unreadCount > 0 && !active;

//   useEffect(() => {
//     const clearTypingTimer = () => {
//       if (typingTimerRef.current) {
//         clearTimeout(typingTimerRef.current);
//         typingTimerRef.current = null;
//       }
//     };

//     const handleSocket = (socket) => {
//       const isThisConversation = (conversationId) =>
//         String(conversationId) === String(conversation._id);

//       const isMe = (userId) => String(userId) === String(currentUser._id);

//       const handleTypingStart = ({ conversationId, userId }) => {
//         if (!isThisConversation(conversationId) || isMe(userId)) return;

//         setIsTyping(true);

//         clearTypingTimer();
//         typingTimerRef.current = setTimeout(
//           () => setIsTyping(false),
//           TYPING_TIMEOUT_MS
//         );
//       };

//       const handleTypingStop = ({ conversationId, userId }) => {
//         if (!isThisConversation(conversationId) || isMe(userId)) return;

//         clearTypingTimer();
//         setIsTyping(false);
//       };

//       socket.on("typing:start", handleTypingStart);
//       socket.on("typing:stop", handleTypingStop);

//       return () => {
//         socket.off("typing:start", handleTypingStart);
//         socket.off("typing:stop", handleTypingStop);
//       };
//     };

//     const unsubscribe = subscribeToSocket(handleSocket);

//     return () => {
//       unsubscribe();
//       clearTypingTimer();
//     };
//   }, [conversation._id, currentUser._id]);

//   const previewText = getPreviewText(conversation);

//   return (
//     <button
//       type="button"
//       className={`cw-conv-item cw-focusable btn w-100 text-start border-0 rounded-0 p-2 p-md-3 d-flex align-items-center gap-2 gap-md-3 ${
//         active ? "is-active" : ""
//       }`}
//       onClick={onClick}
//     >
//       {/* Avatar */}
//       <div
//         className={`cw-avatar cw-avatar-ring flex-shrink-0 ${
//           otherUser?.isOnline ? "is-online" : ""
//         }`}
//         style={{ width: "44px", height: "44px", fontSize: "16px" }}
//       >
//         {otherUser?.name?.charAt(0).toUpperCase() || "?"}
//       </div>

//       {/* Conversation content.
//           "min-width-0" is not a real Bootstrap class; minWidth: 0 is what
//           lets text-truncate work inside a flex child. */}
//       <div
//         className="flex-grow-1 overflow-hidden"
//         style={{ minWidth: 0 }}
//       >
//         {/* Name + time */}
//         <div className="d-flex align-items-center justify-content-between gap-2">
//           <strong
//             className={`text-truncate ${hasUnread ? "fw-bold" : ""}`}
//             style={{ color: "var(--cw-ink)" }}
//           >
//             {otherUser?.name || "Unknown user"}
//           </strong>

//           {conversation.lastMessageAt && (
//             <small
//               className={`text-nowrap flex-shrink-0 ${
//                 hasUnread ? "text-success fw-semibold" : "text-muted"
//               }`}
//             >
//               {new Date(conversation.lastMessageAt).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </small>
//           )}
//         </div>

//         {/* Preview + unread badge */}
//         <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
//           <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
//             {isTyping ? (
//               <span className="cw-typing-label small">
//                 typing
//                 <span className="cw-typing-dots">
//                   <span />
//                   <span />
//                   <span />
//                 </span>
//               </span>
//             ) : (
//               <small
//                 className={`text-truncate d-block ${
//                   hasUnread ? "fw-semibold text-dark" : "text-muted"
//                 }`}
//               >
//                 {previewText || "No messages yet"}
//               </small>
//             )}
//           </div>

//           {hasUnread && (
//             <span
//               className="badge rounded-pill bg-success flex-shrink-0"
//               aria-label={`${unreadCount} unread ${
//                 unreadCount === 1 ? "message" : "messages"
//               }`}
//             >
//               {unreadCount > 99 ? "99+" : unreadCount}
//             </span>
//           )}
//         </div>
//       </div>
//     </button>
//   );
// };

// export default ConversationItem;

// -------------------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { subscribeToSocket } from "../../services/socket";

// If a "typing:stop" is ever missed (user closes the tab, loses network),
// the indicator would stay on forever. This clears it automatically.
const TYPING_TIMEOUT_MS = 5000;

// What to show under the contact's name.
//
// IMPORTANT: when the backend does not .populate("lastMessage"), the field
// is just an ObjectId STRING like "665f1c2a9b3e4d0012ab34cd". The old code
// rendered that string as the preview, which looks like an "encrypted
// value". We never render a plain string here.
const getPreviewText = (conversation) => {
  const { lastMessage, lastMessageAt } = conversation;

  if (lastMessage && typeof lastMessage === "object") {
    return lastMessage.text || "";
  }

  // Un-populated id, or no message at all.
  return lastMessageAt ? "New message" : "";
};

const ConversationItem = ({ conversation, currentUser, active, onClick }) => {
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  const otherUser = conversation.participants?.find(
    (user) => String(user._id) !== String(currentUser._id)
  );

  const unreadCount = Number(conversation.unreadCount || 0);
  const hasUnread = unreadCount > 0 && !active;

  useEffect(() => {
    const clearTypingTimer = () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };

    const handleSocket = (socket) => {
      const isThisConversation = (conversationId) =>
        String(conversationId) === String(conversation._id);

      const isMe = (userId) => String(userId) === String(currentUser._id);

      const handleTypingStart = ({ conversationId, userId }) => {
        if (!isThisConversation(conversationId) || isMe(userId)) return;

        setIsTyping(true);

        clearTypingTimer();
        typingTimerRef.current = setTimeout(
          () => setIsTyping(false),
          TYPING_TIMEOUT_MS
        );
      };

      const handleTypingStop = ({ conversationId, userId }) => {
        if (!isThisConversation(conversationId) || isMe(userId)) return;

        clearTypingTimer();
        setIsTyping(false);
      };

      socket.on("typing:start", handleTypingStart);
      socket.on("typing:stop", handleTypingStop);

      return () => {
        socket.off("typing:start", handleTypingStart);
        socket.off("typing:stop", handleTypingStop);
      };
    };

    const unsubscribe = subscribeToSocket(handleSocket);

    return () => {
      unsubscribe();
      clearTypingTimer();
    };
  }, [conversation._id, currentUser._id]);

  const previewText = getPreviewText(conversation);

  return (
    <button
      type="button"
      className={`cw-conv-item cw-focusable btn w-100 text-start border-0 rounded-0 p-2 p-md-3 d-flex align-items-center gap-2 gap-md-3 ${
        active ? "is-active" : ""
      }`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div
        className={`cw-avatar cw-avatar-ring flex-shrink-0 ${
          otherUser?.isOnline ? "is-online" : ""
        }`}
        style={{ width: "44px", height: "44px", fontSize: "16px" }}
      >
        {otherUser?.name?.charAt(0).toUpperCase() || "?"}
      </div>

      {/* Conversation content.
          "min-width-0" is not a real Bootstrap class; minWidth: 0 is what
          lets text-truncate work inside a flex child. */}
      <div
        className="flex-grow-1 overflow-hidden"
        style={{ minWidth: 0 }}
      >
        {/* Name + time */}
        <div className="d-flex align-items-center justify-content-between gap-2">
          <strong
            className={`text-truncate ${hasUnread ? "fw-bold" : ""}`}
            style={{ color: "var(--cw-ink)" }}
          >
            {otherUser?.name || "Unknown user"}
          </strong>

          {conversation.lastMessageAt && (
            <small
              className={`text-nowrap flex-shrink-0 ${
                hasUnread ? "text-success fw-semibold" : "text-muted"
              }`}
            >
              {new Date(conversation.lastMessageAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          )}
        </div>

        {/* Preview + unread badge */}
        <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
          <div className="flex-grow-1 overflow-hidden" style={{ minWidth: 0 }}>
            {isTyping ? (
              <span className="cw-typing-label small">
                typing
                <span className="cw-typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
            ) : (
              <small
                className={`text-truncate d-block ${
                  hasUnread ? "fw-semibold text-dark" : "text-muted"
                }`}
              >
                {previewText || "No messages yet"}
              </small>
            )}
          </div>

          {hasUnread && (
            <span
              className="badge rounded-pill bg-success flex-shrink-0"
              aria-label={`${unreadCount} unread ${
                unreadCount === 1 ? "message" : "messages"
              }`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;