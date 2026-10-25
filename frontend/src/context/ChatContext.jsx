// // // import { createContext, useContext, useEffect, useState ,useRef} from "react";

// // // import { subscribeToSocket } from "../services/socket";

// // // import api from "../services/api";
// // // import { useAuth } from "./AuthContext";


// // // const ChatContext = createContext(null);

// // // export const ChatProvider = ({ children }) => {
// // //     const { user, loading: authLoading } = useAuth();

// // //   const [users, setUsers] = useState([]);
// // //   const [conversations, setConversations] = useState([]);

// // //   const [activeConversation, setActiveConversation] = useState(null);
// // //   const activeConversationRef = useRef(null);

  

// // //   const [messages, setMessages] = useState([]);

// // //   const [loadingUsers, setLoadingUsers] = useState(false);

// // //   const [loadingConversations, setLoadingConversations] = useState(false);

// // //   const [loadingMessages, setLoadingMessages] = useState(false);

   
// // //  useEffect(() => {
// // //   activeConversationRef.current = activeConversation;
// // // }, [activeConversation]);

// // //   // --------------------------------
// // //   // Real-time socket message handling
// // //   // --------------------------------

// // //   useEffect(() => {
// // //     const handleSocket = (socket) => {
// // //       console.log("ChatContext: Socket is ready:", socket.id);
 
// // //       const handleIncomingMessage = (message) => {
// // //          console.log("📩 Incoming message received:", message);
// // //   console.log("📦 Conversation payload:", message.conversation);

// // //         const messageConversationId =
// // //           message.conversation?._id || message.conversation?.toString();
          

// // //   console.log("🆔 Conversation ID:", messageConversationId);

// // //            const isActiveConversation =
// // //   activeConversationRef.current?._id === messageConversationId;
  
// // //         // --------------------------------
// // //         // Add message to current chat
// // //         // --------------------------------

// // //         setMessages((previous) => {
// // //           const alreadyExists = previous.some(
// // //             (item) => item._id === message._id,
// // //           );

// // //           if (alreadyExists) {
// // //             return previous;
// // //           }

// // //           return [...previous, message];
// // //         });

// // //         // --------------------------------
// // //         // Update sidebar conversation
// // //         // --------------------------------

        
// // //         // setConversations((previous) => {
// // //         //   const updated = previous.map((conversation) => {
// // //         //     if (conversation._id !== messageConversationId) {
// // //         //       return conversation;
// // //         //     }

// // //         //     return {
// // //         //       ...conversation,

// // //         //       lastMessage: message,

// // //         //       lastMessageAt: message.createdAt,
// // //         //     };
// // //         //   });

// // //         //   return updated.sort((a, b) => {
// // //         //     const dateA = new Date(a.lastMessageAt || a.updatedAt || 0);

// // //         //     const dateB = new Date(b.lastMessageAt || b.updatedAt || 0);

// // //         //     return dateB - dateA;
// // //         //   });
// // //         // });
// // //  setConversations((previous) => {
// // //   const existingConversation = previous.find(
// // //     (conversation) => conversation._id === messageConversationId
// // //   );

// // //   // Conversation already exists in the sidebar
// // //   if (existingConversation) {
// // //     const updatedConversation = {
// // //       ...existingConversation,
// // //       lastMessage: message,
// // //       lastMessageAt: message.createdAt,

// // //       // Increase unread only when this conversation is not open
// // //       unreadCount: isActiveConversation
// // //         ? existingConversation.unreadCount || 0
// // //         : (existingConversation.unreadCount || 0) + 1,
// // //     };

// // //     // Move the updated conversation to the top
// // //     return [
// // //       updatedConversation,
// // //       ...previous.filter(
// // //         (conversation) => conversation._id !== messageConversationId
// // //       ),
// // //     ];
// // //   }

// // //   // Conversation does not exist in the sidebar yet
// // //   if (message.conversation) {
// // //     const newConversation = {
// // //       ...message.conversation,
// // //       lastMessage: message,
// // //       lastMessageAt: message.createdAt,

// // //       // New conversation = one unread message
// // //       unreadCount: isActiveConversation ? 0 : 1,
// // //     };

// // //     return [newConversation, ...previous];
// // //   }

// // //   return previous;
// // // });
// // //       };

 
// // //       const handleMessageError = (error) => {
// // //         console.error("Socket message error:", error);
// // //       };

// // //       // --------------------------------
// // //       // Real-time message deletion
// // //       // --------------------------------

       
// // //       const handleMessageDeleted = ({
// // //         messageId,
// // //         conversationId,
// // //         lastMessage,
// // //         lastMessageAt,
// // //       }) => {
// // //         console.log("ChatContext: message deleted:", messageId);

// // //         setMessages((previous) =>
// // //           previous.filter((message) => message._id !== messageId),
// // //         );

// // //         setConversations((previous) =>
// // //           previous.map((conversation) => {
// // //             if (conversation._id !== conversationId) {
// // //               return conversation;
// // //             }

// // //             if (conversation.lastMessage?._id === messageId) {
// // //               return {
// // //                 ...conversation,

// // //                 lastMessage: lastMessage,

// // //                 lastMessageAt: lastMessageAt,
// // //               };
// // //             }

// // //             return conversation;
// // //           }),
// // //         );
// // //       };
// // //       // --------------------------------
// // //       // User online
// // //       // --------------------------------

// // //       const handleUserOnline = ({ userId, isOnline, lastSeen }) => {
// // //         console.log("User came online:", userId);

// // //         // Update users
// // //         setUsers((previous) =>
// // //           previous.map((user) =>
// // //             user._id === userId
// // //               ? {
// // //                   ...user,
// // //                   isOnline,
// // //                   lastSeen,
// // //                 }
// // //               : user,
// // //           ),
// // //         );

// // //         // Update conversations
// // //         setConversations((previous) =>
// // //           previous.map((conversation) => ({
// // //             ...conversation,

// // //             participants: conversation.participants.map((participant) =>
// // //               participant._id === userId
// // //                 ? {
// // //                     ...participant,
// // //                     isOnline,
// // //                     lastSeen,
// // //                   }
// // //                 : participant,
// // //             ),
// // //           })),
// // //         );

// // //         // Update currently active conversation
// // //         setActiveConversation((previous) => {
// // //           if (!previous) {
// // //             return previous;
// // //           }

// // //           return {
// // //             ...previous,

// // //             participants: previous.participants.map((participant) =>
// // //               participant._id === userId
// // //                 ? {
// // //                     ...participant,
// // //                     isOnline,
// // //                     lastSeen,
// // //                   }
// // //                 : participant,
// // //             ),
// // //           };
// // //         });
// // //       };

// // //       // --------------------------------
// // //       // User offline
// // //       // --------------------------------

// // //       const handleUserOffline = ({ userId, isOnline, lastSeen }) => {
// // //         console.log("User went offline:", userId);

// // //         // Update users
// // //         setUsers((previous) =>
// // //           previous.map((user) =>
// // //             user._id === userId
// // //               ? {
// // //                   ...user,
// // //                   isOnline,
// // //                   lastSeen,
// // //                 }
// // //               : user,
// // //           ),
// // //         );

// // //         // Update conversations
// // //         setConversations((previous) =>
// // //           previous.map((conversation) => ({
// // //             ...conversation,

// // //             participants: conversation.participants.map((participant) =>
// // //               participant._id === userId
// // //                 ? {
// // //                     ...participant,
// // //                     isOnline,
// // //                     lastSeen,
// // //                   }
// // //                 : participant,
// // //             ),
// // //           })),
// // //         );

// // //         // Update currently active conversation
// // //         setActiveConversation((previous) => {
// // //           if (!previous) {
// // //             return previous;
// // //           }

// // //           return {
// // //             ...previous,

// // //             participants: previous.participants.map((participant) =>
// // //               participant._id === userId
// // //                 ? {
// // //                     ...participant,
// // //                     isOnline,
// // //                     lastSeen,
// // //                   }
// // //                 : participant,
// // //             ),
// // //           };
// // //         });
// // //       };
// // //       socket.on("message:receive", handleIncomingMessage);

// // //       socket.on("message:error", handleMessageError);
// // //       socket.on("message:delete", handleMessageDeleted);
// // //       socket.on("user:online", handleUserOnline);

// // //       socket.on("user:offline", handleUserOffline);
// // //       // return () => {
// // //       //   socket.off(
// // //       //     "message:receive",
// // //       //     handleIncomingMessage
// // //       //   );

// // //       //   socket.off(
// // //       //     "message:error",
// // //       //     handleMessageError
// // //       //   );
// // //       // };

// // //       return () => {
// // //         socket.off("message:receive", handleIncomingMessage);

// // //         socket.off("message:error", handleMessageError);

// // //         socket.off("user:online", handleUserOnline);

// // //         socket.off("user:offline", handleUserOffline);

// // //         socket.off("message:delete", handleMessageDeleted);
// // //       };
// // //     };

// // //     const unsubscribe = subscribeToSocket(handleSocket);

// // //     return () => {
// // //       unsubscribe();
// // //     };
// // //   }, []);

// // //   // --------------------------------
// // //   // Join active conversation
// // //   // --------------------------------

// // //   useEffect(() => {
// // //     if (!activeConversation) {
// // //       return;
// // //     }

// // //     const conversationId = activeConversation._id;

// // //     const handleSocket = (socket) => {
// // //       console.log("Joining conversation:", conversationId);

// // //       socket.emit("conversation:join", conversationId);
// // //     };

// // //     const unsubscribe = subscribeToSocket(handleSocket);

// // //     return () => {
// // //       unsubscribe();
// // //     };
// // //   }, [activeConversation]);

// // //   // --------------------------------
// // //   // Fetch users
// // //   // --------------------------------

// // //   const fetchUsers = async () => {
// // //     try {
// // //       setLoadingUsers(true);

// // //       const response = await api.get("/users");

// // //       setUsers(response.data.users);
// // //     } catch (error) {
// // //       console.error("Failed to fetch users:", error);
// // //     } finally {
// // //       setLoadingUsers(false);
// // //     }
// // //   };

// // //   // --------------------------------
// // //   // Search users
// // //   // --------------------------------

// // //   const searchUsers = async (query) => {
// // //     if (!query.trim()) {
// // //       setUsers([]);
// // //       return;
// // //     }

// // //     try {
// // //       setLoadingUsers(true);

// // //       const response = await api.get(
// // //         `/users/search?q=${encodeURIComponent(query)}`,
// // //       );

// // //       setUsers(response.data.users);
// // //     } catch (error) {
// // //       console.error("Failed to search users:", error);
// // //     } finally {
// // //       setLoadingUsers(false);
// // //     }
// // //   };

// // //   // --------------------------------
// // //   // Fetch conversations
// // //   // --------------------------------

// // //   const fetchConversations = async () => {
// // //     try {
// // //       setLoadingConversations(true);

// // //       const response = await api.get("/conversations");

// // //       setConversations(response.data.conversations);
// // //     } catch (error) {
// // //       console.error("Failed to fetch conversations:", error);
// // //     } finally {
// // //       setLoadingConversations(false);
// // //     }
// // //   };

// // //   // --------------------------------
// // //   // Create / get conversation
// // //   // --------------------------------
 
// // // const createConversation = async (userId) => {
// // //   try {
// // //     const response = await api.post("/conversations", {
// // //       userId,
// // //     });

// // //     const conversation = response.data.conversation;

// // //     // Add/update conversation in sidebar immediately
// // //     setConversations((previous) => {
// // //       const exists = previous.some(
// // //         (item) => item._id === conversation._id
// // //       );

// // //       if (exists) {
// // //         return previous.map((item) =>
// // //           item._id === conversation._id
// // //             ? conversation
// // //             : item
// // //         );
// // //       }

// // //       return [conversation, ...previous];
// // //     });

// // //     // Select the conversation immediately
// // //     setActiveConversation(conversation);

// // //     // Load its messages
// // //     await fetchMessages(conversation._id);

// // //     return conversation;
// // //   } catch (error) {
// // //     console.error(
// // //       "Failed to create conversation:",
// // //       error
// // //     );

// // //     throw error;
// // //   }
// // // };
// // //   // --------------------------------
// // //   // Fetch messages
// // //   // --------------------------------

// // //   const fetchMessages = async (conversationId) => {
// // //     try {
// // //       setLoadingMessages(true);

// // //       const response = await api.get(
// // //         `/messages/${conversationId}?page=1&limit=30`,
// // //       );

// // //       setMessages(response.data.messages);
// // //     } catch (error) {
// // //       console.error("Failed to fetch messages:", error);

// // //       setMessages([]);
// // //     } finally {
// // //       setLoadingMessages(false);
// // //     }
// // //   };

// // //   // --------------------------------
// // //   // Select conversation
// // //   // --------------------------------

// // //   // const selectConversation = async (conversation) => {
// // //   //   setActiveConversation(conversation);

// // //   //   await fetchMessages(conversation._id);
// // //   // };
  
// // // const selectConversation = async (conversation) => {
// // //   // Mark this conversation as active
// // //   setActiveConversation(conversation);

// // //   // Clear its unread count in the sidebar
// // //   setConversations((previous) =>
// // //     previous.map((item) =>
// // //       item._id === conversation._id
// // //         ? { ...item, unreadCount: 0 }
// // //         : item
// // //     )
// // //   );

// // //   // Load messages for the selected conversation
// // //   await fetchMessages(conversation._id);
// // // };

// // //   // --------------------------------
// // //   // Initial data
// // //   // --------------------------------

// // //   // useEffect(() => {
// // //   //   fetchConversations();
// // //   //   fetchUsers();
// // //   // }, []);

// // //   // --------------------------------
// // // // Initial data
// // // // --------------------------------

// // // useEffect(() => {
// // //   if (authLoading) {
// // //     return;
// // //   }

// // //   if (!user) {
// // //     setUsers([]);
// // //     setConversations([]);
// // //     setActiveConversation(null);
// // //     setMessages([]);

// // //     return;
// // //   }

// // //   fetchUsers();
// // //   fetchConversations();
// // // }, [user, authLoading]);

// // //   // --------------------------------
// // //   // Start typing
// // //   // --------------------------------

// // //   const startTyping = (conversationId) => {
// // //     const socket = requireSocket();

// // //     if (!socket) {
// // //       return;
// // //     }

// // //     socket.emit("typing:start", {
// // //       conversationId,
// // //     });
// // //   };

// // //   // --------------------------------
// // //   // Stop typing
// // //   // --------------------------------

// // //   const stopTyping = (conversationId) => {
// // //     const socket = requireSocket();

// // //     if (!socket) {
// // //       return;
// // //     }

// // //     socket.emit("typing:stop", {
// // //       conversationId,
// // //     });
// // //   };

// // //   // --------------------------------
// // //   // Send message using Socket.IO
// // //   // --------------------------------

// // //   const sendMessage = (conversationId, text) => {
// // //     const socket = requireSocket();

// // //     if (!socket) {
// // //       throw new Error("Socket is not connected");
// // //     }

// // //     console.log("Sending message:", {
// // //       conversationId,
// // //       text,
// // //       socketId: socket.id,
// // //       connected: socket.connected,
// // //     });

// // //     socket.emit("message:send", {
// // //       conversationId,
// // //       text,
// // //     });
// // //   };

// // //   // --------------------------------
// // //   // Delete message
// // //   // --------------------------------

  

// // //   const deleteMessage = (messageId) => {
// // //     const socket = requireSocket();

// // //     if (!socket) {
// // //       console.error("Delete failed: socket is not connected");

// // //       return;
// // //     }

// // //     if (!messageId) {
// // //       console.error("Delete failed: messageId is missing");

// // //       return;
// // //     }

// // //     console.log("DELETE MESSAGE REQUEST:", {
// // //       messageId,
// // //       socketId: socket.id,
// // //       connected: socket.connected,
// // //     });

// // //     socket.emit(
// // //       "message:delete",
// // //       {
// // //         messageId,
// // //       },
// // //       (response) => {
// // //         console.log("DELETE MESSAGE RESPONSE:", response);
// // //       },
// // //     );
// // //   };
// // //   return (
// // //     <ChatContext.Provider
// // //       value={{
// // //         users,
// // //         conversations,

// // //         activeConversation,
// // //         messages,

// // //         loadingUsers,
// // //         loadingConversations,
// // //         loadingMessages,

// // //         fetchUsers,
// // //         searchUsers,

// // //         fetchConversations,

// // //         createConversation,
// // //         selectConversation,

// // //         fetchMessages,
// // //         sendMessage,
// // //         startTyping,
// // //         stopTyping,
// // //         deleteMessage,
// // //       }}
// // //     >
// // //       {children}
// // //     </ChatContext.Provider>
// // //   );
// // // };

// // // // Small helper so sendMessage can use the current socket
// // // // eslint-disable-next-line import/first
// // // import { getSocket } from "../services/socket";

// // // const requireSocket = () => {
// // //   const socket = getSocket();

// // //   if (!socket) {
// // //     return null;
// // //   }

// // //   if (!socket.connected) {
// // //     return null;
// // //   }

// // //   return socket;
// // // };

// // // export const useChat = () => {
// // //   return useContext(ChatContext);
// // // };
// // // ================================================================
// // import { createContext, useContext, useEffect, useRef, useState } from "react";

// // import api from "../services/api";
// // import { getSocket, subscribeToSocket } from "../services/socket";
// // import { useAuth } from "./AuthContext";

// // const ChatContext = createContext(null);

// // // --------------------------------
// // // Helpers (outside the component so they are created once)
// // // --------------------------------

// // const requireSocket = () => {
// //   const socket = getSocket();
// //   return socket && socket.connected ? socket : null;
// // };

// // const requestPresence = () => {
// //   requireSocket()?.emit("presence:request");
// // };

// // // Applies patchParticipant to every participant of a conversation.
// // // Returns the SAME object when nothing changed, so React does not
// // // re-render (and effects keyed on it do not re-run) for no reason.
// // const patchConversationParticipants = (conversation, patchParticipant) => {
// //   if (!conversation?.participants) {
// //     return conversation;
// //   }

// //   let changed = false;

// //   const participants = conversation.participants.map((participant) => {
// //     const next = patchParticipant(participant);
// //     if (next !== participant) {
// //       changed = true;
// //     }
// //     return next;
// //   });

// //   return changed ? { ...conversation, participants } : conversation;
// // };

// // export const ChatProvider = ({ children }) => {
// //   const { user, loading: authLoading } = useAuth();

// //   const [users, setUsers] = useState([]);
// //   const [conversations, setConversations] = useState([]);
// //   const [activeConversation, setActiveConversation] = useState(null);
// //   const [messages, setMessages] = useState([]);

// //   const [loadingUsers, setLoadingUsers] = useState(false);
// //   const [loadingConversations, setLoadingConversations] = useState(false);
// //   const [loadingMessages, setLoadingMessages] = useState(false);

// //   // Refs let the long-lived socket listeners read the LATEST values
// //   // without being re-registered on every change.
// //   const activeConversationRef = useRef(null);
// //   const userIdRef = useRef(null);

// //   useEffect(() => {
// //     activeConversationRef.current = activeConversation;
// //   }, [activeConversation]);

// //   useEffect(() => {
// //     userIdRef.current = user?._id ?? null;
// //   }, [user]);

// //   // --------------------------------
// //   // Real-time socket listeners
// //   // --------------------------------

// //   useEffect(() => {
// //     const handleSocket = (socket) => {
// //       // Update one person's presence everywhere it is displayed.
// //       const patchEverywhere = (patchParticipant) => {
// //         setUsers((previous) => previous.map(patchParticipant));

// //         setConversations((previous) =>
// //           previous.map((conversation) =>
// //             patchConversationParticipants(conversation, patchParticipant)
// //           )
// //         );

// //         setActiveConversation((previous) =>
// //           patchConversationParticipants(previous, patchParticipant)
// //         );
// //       };

// //       // ---- incoming message ----
// //       const handleIncomingMessage = (message) => {
// //         const conversationId =
// //           message.conversation?._id || message.conversation?.toString();

// //         if (!conversationId) {
// //           return;
// //         }

// //         const isActiveConversation =
// //           activeConversationRef.current?._id === conversationId;

// //         const senderId = message.sender?._id || message.sender;
// //         const isOwnMessage = senderId === userIdRef.current;

// //         // 1) Only append to the open thread when the message BELONGS to it.
// //         //    (Before, every message from every chat was appended here.)
// //         if (isActiveConversation) {
// //           setMessages((previous) =>
// //             previous.some((item) => item._id === message._id)
// //               ? previous
// //               : [...previous, message]
// //           );
// //         }

// //         // 2) Sidebar: preview, ordering, unread badge.
// //         //    Store a light copy so we do not nest the whole conversation
// //         //    (with all participants) inside its own lastMessage.
// //         const lastMessage = { ...message, conversation: conversationId };

// //         setConversations((previous) => {
// //           const existing = previous.find(
// //             (conversation) => conversation._id === conversationId
// //           );

// //           if (existing) {
// //             // Same message delivered twice (two event names, or a
// //             // reconnect)? Do not count it twice.
// //             if (String(existing.lastMessage?._id) === String(message._id)) {
// //               return previous;
// //             }

// //             const shouldCountUnread = !isActiveConversation && !isOwnMessage;

// //             const updated = {
// //               ...existing,
// //               lastMessage,
// //               lastMessageAt: message.createdAt,
// //               unreadCount:
// //                 (existing.unreadCount || 0) + (shouldCountUnread ? 1 : 0),
// //             };

// //             return [
// //               updated,
// //               ...previous.filter(
// //                 (conversation) => conversation._id !== conversationId
// //               ),
// //             ];
// //           }

// //           // Brand-new conversation (recipient has never opened it):
// //           // the server sends the populated conversation with the message.
// //           if (typeof message.conversation === "object") {
// //             return [
// //               {
// //                 ...message.conversation,
// //                 lastMessage,
// //                 lastMessageAt: message.createdAt,
// //                 unreadCount: isActiveConversation || isOwnMessage ? 0 : 1,
// //               },
// //               ...previous,
// //             ];
// //           }

// //           return previous;
// //         });
// //       };

// //       const handleMessageError = (error) => {
// //         console.error("Socket message error:", error);
// //       };

// //       // ---- message deleted ----
// //       const handleMessageDeleted = ({
// //         messageId,
// //         conversationId,
// //         lastMessage,
// //         lastMessageAt,
// //       }) => {
// //         setMessages((previous) =>
// //           previous.filter((message) => message._id !== messageId)
// //         );

// //         setConversations((previous) =>
// //           previous.map((conversation) => {
// //             if (
// //               conversation._id !== conversationId ||
// //               conversation.lastMessage?._id !== messageId
// //             ) {
// //               return conversation;
// //             }

// //             return { ...conversation, lastMessage, lastMessageAt };
// //           })
// //         );
// //       };

// //       // ---- presence ----
// //       const handleUserStatus = ({ userId, isOnline, lastSeen }) => {
// //         patchEverywhere((participant) =>
// //           participant._id === userId
// //             ? { ...participant, isOnline, lastSeen }
// //             : participant
// //         );
// //       };

// //       // Full picture sent by the server: anyone not in the list is offline.
// //       const handlePresenceSnapshot = ({ onlineUserIds }) => {
// //         const onlineSet = new Set(onlineUserIds);

// //         patchEverywhere((participant) => {
// //           const isOnline = onlineSet.has(String(participant._id));

// //           return participant.isOnline === isOnline
// //             ? participant
// //             : { ...participant, isOnline };
// //         });
// //       };

// //       socket.on("message:receive", handleIncomingMessage);
// //       // Older server builds notify each user's personal room with this
// //       // event name. The handler is idempotent, so listening to both is safe
// //       // and the sidebar updates even if the recipient has not opened the chat.
// //       socket.on("conversation:message", handleIncomingMessage);
// //       socket.on("message:error", handleMessageError);
// //       socket.on("message:delete", handleMessageDeleted);
// //       socket.on("user:online", handleUserStatus);
// //       socket.on("user:offline", handleUserStatus);
// //       socket.on("presence:snapshot", handlePresenceSnapshot);

// //       // Ask for the snapshot only AFTER the listener above exists, and again
// //       // on every reconnect. (Anything the server pushes during the handshake
// //       // can arrive before listeners are attached and be lost.)
// //       socket.on("connect", requestPresence);

// //       if (socket.connected) {
// //         requestPresence();
// //       }

// //       return () => {
// //         socket.off("message:receive", handleIncomingMessage);
// //         socket.off("conversation:message", handleIncomingMessage);
// //         socket.off("message:error", handleMessageError);
// //         socket.off("message:delete", handleMessageDeleted);
// //         socket.off("user:online", handleUserStatus);
// //         socket.off("user:offline", handleUserStatus);
// //         socket.off("presence:snapshot", handlePresenceSnapshot);
// //         socket.off("connect", requestPresence);
// //       };
// //     };

// //     const unsubscribe = subscribeToSocket(handleSocket);

// //     return () => {
// //       unsubscribe();
// //     };
// //   }, []);

// //   // --------------------------------
// //   // Join the active conversation's room (for typing indicators).
// //   // Keyed on the _id, not the whole object: presence updates create a new
// //   // object, which used to re-run this effect and re-join needlessly.
// //   // Re-joins after a reconnect, because rooms are lost when a socket drops.
// //   // --------------------------------

// //   const activeConversationId = activeConversation?._id;

// //   useEffect(() => {
// //     if (!activeConversationId) {
// //       return;
// //     }

// //     const handleSocket = (socket) => {
// //       const join = () => socket.emit("conversation:join", activeConversationId);

// //       if (socket.connected) {
// //         join();
// //       }

// //       socket.on("connect", join);

// //       return () => {
// //         socket.off("connect", join);
// //       };
// //     };

// //     const unsubscribe = subscribeToSocket(handleSocket);

// //     return () => {
// //       unsubscribe();
// //     };
// //   }, [activeConversationId]);

// //   // --------------------------------
// //   // REST: users
// //   // --------------------------------

// //   const fetchUsers = async () => {
// //     try {
// //       setLoadingUsers(true);
// //       const response = await api.get("/users");
// //       setUsers(response.data.users);
// //       requestPresence(); // REST data can be older than live presence
// //     } catch (error) {
// //       console.error("Failed to fetch users:", error);
// //     } finally {
// //       setLoadingUsers(false);
// //     }
// //   };

// //   const searchUsers = async (query) => {
// //     if (!query.trim()) {
// //       setUsers([]);
// //       return;
// //     }

// //     try {
// //       setLoadingUsers(true);
// //       const response = await api.get(
// //         `/users/search?q=${encodeURIComponent(query)}`
// //       );
// //       setUsers(response.data.users);
// //       requestPresence();
// //     } catch (error) {
// //       console.error("Failed to search users:", error);
// //     } finally {
// //       setLoadingUsers(false);
// //     }
// //   };

// //   // --------------------------------
// //   // REST: conversations
// //   // --------------------------------

// //   const fetchConversations = async () => {
// //     try {
// //       setLoadingConversations(true);
// //       const response = await api.get("/conversations");
// //       setConversations(response.data.conversations);
// //       requestPresence();
// //     } catch (error) {
// //       console.error("Failed to fetch conversations:", error);
// //     } finally {
// //       setLoadingConversations(false);
// //     }
// //   };

// //   // --------------------------------
// //   // REST: messages
// //   // --------------------------------

// //   const fetchMessages = async (conversationId) => {
// //     try {
// //       setLoadingMessages(true);
// //       const response = await api.get(
// //         `/messages/${conversationId}?page=1&limit=30`
// //       );
// //       setMessages(response.data.messages);
// //     } catch (error) {
// //       console.error("Failed to fetch messages:", error);
// //       setMessages([]);
// //     } finally {
// //       setLoadingMessages(false);
// //     }
// //   };

// //   // --------------------------------
// //   // Create / open a conversation
// //   // --------------------------------

// //   const createConversation = async (userId) => {
// //     try {
// //       const response = await api.post("/conversations", { userId });
// //       const conversation = response.data.conversation;

// //       setConversations((previous) => {
// //         const exists = previous.some((item) => item._id === conversation._id);

// //         if (exists) {
// //           return previous.map((item) => {
// //             if (item._id !== conversation._id) {
// //               return item;
// //             }

// //             // The POST response often has lastMessage as a bare ObjectId
// //             // string (not populated). Never let it overwrite the populated
// //             // message object we already have in the sidebar.
// //             const hasPopulatedLastMessage =
// //               conversation.lastMessage &&
// //               typeof conversation.lastMessage === "object";

// //             return {
// //               ...item,
// //               ...conversation,
// //               lastMessage: hasPopulatedLastMessage
// //                 ? conversation.lastMessage
// //                 : item.lastMessage,
// //               lastMessageAt: conversation.lastMessageAt ?? item.lastMessageAt,
// //               unreadCount: 0,
// //             };
// //           });
// //         }

// //         return [{ ...conversation, unreadCount: 0 }, ...previous];
// //       });

// //       // Update the ref immediately so a message arriving before the next
// //       // render is already treated as "belongs to the open chat".
// //       activeConversationRef.current = conversation;
// //       setActiveConversation(conversation);
// //       setMessages([]);

// //       await fetchMessages(conversation._id);

// //       return conversation;
// //     } catch (error) {
// //       console.error("Failed to create conversation:", error);
// //       throw error;
// //     }
// //   };

// //   const selectConversation = async (conversation) => {
// //     activeConversationRef.current = conversation;
// //     setActiveConversation(conversation);

// //     // Don't flash the previous thread while the new one loads.
// //     setMessages([]);

// //     setConversations((previous) =>
// //       previous.map((item) =>
// //         item._id === conversation._id ? { ...item, unreadCount: 0 } : item
// //       )
// //     );

// //     await fetchMessages(conversation._id);
// //   };

// //   // --------------------------------
// //   // Initial data / reset on logout
// //   // --------------------------------

// //   useEffect(() => {
// //     if (authLoading) {
// //       return;
// //     }

// //     if (!user) {
// //       activeConversationRef.current = null;
// //       setUsers([]);
// //       setConversations([]);
// //       setActiveConversation(null);
// //       setMessages([]);
// //       return;
// //     }

// //     fetchUsers();
// //     fetchConversations();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [user, authLoading]);

// //   // --------------------------------
// //   // Typing / send / delete
// //   // --------------------------------

// //   const startTyping = (conversationId) => {
// //     requireSocket()?.emit("typing:start", { conversationId });
// //   };

// //   const stopTyping = (conversationId) => {
// //     requireSocket()?.emit("typing:stop", { conversationId });
// //   };

// //   const sendMessage = (conversationId, text) => {
// //     const socket = requireSocket();

// //     if (!socket) {
// //       throw new Error("Socket is not connected");
// //     }

// //     socket.emit("message:send", { conversationId, text });
// //   };

// //   const deleteMessage = (messageId) => {
// //     const socket = requireSocket();

// //     if (!socket) {
// //       console.error("Delete failed: socket is not connected");
// //       return;
// //     }

// //     if (!messageId) {
// //       console.error("Delete failed: messageId is missing");
// //       return;
// //     }

// //     socket.emit("message:delete", { messageId }, (response) => {
// //       if (!response?.success) {
// //         console.error("Delete failed:", response?.message);
// //       }
// //     });
// //   };

// //   return (
// //     <ChatContext.Provider
// //       value={{
// //         users,
// //         conversations,
// //         activeConversation,
// //         messages,

// //         loadingUsers,
// //         loadingConversations,
// //         loadingMessages,

// //         fetchUsers,
// //         searchUsers,
// //         fetchConversations,
// //         createConversation,
// //         selectConversation,
// //         fetchMessages,

// //         sendMessage,
// //         startTyping,
// //         stopTyping,
// //         deleteMessage,
// //       }}
// //     >
// //       {children}
// //     </ChatContext.Provider>
// //   );
// // };

// // export const useChat = () => {
// //   return useContext(ChatContext);
// // };

// // -------------------------------------------------------------------
// import { createContext, useContext, useEffect, useRef, useState } from "react";

// import api from "../services/api";
// import { getSocket, subscribeToSocket } from "../services/socket";
// import { useAuth } from "./AuthContext";

// const ChatContext = createContext(null);

// // --------------------------------
// // Helpers (outside the component so they are created once)
// // --------------------------------

// const requireSocket = () => {
//   const socket = getSocket();
//   return socket && socket.connected ? socket : null;
// };

// const requestPresence = () => {
//   requireSocket()?.emit("presence:request");
// };

// // Applies patchParticipant to every participant of a conversation.
// // Returns the SAME object when nothing changed, so React does not
// // re-render (and effects keyed on it do not re-run) for no reason.
// const patchConversationParticipants = (conversation, patchParticipant) => {
//   if (!conversation?.participants) {
//     return conversation;
//   }

//   let changed = false;

//   const participants = conversation.participants.map((participant) => {
//     const next = patchParticipant(participant);
//     if (next !== participant) {
//       changed = true;
//     }
//     return next;
//   });

//   return changed ? { ...conversation, participants } : conversation;
// };

// export const ChatProvider = ({ children }) => {
//   const { user, loading: authLoading } = useAuth();

//   const [users, setUsers] = useState([]);
//   const [conversations, setConversations] = useState([]);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [messages, setMessages] = useState([]);

//   const [loadingUsers, setLoadingUsers] = useState(false);
//   const [loadingConversations, setLoadingConversations] = useState(false);
//   const [loadingMessages, setLoadingMessages] = useState(false);

//   // Refs let the long-lived socket listeners read the LATEST values
//   // without being re-registered on every change.
//   const activeConversationRef = useRef(null);
//   const userIdRef = useRef(null);
//   const conversationsRef = useRef([]);
//   const searchRequestRef = useRef(0); // id of the most recent user search

//   useEffect(() => {
//     activeConversationRef.current = activeConversation;
//   }, [activeConversation]);

//   useEffect(() => {
//     userIdRef.current = user?._id ?? null;
//   }, [user]);

//   useEffect(() => {
//     conversationsRef.current = conversations;
//   }, [conversations]);

//   // --------------------------------
//   // Real-time socket listeners
//   // --------------------------------

//   useEffect(() => {
//     const handleSocket = (socket) => {
//       // Update one person's presence everywhere it is displayed.
//       const patchEverywhere = (patchParticipant) => {
//         setUsers((previous) => previous.map(patchParticipant));

//         setConversations((previous) =>
//           previous.map((conversation) =>
//             patchConversationParticipants(conversation, patchParticipant)
//           )
//         );

//         setActiveConversation((previous) =>
//           patchConversationParticipants(previous, patchParticipant)
//         );
//       };

//       // ---- incoming message ----
//       const handleIncomingMessage = (message) => {
//         const conversationId =
//           message.conversation?._id || message.conversation?.toString();

//         if (!conversationId) {
//           return;
//         }

//         const isActiveConversation =
//           activeConversationRef.current?._id === conversationId;

//         const senderId = message.sender?._id || message.sender;
//         const isOwnMessage = senderId === userIdRef.current;

//         // Is this conversation already in the sidebar, and did the server
//         // send enough data (populated participants) to build a sidebar row?
//         const isKnownConversation = conversationsRef.current.some(
//           (conversation) => conversation._id === conversationId
//         );

//         const hasUsableConversation =
//           typeof message.conversation === "object" &&
//           Array.isArray(message.conversation.participants) &&
//           message.conversation.participants.every(
//             (participant) => participant && typeof participant === "object"
//           );

//         // Temporary diagnostic: shows in the RECEIVER's browser console.
//         console.log("[chat] incoming message", {
//           messageId: message._id,
//           conversationId,
//           isKnownConversation,
//           hasUsableConversation,
//           isActiveConversation,
//         });

//         // Safety net: a brand-new conversation whose payload is not usable
//         // is loaded from the server, exactly what a page refresh would do.
//         if (!isKnownConversation && !hasUsableConversation) {
//           // eslint-disable-next-line no-use-before-define
//           fetchConversations();
//         }

//         // 1) Only append to the open thread when the message BELONGS to it.
//         //    (Before, every message from every chat was appended here.)
//         if (isActiveConversation) {
//           setMessages((previous) =>
//             previous.some((item) => item._id === message._id)
//               ? previous
//               : [...previous, message]
//           );
//         }

//         // 2) Sidebar: preview, ordering, unread badge.
//         //    Store a light copy so we do not nest the whole conversation
//         //    (with all participants) inside its own lastMessage.
//         const lastMessage = { ...message, conversation: conversationId };

//         setConversations((previous) => {
//           const existing = previous.find(
//             (conversation) => conversation._id === conversationId
//           );

//           if (existing) {
//             // Same message delivered twice (two event names, or a
//             // reconnect)? Do not count it twice.
//             if (String(existing.lastMessage?._id) === String(message._id)) {
//               return previous;
//             }

//             const shouldCountUnread = !isActiveConversation && !isOwnMessage;

//             const updated = {
//               ...existing,
//               lastMessage,
//               lastMessageAt: message.createdAt,
//               unreadCount:
//                 (existing.unreadCount || 0) + (shouldCountUnread ? 1 : 0),
//             };

//             return [
//               updated,
//               ...previous.filter(
//                 (conversation) => conversation._id !== conversationId
//               ),
//             ];
//           }

//           // Brand-new conversation (recipient has never opened it):
//           // the server sends the populated conversation with the message.
//           if (hasUsableConversation) {
//             return [
//               {
//                 ...message.conversation,
//                 lastMessage,
//                 lastMessageAt: message.createdAt,
//                 unreadCount: isActiveConversation || isOwnMessage ? 0 : 1,
//               },
//               ...previous,
//             ];
//           }

//           return previous;
//         });
//       };

//       const handleMessageError = (error) => {
//         console.error("Socket message error:", error);
//       };

//       // ---- message deleted ----
//       const handleMessageDeleted = ({
//         messageId,
//         conversationId,
//         lastMessage,
//         lastMessageAt,
//       }) => {
//         setMessages((previous) =>
//           previous.filter((message) => message._id !== messageId)
//         );

//         setConversations((previous) =>
//           previous.map((conversation) => {
//             if (
//               conversation._id !== conversationId ||
//               conversation.lastMessage?._id !== messageId
//             ) {
//               return conversation;
//             }

//             return { ...conversation, lastMessage, lastMessageAt };
//           })
//         );
//       };

//       // ---- presence ----
//       const handleUserStatus = ({ userId, isOnline, lastSeen }) => {
//         patchEverywhere((participant) =>
//           participant._id === userId
//             ? { ...participant, isOnline, lastSeen }
//             : participant
//         );
//       };

//       // Full picture sent by the server: anyone not in the list is offline.
//       const handlePresenceSnapshot = ({ onlineUserIds }) => {
//         const onlineSet = new Set(onlineUserIds);

//         patchEverywhere((participant) => {
//           const isOnline = onlineSet.has(String(participant._id));

//           return participant.isOnline === isOnline
//             ? participant
//             : { ...participant, isOnline };
//         });
//       };

//       socket.on("message:receive", handleIncomingMessage);
//       // Older server builds notify each user's personal room with this
//       // event name. The handler is idempotent, so listening to both is safe
//       // and the sidebar updates even if the recipient has not opened the chat.
//       socket.on("conversation:message", handleIncomingMessage);
//       socket.on("message:error", handleMessageError);
//       socket.on("message:delete", handleMessageDeleted);
//       socket.on("user:online", handleUserStatus);
//       socket.on("user:offline", handleUserStatus);
//       socket.on("presence:snapshot", handlePresenceSnapshot);

//       // Ask for the snapshot only AFTER the listener above exists, and again
//       // on every reconnect. (Anything the server pushes during the handshake
//       // can arrive before listeners are attached and be lost.)
//       socket.on("connect", requestPresence);

//       if (socket.connected) {
//         requestPresence();
//       }

//       return () => {
//         socket.off("message:receive", handleIncomingMessage);
//         socket.off("conversation:message", handleIncomingMessage);
//         socket.off("message:error", handleMessageError);
//         socket.off("message:delete", handleMessageDeleted);
//         socket.off("user:online", handleUserStatus);
//         socket.off("user:offline", handleUserStatus);
//         socket.off("presence:snapshot", handlePresenceSnapshot);
//         socket.off("connect", requestPresence);
//       };
//     };

//     const unsubscribe = subscribeToSocket(handleSocket);

//     return () => {
//       unsubscribe();
//     };
//   }, []);

//   // --------------------------------
//   // Join the active conversation's room (for typing indicators).
//   // Keyed on the _id, not the whole object: presence updates create a new
//   // object, which used to re-run this effect and re-join needlessly.
//   // Re-joins after a reconnect, because rooms are lost when a socket drops.
//   // --------------------------------

//   const activeConversationId = activeConversation?._id;

//   useEffect(() => {
//     if (!activeConversationId) {
//       return;
//     }

//     const handleSocket = (socket) => {
//       const join = () => socket.emit("conversation:join", activeConversationId);

//       if (socket.connected) {
//         join();
//       }

//       socket.on("connect", join);

//       return () => {
//         socket.off("connect", join);
//       };
//     };

//     const unsubscribe = subscribeToSocket(handleSocket);

//     return () => {
//       unsubscribe();
//     };
//   }, [activeConversationId]);

//   // --------------------------------
//   // REST: users
//   // --------------------------------

//   const fetchUsers = async () => {
//     try {
//       setLoadingUsers(true);
//       const response = await api.get("/users");
//       setUsers(response.data.users);
//       requestPresence(); // REST data can be older than live presence
//     } catch (error) {
//       console.error("Failed to fetch users:", error);
//     } finally {
//       setLoadingUsers(false);
//     }
//   };

//   const searchUsers = async (query) => {
//     // Every call gets an id. Only the NEWEST call may touch state, so a slow
//     // response for "ab" can never overwrite the results for "abc".
//     const requestId = ++searchRequestRef.current;

//     if (!query.trim()) {
//       setUsers([]);
//       setLoadingUsers(false);
//       return;
//     }

//     try {
//       setLoadingUsers(true);

//       const response = await api.get(
//         `/users/search?q=${encodeURIComponent(query)}`
//       );

//       if (requestId !== searchRequestRef.current) {
//         return;
//       }

//       setUsers(response.data.users);
//       requestPresence();
//     } catch (error) {
//       console.error("Failed to search users:", error);
//     } finally {
//       if (requestId === searchRequestRef.current) {
//         setLoadingUsers(false);
//       }
//     }
//   };

//   // --------------------------------
//   // REST: conversations
//   // --------------------------------

//   const fetchConversations = async () => {
//     try {
//       setLoadingConversations(true);
//       const response = await api.get("/conversations");
//       setConversations((previous) =>
//         response.data.conversations.map((conversation) => {
//           const before = previous.find((item) => item._id === conversation._id);

//           const hasPopulatedLastMessage =
//             conversation.lastMessage &&
//             typeof conversation.lastMessage === "object";

//           return {
//             ...conversation,
//             lastMessage: hasPopulatedLastMessage
//               ? conversation.lastMessage
//               : before?.lastMessage ?? conversation.lastMessage,
//             unreadCount: before?.unreadCount || 0,
//           };
//         })
//       );
//       requestPresence();
//     } catch (error) {
//       console.error("Failed to fetch conversations:", error);
//     } finally {
//       setLoadingConversations(false);
//     }
//   };

//   // --------------------------------
//   // REST: messages
//   // --------------------------------

//   const fetchMessages = async (conversationId) => {
//     try {
//       setLoadingMessages(true);
//       const response = await api.get(
//         `/messages/${conversationId}?page=1&limit=30`
//       );
//       setMessages(response.data.messages);
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//       setMessages([]);
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   // --------------------------------
//   // Create / open a conversation
//   // --------------------------------

//   const createConversation = async (userId) => {
//     try {
//       const response = await api.post("/conversations", { userId });
//       const conversation = response.data.conversation;

//       setConversations((previous) => {
//         const exists = previous.some((item) => item._id === conversation._id);

//         if (exists) {
//           return previous.map((item) => {
//             if (item._id !== conversation._id) {
//               return item;
//             }

//             // The POST response often has lastMessage as a bare ObjectId
//             // string (not populated). Never let it overwrite the populated
//             // message object we already have in the sidebar.
//             const hasPopulatedLastMessage =
//               conversation.lastMessage &&
//               typeof conversation.lastMessage === "object";

//             return {
//               ...item,
//               ...conversation,
//               lastMessage: hasPopulatedLastMessage
//                 ? conversation.lastMessage
//                 : item.lastMessage,
//               lastMessageAt: conversation.lastMessageAt ?? item.lastMessageAt,
//               unreadCount: 0,
//             };
//           });
//         }

//         return [{ ...conversation, unreadCount: 0 }, ...previous];
//       });

//       // Update the ref immediately so a message arriving before the next
//       // render is already treated as "belongs to the open chat".
//       activeConversationRef.current = conversation;
//       setActiveConversation(conversation);
//       setMessages([]);

//       await fetchMessages(conversation._id);

//       return conversation;
//     } catch (error) {
//       console.error("Failed to create conversation:", error);
//       throw error;
//     }
//   };

//   const selectConversation = async (conversation) => {
//     activeConversationRef.current = conversation;
//     setActiveConversation(conversation);

//     // Don't flash the previous thread while the new one loads.
//     setMessages([]);

//     setConversations((previous) =>
//       previous.map((item) =>
//         item._id === conversation._id ? { ...item, unreadCount: 0 } : item
//       )
//     );

//     await fetchMessages(conversation._id);
//   };

//   // --------------------------------
//   // Initial data / reset on logout
//   // --------------------------------

//   useEffect(() => {
//     if (authLoading) {
//       return;
//     }

//     if (!user) {
//       activeConversationRef.current = null;
//       setUsers([]);
//       setConversations([]);
//       setActiveConversation(null);
//       setMessages([]);
//       return;
//     }

//     fetchUsers();
//     fetchConversations();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, authLoading]);

//   // --------------------------------
//   // Typing / send / delete
//   // --------------------------------

//   const startTyping = (conversationId) => {
//     requireSocket()?.emit("typing:start", { conversationId });
//   };

//   const stopTyping = (conversationId) => {
//     requireSocket()?.emit("typing:stop", { conversationId });
//   };

//   const sendMessage = (conversationId, text) => {
//     const socket = requireSocket();

//     if (!socket) {
//       throw new Error("Socket is not connected");
//     }

//     socket.emit("message:send", { conversationId, text });
//   };

//   const deleteMessage = (messageId) => {
//     const socket = requireSocket();

//     if (!socket) {
//       console.error("Delete failed: socket is not connected");
//       return;
//     }

//     if (!messageId) {
//       console.error("Delete failed: messageId is missing");
//       return;
//     }

//     socket.emit("message:delete", { messageId }, (response) => {
//       if (!response?.success) {
//         console.error("Delete failed:", response?.message);
//       }
//     });
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         users,
//         conversations,
//         activeConversation,
//         messages,

//         loadingUsers,
//         loadingConversations,
//         loadingMessages,

//         fetchUsers,
//         searchUsers,
//         fetchConversations,
//         createConversation,
//         selectConversation,
//         fetchMessages,

//         sendMessage,
//         startTyping,
//         stopTyping,
//         deleteMessage,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   return useContext(ChatContext);
// };

// ----------------------------------------------------------------
import { createContext, useContext, useEffect, useRef, useState } from "react";

import api from "../services/api";
import { getSocket, subscribeToSocket } from "../services/socket";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

// --------------------------------
// Helpers (outside the component so they are created once)
// --------------------------------

const requireSocket = () => {
  const socket = getSocket();
  return socket && socket.connected ? socket : null;
};

const requestPresence = () => {
  requireSocket()?.emit("presence:request");
  
};
const getId = (value) => {
  if (value == null) return null;

  if (typeof value === "object") {
    return value._id != null ? String(value._id) : null;
  }

  return String(value);
};

const getConversationId = (message) =>
  getId(message?.conversation);

// Applies patchParticipant to every participant of a conversation.
// Returns the SAME object when nothing changed, so React does not
// re-render (and effects keyed on it do not re-run) for no reason.
const patchConversationParticipants = (conversation, patchParticipant) => {
  if (!conversation?.participants) {
    return conversation;
  }

  let changed = false;

  const participants = conversation.participants.map((participant) => {
    const next = patchParticipant(participant);
    if (next !== participant) {
      changed = true;
    }
    return next;
  });

  return changed ? { ...conversation, participants } : conversation;
};

export const ChatProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Refs let the long-lived socket listeners read the LATEST values
  // without being re-registered on every change.
  const activeConversationRef = useRef(null);
  const userIdRef = useRef(null);
  const conversationsRef = useRef([]);
  const searchRequestRef = useRef(0); // id of the most recent user search
const messageFetchRequestRef = useRef(0);


  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  useEffect(() => {
    userIdRef.current = user?._id ?? null;
  }, [user]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // --------------------------------
  // Real-time socket listeners
  // --------------------------------

  useEffect(() => {
    const handleSocket = (socket) => {
      // Update one person's presence everywhere it is displayed.
      const patchEverywhere = (patchParticipant) => {
        setUsers((previous) => previous.map(patchParticipant));

        setConversations((previous) =>
          previous.map((conversation) =>
            patchConversationParticipants(conversation, patchParticipant)
          )
        );

        setActiveConversation((previous) =>
          patchConversationParticipants(previous, patchParticipant)
        );
      };

      // ---- incoming message ----
      const handleIncomingMessage = (message) => {
        // const conversationId =
        //   message.conversation?._id || message.conversation?.toString();

        // if (!conversationId) {
        //   return;
        // }

        // const isActiveConversation =
        //   activeConversationRef.current?._id === conversationId;

        // const senderId = message.sender?._id || message.sender;
        // const isOwnMessage = senderId === userIdRef.current;

        // // Is this conversation already in the sidebar, and did the server
        // // send enough data (populated participants) to build a sidebar row?
        // const isKnownConversation = conversationsRef.current.some(
        //   (conversation) => conversation._id === conversationId
        // );

        const conversationId = getConversationId(message);

if (!conversationId) {
  return;
}

const isActiveConversation =
  getId(activeConversationRef.current?._id) === conversationId;

const senderId = getId(message.sender);
const isOwnMessage =
  senderId != null &&
  senderId === getId(userIdRef.current);

const isKnownConversation = conversationsRef.current.some(
  (conversation) => getId(conversation._id) === conversationId
);


// Only the recipient acknowledges delivery.
if (!isOwnMessage && message._id) {
  socket.emit("message:delivered", {
    messageId: message._id,
  });

  // If the recipient is already viewing this conversation,
  // acknowledge that the message has been read.
  if (isActiveConversation) {
    socket.emit("message:read", {
      conversationId,
    });
  }
}
        const hasUsableConversation =
          typeof message.conversation === "object" &&
          Array.isArray(message.conversation.participants) &&
          message.conversation.participants.every(
            (participant) => participant && typeof participant === "object"
          );

        // Temporary diagnostic: shows in the RECEIVER's browser console.
        console.log("[chat] incoming message", {
          messageId: message._id,
          conversationId,
          isKnownConversation,
          hasUsableConversation,
          isActiveConversation,
        });

        // Safety net: a brand-new conversation whose payload is not usable
        // is loaded from the server, exactly what a page refresh would do.
        if (!isKnownConversation && !hasUsableConversation) {
          // eslint-disable-next-line no-use-before-define
          fetchConversations();
        }

        // 1) Only append to the open thread when the message BELONGS to it.
        //    (Before, every message from every chat was appended here.)
        if (isActiveConversation) {
          // setMessages((previous) =>
          //   previous.some((item) => item._id === message._id)
          //     ? previous
          //     : [...previous, message]
          // );

          setMessages((previous) =>
  previous.some(
    (item) => String(item._id) === String(message._id)
  )
    ? previous
    : [...previous, message]
);
        }

        // 2) Sidebar: preview, ordering, unread badge.
        //    Store a light copy so we do not nest the whole conversation
        //    (with all participants) inside its own lastMessage.
        const lastMessage = { ...message, conversation: conversationId };

        setConversations((previous) => {
          // const existing = previous.find(
          //   (conversation) => conversation._id === conversationId
          // );
const existing = previous.find(
  (conversation) => String(conversation._id) === String(conversationId)
);
          if (existing) {
            // Same message delivered twice (two event names, or a
            // reconnect)? Do not count it twice.
            if (String(existing.lastMessage?._id) === String(message._id)) {
              return previous;
            }

            const shouldCountUnread = !isActiveConversation && !isOwnMessage;

            const updated = {
              ...existing,
              lastMessage,
              lastMessageAt: message.createdAt,
              unreadCount:
                (existing.unreadCount || 0) + (shouldCountUnread ? 1 : 0),
              // Ids of the unread messages. Needed so that deleting one of
              // them can lower the badge by exactly one.
              unreadMessageIds: shouldCountUnread
                ? [...(existing.unreadMessageIds || []), message._id]
                : existing.unreadMessageIds || [],
            };

            return [
              updated,
              ...previous.filter(
                (conversation) => conversation._id !== conversationId
              ),
            ];
          }

          // Brand-new conversation (recipient has never opened it):
          // the server sends the populated conversation with the message.
          if (hasUsableConversation) {
            return [
              {
                ...message.conversation,
                lastMessage,
                lastMessageAt: message.createdAt,
                unreadCount: isActiveConversation || isOwnMessage ? 0 : 1,
                unreadMessageIds:
                  isActiveConversation || isOwnMessage ? [] : [message._id],
              },
              ...previous,
            ];
          }

          return previous;
        });
      };

      const handleMessageError = (error) => {
        console.error("Socket message error:", error);
      };

      // ---- message deleted ----
      const handleMessageDeleted = ({
        messageId,
        conversationId,
        lastMessage,
        lastMessageAt,
      }) => {
        setMessages((previous) =>
          previous.filter((message) => message._id !== messageId)
        );

        // Temporary diagnostic: shows in the RECEIVER's browser console.
        const tracked = conversationsRef.current.find(
          (conversation) => conversation._id === conversationId
        );

        console.log("[chat] message deleted", {
          messageId,
          conversationId,
          unreadCount: tracked?.unreadCount,
          unreadMessageIds: tracked?.unreadMessageIds,
          wasCountedAsUnread: (tracked?.unreadMessageIds || []).some(
            (id) => String(id) === String(messageId)
          ),
        });

        setConversations((previous) =>
          previous.map((conversation) => {
            if (conversation._id !== conversationId) {
              return conversation;
            }

            const next = { ...conversation };

            // Sidebar preview: the deleted message was the latest one.
            if (String(conversation.lastMessage?._id) === String(messageId)) {
              next.lastMessage = lastMessage;
              next.lastMessageAt = lastMessageAt;
            }

            // Unread badge: only lower it if the deleted message was one of
            // the messages that had been counted as unread.
            const unreadIds = conversation.unreadMessageIds || [];

            if (unreadIds.some((id) => String(id) === String(messageId))) {
              next.unreadMessageIds = unreadIds.filter(
                (id) => String(id) !== String(messageId)
              );
              next.unreadCount = Math.max(
                0,
                (conversation.unreadCount || 0) - 1
              );
            }

            return next;
          })
        );
      };


      const handleMessageStatus = ({
  messageId,
  conversationId,
  status,
  deliveredAt,
  readAt,
}) => {
  const targetMessageId = String(messageId);
  const targetConversationId = String(conversationId);

  const updateStatus = (message) => {
    if (String(message._id) !== targetMessageId) {
      return message;
    }

    return {
      ...message,
      status,
      deliveredAt: deliveredAt ?? message.deliveredAt,
      readAt: readAt ?? message.readAt,
    };
  };

  setMessages((previous) => previous.map(updateStatus));

  setConversations((previous) =>
    previous.map((conversation) => {
      if (String(conversation._id) !== targetConversationId) {
        return conversation;
      }

      if (
        !conversation.lastMessage ||
        String(conversation.lastMessage._id) !== targetMessageId
      ) {
        return conversation;
      }

      return {
        ...conversation,
        lastMessage: updateStatus(conversation.lastMessage),
      };
    })
  );
};

      // ---- presence ----
      
const handleUserStatus = ({ userId, isOnline, lastSeen }) => {
  if (userId == null) return;

  console.log("[presence] status event received:", {
    userId,
    isOnline,
  });

  const targetUserId = String(userId);

  patchEverywhere((participant) => {
    const participantId = String(participant._id);

    if (participantId !== targetUserId) {
      return participant;
    }

    console.log("[presence] updating participant:", {
      participantId,
      isOnline,
    });

    return {
      ...participant,
      isOnline,
      lastSeen,
    };
  });
};


      // Full picture sent by the server: anyone not in the list is offline.
      const handlePresenceSnapshot = ({ onlineUserIds }) => {
        const onlineSet = new Set(onlineUserIds);

        patchEverywhere((participant) => {
          const isOnline = onlineSet.has(String(participant._id));

          return participant.isOnline === isOnline
            ? participant
            : { ...participant, isOnline };
        });
      };

      socket.on("message:receive", handleIncomingMessage);
      // Older server builds notify each user's personal room with this
      // event name. The handler is idempotent, so listening to both is safe
      // and the sidebar updates even if the recipient has not opened the chat.
      socket.on("conversation:message", handleIncomingMessage);
      socket.on("message:error", handleMessageError);
      socket.on("message:delete", handleMessageDeleted);
      socket.on("user:online", handleUserStatus);
      socket.on("user:offline", handleUserStatus);
      socket.on("presence:snapshot", handlePresenceSnapshot);
     socket.on("message:status", handleMessageStatus);

      // Ask for the snapshot only AFTER the listener above exists, and again
      // on every reconnect. (Anything the server pushes during the handshake
      // can arrive before listeners are attached and be lost.)
      socket.on("connect", requestPresence);

      if (socket.connected) {
        requestPresence();
      }

      return () => {
        socket.off("message:receive", handleIncomingMessage);
        socket.off("conversation:message", handleIncomingMessage);
        socket.off("message:error", handleMessageError);
        socket.off("message:delete", handleMessageDeleted);
        socket.off("user:online", handleUserStatus);
        socket.off("user:offline", handleUserStatus);
        socket.off("presence:snapshot", handlePresenceSnapshot);
        socket.off("connect", requestPresence);
        socket.off("message:status", handleMessageStatus);
      };
    };

    const unsubscribe = subscribeToSocket(handleSocket);

    return () => {
      unsubscribe();
    };
  }, []);

  // --------------------------------
  // Join the active conversation's room (for typing indicators).
  // Keyed on the _id, not the whole object: presence updates create a new
  // object, which used to re-run this effect and re-join needlessly.
  // Re-joins after a reconnect, because rooms are lost when a socket drops.
  // --------------------------------

  const activeConversationId = activeConversation?._id;

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    const handleSocket = (socket) => {
      const join = () => socket.emit("conversation:join", activeConversationId);

      if (socket.connected) {
        join();
      }

      socket.on("connect", join);

      return () => {
        socket.off("connect", join);
      };
    };

    const unsubscribe = subscribeToSocket(handleSocket);

    return () => {
      unsubscribe();
    };
  }, [activeConversationId]);

  // --------------------------------
  // REST: users
  // --------------------------------

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get("/users");
      setUsers(response.data.users);
      requestPresence(); // REST data can be older than live presence
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const searchUsers = async (query) => {
    // Every call gets an id. Only the NEWEST call may touch state, so a slow
    // response for "ab" can never overwrite the results for "abc".
    const requestId = ++searchRequestRef.current;

    if (!query.trim()) {
      setUsers([]);
      setLoadingUsers(false);
      return;
    }

    try {
      setLoadingUsers(true);

      const response = await api.get(
        `/users/search?q=${encodeURIComponent(query)}`
      );

      if (requestId !== searchRequestRef.current) {
        return;
      }

      setUsers(response.data.users);
      requestPresence();
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      if (requestId === searchRequestRef.current) {
        setLoadingUsers(false);
      }
    }
  };

  // --------------------------------
  // REST: conversations
  // --------------------------------

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const response = await api.get("/conversations");
      // setConversations((previous) =>
      //   response.data.conversations.map((conversation) => {
      //     const before = previous.find((item) => item._id === conversation._id);

      //     const hasPopulatedLastMessage =
      //       conversation.lastMessage &&
      //       typeof conversation.lastMessage === "object";

      //     return {
      //       ...conversation,
      //       lastMessage: hasPopulatedLastMessage
      //         ? conversation.lastMessage
      //         : before?.lastMessage ?? conversation.lastMessage,
      //       unreadCount: before?.unreadCount || 0,
      //       unreadMessageIds: before?.unreadMessageIds || [],
      //     };
      //   })
      // );
      
setConversations((previous) =>
  response.data.conversations.map((conversation) => {
    const before = previous.find(
      (item) => String(item._id) === String(conversation._id)
    );

    const hasPopulatedLastMessage =
      conversation.lastMessage &&
      typeof conversation.lastMessage === "object";

    return {
      ...conversation,
      lastMessage: hasPopulatedLastMessage
        ? conversation.lastMessage
        : before?.lastMessage ?? conversation.lastMessage,

      // Prefer the backend count if the API supplies one.
      unreadCount:
        conversation.unreadCount ?? before?.unreadCount ?? 0,

      unreadMessageIds:
        before?.unreadMessageIds || [],
    };
  })
);

      requestPresence();
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // --------------------------------
  // REST: messages
  // --------------------------------

  // const fetchMessages = async (conversationId) => {
  //   try {
  //     setLoadingMessages(true);
  //     const response = await api.get(
  //       `/messages/${conversationId}?page=1&limit=30`
  //     );
  //     setMessages(response.data.messages);
  //   } catch (error) {
  //     console.error("Failed to fetch messages:", error);
  //     setMessages([]);
  //   } finally {
  //     setLoadingMessages(false);
  //   }
  // };
  //main and working one
// const fetchMessages = async (conversationId) => {
//   const requestId = ++messageFetchRequestRef.current;

//   try {
//     setLoadingMessages(true);

//     const response = await api.get(
//       `/messages/${conversationId}?page=1&limit=30`
//     );

//     if (requestId !== messageFetchRequestRef.current) {
//       return;
//     }

//     setMessages(response.data.messages);
//   } catch (error) {
//     if (requestId !== messageFetchRequestRef.current) {
//       return;
//     }

//     console.error("Failed to fetch messages:", error);
//     setMessages([]);
//   } finally {
//     if (requestId === messageFetchRequestRef.current) {
//       setLoadingMessages(false);
//     }
//   }
// };


const fetchMessages = async (conversationId) => {
  const requestId = ++messageFetchRequestRef.current;
  const requestedConversationId = String(conversationId);

  try {
    setLoadingMessages(true);

    const response = await api.get(
      `/messages/${conversationId}?page=1&limit=30`
    );

    // Ignore responses from an older request.
    if (requestId !== messageFetchRequestRef.current) {
      return;
    }

    // Do not apply messages if the user has switched conversations.
    if (
      String(activeConversationRef.current?._id) !==
      requestedConversationId
    ) {
      return;
    }

    const serverMessages = response.data.messages || [];

    setMessages((previous) => {
      const merged = [...serverMessages];
      const knownIds = new Set(
        merged.map((message) => String(message._id))
      );

      // Preserve messages received through Socket.IO while the API
      // request was in progress.
      for (const message of previous) {
        const messageConversationId = getConversationId(message);

        if (
          messageConversationId === requestedConversationId &&
          !knownIds.has(String(message._id))
        ) {
          merged.push(message);
          knownIds.add(String(message._id));
        }
      }

      return merged;
    });
  } catch (error) {
    if (requestId !== messageFetchRequestRef.current) {
      return;
    }

    console.error("Failed to fetch messages:", error);
    setMessages([]);
  } finally {
    if (requestId === messageFetchRequestRef.current) {
      setLoadingMessages(false);
    }
  }
};

  // --------------------------------
  // Create / open a conversation
  // --------------------------------

  const createConversation = async (userId) => {
    try {
      const response = await api.post("/conversations", { userId });
      const conversation = response.data.conversation;

      setConversations((previous) => {
        const exists = previous.some((item) => item._id === conversation._id);

        if (exists) {
          return previous.map((item) => {
            if (item._id !== conversation._id) {
              return item;
            }

            // The POST response often has lastMessage as a bare ObjectId
            // string (not populated). Never let it overwrite the populated
            // message object we already have in the sidebar.
            const hasPopulatedLastMessage =
              conversation.lastMessage &&
              typeof conversation.lastMessage === "object";

            return {
              ...item,
              ...conversation,
              lastMessage: hasPopulatedLastMessage
                ? conversation.lastMessage
                : item.lastMessage,
              lastMessageAt: conversation.lastMessageAt ?? item.lastMessageAt,
              unreadCount: 0,
              unreadMessageIds: [],
            };
          });
        }

        return [
          { ...conversation, unreadCount: 0, unreadMessageIds: [] },
          ...previous,
        ];
      });

      // Update the ref immediately so a message arriving before the next
      // render is already treated as "belongs to the open chat".
      activeConversationRef.current = conversation;
      setActiveConversation(conversation);
      setMessages([]);

      await fetchMessages(conversation._id);

      return conversation;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      throw error;
    }
  };

  // const selectConversation = async (conversation) => {
  //   activeConversationRef.current = conversation;
  //   setActiveConversation(conversation);

  //   // Don't flash the previous thread while the new one loads.
  //   setMessages([]);

  //   setConversations((previous) =>
  //     previous.map((item) =>
  //       item._id === conversation._id
  //         ? { ...item, unreadCount: 0, unreadMessageIds: [] }
  //         : item
  //     )
  //   );

  //   await fetchMessages(conversation._id);
  // };

  const selectConversation = async (conversation) => {
  activeConversationRef.current = conversation;
  setActiveConversation(conversation);
  setMessages([]);

  setConversations((previous) =>
    previous.map((item) =>
      String(item._id) === String(conversation._id)
        ? { ...item, unreadCount: 0, unreadMessageIds: [] }
        : item
    )
  );

  await fetchMessages(conversation._id);

  // Ask the backend to mark incoming messages as read.
  requireSocket()?.emit("message:read", {
    conversationId: conversation._id,
  });
};
  // --------------------------------
  // Initial data / reset on logout
  // --------------------------------

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      activeConversationRef.current = null;
      setUsers([]);
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
      return;
    }

    fetchUsers();
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // --------------------------------
  // Typing / send / delete
  // --------------------------------

  const startTyping = (conversationId) => {
    requireSocket()?.emit("typing:start", { conversationId });
  };

  const stopTyping = (conversationId) => {
    requireSocket()?.emit("typing:stop", { conversationId });
  };

 

//   const sendMessage = (conversationId, text) => {
//   const socket = requireSocket();

//   if (!socket) {
//     return Promise.reject(new Error("Socket is not connected"));
//   }

//   return new Promise((resolve, reject) => {
//     socket.timeout(10000).emit(
//       "message:send",
//       { conversationId, text },
//       (timeoutError, response) => {
//         if (timeoutError) {
//           reject(new Error("The server did not confirm the message"));
//           return;
//         }

//         if (!response?.success) {
//           reject(
//             new Error(response?.message || "Failed to send message")
//           );
//           return;
//         }

//         resolve(response.message);
//       }
//     );
//   });
// };

const sendMessage = (conversationId, text) => {
  const socket = requireSocket();

  if (!socket) {
    return Promise.reject(new Error("Socket is not connected"));
  }

  return new Promise((resolve, reject) => {
    socket.timeout(10000).emit(
      "message:send",
      { conversationId, text },
      (timeoutError, response) => {
        if (timeoutError) {
          reject(new Error("The server did not confirm the message"));
          return;
        }

        if (!response?.success || !response.message) {
          reject(
            new Error(response?.message || "Failed to send message")
          );
          return;
        }

        const message = response.message;
        const messageConversationId = getConversationId(message);

        // Update the visible thread immediately.
        if (
          getId(activeConversationRef.current?._id) ===
          String(conversationId)
        ) {
          setMessages((previous) =>
            previous.some(
              (item) => String(item._id) === String(message._id)
            )
              ? previous
              : [...previous, message]
          );
        }

        // Update the sidebar preview without creating a duplicate.
        setConversations((previous) => {
          const index = previous.findIndex(
            (item) => String(item._id) === String(conversationId)
          );

          if (index === -1) {
            return previous;
          }

          const existing = previous[index];

          if (
            String(existing.lastMessage?._id) === String(message._id)
          ) {
            return previous;
          }

          const updated = {
            ...existing,
            lastMessage: {
              ...message,
              conversation: messageConversationId,
            },
            lastMessageAt: message.createdAt,
          };

          return [
            updated,
            ...previous.filter(
              (item) => String(item._id) !== String(conversationId)
            ),
          ];
        });

        resolve(message);
      }
    );
  });
};
  

const deleteMessage = (messageId) => {
    const socket = requireSocket();

    if (!socket) {
      console.error("Delete failed: socket is not connected");
      return;
    }

    if (!messageId) {
      console.error("Delete failed: messageId is missing");
      return;
    }

    socket.emit("message:delete", { messageId }, (response) => {
      if (!response?.success) {
        console.error("Delete failed:", response?.message);
      }
    });
  };

  return (
    <ChatContext.Provider
      value={{
        users,
        conversations,
        activeConversation,
        messages,

        loadingUsers,
        loadingConversations,
        loadingMessages,

        fetchUsers,
        searchUsers,
        fetchConversations,
        createConversation,
        selectConversation,
        fetchMessages,

        sendMessage,
        startTyping,
        stopTyping,
        deleteMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};