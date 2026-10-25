//  import { useEffect, useState } from "react";

// import { subscribeToSocket } from "../../services/socket";

// const ChatHeader = ({ conversation, currentUser, onBack }) => {
//   const [isTyping, setIsTyping] = useState(false);

//   // --------------------------------
//   // Listen for typing events on the open conversation
//   // --------------------------------

//   useEffect(() => {
//     // Reset whenever the open conversation changes
//     setIsTyping(false);

//     if (!conversation) {
//       return;
//     }

//     const handleSocket = (socket) => {
//       const handleTypingStart = ({ conversationId, userId }) => {
//         if (conversationId !== conversation._id) {
//           return;
//         }

//         // Don't show our own typing
//         if (String(userId) === String(currentUser._id)) {
//           return;
//         }

//         setIsTyping(true);
//       };

//       const handleTypingStop = ({ conversationId, userId }) => {
//         if (conversationId !== conversation._id) {
//           return;
//         }

//         if (String(userId) === String(currentUser._id)) {
//           return;
//         }

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
//     };
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [conversation?._id, currentUser._id]);

//   if (!conversation) {
//     return (
//       <div className="cw-header px-3 px-md-4 py-3">
//         <div className="d-flex align-items-center gap-2">
//           {onBack && (
//             <button
//               type="button"
//               className="cw-back-btn cw-focusable d-md-none"
//               onClick={onBack}
//               title="Back to conversations"
//             >
//               <i className="bi bi-arrow-left" />
//             </button>
//           )}

//           <div>
//             <h5 className="mb-0 fw-semibold cw-display">
//               Select a conversation
//             </h5>

//             <small className="text-muted">
//               Choose a conversation to start chatting
//             </small>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const otherUser = conversation.participants.find(
//     (user) => String(user._id) !== String(currentUser._id)
//   );

//   return (
//     <div className="cw-header px-3 px-md-4 py-2 py-md-3">
//       <div className="d-flex align-items-center gap-2 gap-md-3">
//         {/* Back to list (mobile only) */}
//         {onBack && (
//           <button
//             type="button"
//             className="cw-back-btn cw-focusable d-md-none"
//             onClick={onBack}
//             title="Back to conversations"
//           >
//             <i className="bi bi-arrow-left" />
//           </button>
//         )}

//         {/* User Avatar */}
//         <div
//           className={`cw-avatar cw-avatar-ring ${
//             otherUser?.isOnline ? "is-online" : ""
//           }`}
//           style={{ width: "44px", height: "44px", fontSize: "17px" }}
//         >
//           {otherUser?.name?.charAt(0).toUpperCase()}
//         </div>

//         {/* User Information */}
//         <div className="flex-grow-1 overflow-hidden">
//           {/* Name + Email */}
//           <div className="d-flex align-items-center gap-2">
//             <h5 className="mb-0 fw-semibold cw-display text-truncate">
//               {otherUser?.name}
//             </h5>

//             <small className="text-muted text-truncate d-none d-md-block">
//               ({otherUser?.email})
//             </small>
//           </div>

//           {/* Online Status / Typing */}
//           <div className="d-flex align-items-center gap-1 mt-1">
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
//               <>
//                 <span
//                   className={`cw-status-dot ${
//                     otherUser?.isOnline ? "is-online" : ""
//                   }`}
//                 />

//                 <small
//                   className={
//                     otherUser?.isOnline ? "fw-medium" : "text-muted"
//                   }
//                   style={
//                     otherUser?.isOnline
//                       ? { color: "var(--cw-primary)" }
//                       : undefined
//                   }
//                 >
//                   {otherUser?.isOnline ? "Online" : "Offline"}
//                 </small>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import { subscribeToSocket } from "../../services/socket";

const ChatHeader = ({ conversation, currentUser, onBack }) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Reset the typing indicator whenever the conversation changes.
    setIsTyping(false);

    if (!conversation?._id || !currentUser?._id) {
      return;
    }

    const activeConversationId = String(conversation._id);
    const currentUserId = String(currentUser._id);

    let removeSocketListeners = null;

    const handleSocket = (socket) => {
      // Prevent duplicate listeners if the socket becomes ready again.
      removeSocketListeners?.();

      const handleTypingStart = ({ conversationId, userId } = {}) => {
        if (String(conversationId) !== activeConversationId) {
          return;
        }

        if (String(userId) === currentUserId) {
          return;
        }

        setIsTyping(true);
      };

      const handleTypingStop = ({ conversationId, userId } = {}) => {
        if (String(conversationId) !== activeConversationId) {
          return;
        }

        if (String(userId) === currentUserId) {
          return;
        }

        setIsTyping(false);
      };

      socket.on("typing:start", handleTypingStart);
      socket.on("typing:stop", handleTypingStop);

      removeSocketListeners = () => {
        socket.off("typing:start", handleTypingStart);
        socket.off("typing:stop", handleTypingStop);
      };
    };

    const unsubscribe = subscribeToSocket(handleSocket);

    return () => {
      unsubscribe();
      removeSocketListeners?.();
    };
  }, [conversation?._id, currentUser?._id]);

  if (!conversation) {
    return (
      <div className="cw-header px-3 px-md-4 py-3">
        <div className="d-flex align-items-center gap-2">
          {onBack && (
            <button
              type="button"
              className="cw-back-btn cw-focusable d-md-none"
              onClick={onBack}
              title="Back to conversations"
            >
              <i className="bi bi-arrow-left" />
            </button>
          )}

          <div>
            <h5 className="mb-0 fw-semibold cw-display">
              Select a conversation
            </h5>
            <small className="text-muted">
              Choose a conversation to start chatting
            </small>
          </div>
        </div>
      </div>
    );
  }

  const otherUser = conversation.participants?.find(
    (user) => String(user._id) !== String(currentUser?._id)
  );

  return (
    <div className="cw-header px-3 px-md-4 py-2 py-md-3">
      <div className="d-flex align-items-center gap-2 gap-md-3">
        {onBack && (
          <button
            type="button"
            className="cw-back-btn cw-focusable d-md-none"
            onClick={onBack}
            title="Back to conversations"
          >
            <i className="bi bi-arrow-left" />
          </button>
        )}

        <div
          className={`cw-avatar cw-avatar-ring ${
            otherUser?.isOnline ? "is-online" : ""
          }`}
          style={{ width: "44px", height: "44px", fontSize: "17px" }}
        >
          {otherUser?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-grow-1 overflow-hidden">
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0 fw-semibold cw-display text-truncate">
              {otherUser?.name}
            </h5>

            <small className="text-muted text-truncate d-none d-md-block">
              ({otherUser?.email})
            </small>
          </div>

          <div className="d-flex align-items-center gap-1 mt-1">
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
              <>
                <span
                  className={`cw-status-dot ${
                    otherUser?.isOnline ? "is-online" : ""
                  }`}
                />

                <small
                  className={
                    otherUser?.isOnline ? "fw-medium" : "text-muted"
                  }
                  style={
                    otherUser?.isOnline
                      ? { color: "var(--cw-primary)" }
                      : undefined
                  }
                >
                  {otherUser?.isOnline ? "Online" : "Offline"}
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
