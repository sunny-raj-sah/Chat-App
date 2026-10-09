import { createContext, useContext, useEffect, useState ,useRef} from "react";

import { subscribeToSocket } from "../services/socket";

import api from "../services/api";
import { useAuth } from "./AuthContext";


const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [activeConversation, setActiveConversation] = useState(null);
  const activeConversationRef = useRef(null);

  

  const [messages, setMessages] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);

  const [loadingConversations, setLoadingConversations] = useState(false);

  const [loadingMessages, setLoadingMessages] = useState(false);

   
 useEffect(() => {
  activeConversationRef.current = activeConversation;
}, [activeConversation]);

  // --------------------------------
  // Real-time socket message handling
  // --------------------------------

  useEffect(() => {
    const handleSocket = (socket) => {
      console.log("ChatContext: Socket is ready:", socket.id);
 
      const handleIncomingMessage = (message) => {
         console.log("📩 Incoming message received:", message);
  console.log("📦 Conversation payload:", message.conversation);

        const messageConversationId =
          message.conversation?._id || message.conversation?.toString();
          

  console.log("🆔 Conversation ID:", messageConversationId);

           const isActiveConversation =
  activeConversationRef.current?._id === messageConversationId;
  
        // --------------------------------
        // Add message to current chat
        // --------------------------------

        setMessages((previous) => {
          const alreadyExists = previous.some(
            (item) => item._id === message._id,
          );

          if (alreadyExists) {
            return previous;
          }

          return [...previous, message];
        });

        // --------------------------------
        // Update sidebar conversation
        // --------------------------------

        
        // setConversations((previous) => {
        //   const updated = previous.map((conversation) => {
        //     if (conversation._id !== messageConversationId) {
        //       return conversation;
        //     }

        //     return {
        //       ...conversation,

        //       lastMessage: message,

        //       lastMessageAt: message.createdAt,
        //     };
        //   });

        //   return updated.sort((a, b) => {
        //     const dateA = new Date(a.lastMessageAt || a.updatedAt || 0);

        //     const dateB = new Date(b.lastMessageAt || b.updatedAt || 0);

        //     return dateB - dateA;
        //   });
        // });
 setConversations((previous) => {
  const existingConversation = previous.find(
    (conversation) => conversation._id === messageConversationId
  );

  // Conversation already exists in the sidebar
  if (existingConversation) {
    const updatedConversation = {
      ...existingConversation,
      lastMessage: message,
      lastMessageAt: message.createdAt,

      // Increase unread only when this conversation is not open
      unreadCount: isActiveConversation
        ? existingConversation.unreadCount || 0
        : (existingConversation.unreadCount || 0) + 1,
    };

    // Move the updated conversation to the top
    return [
      updatedConversation,
      ...previous.filter(
        (conversation) => conversation._id !== messageConversationId
      ),
    ];
  }

  // Conversation does not exist in the sidebar yet
  if (message.conversation) {
    const newConversation = {
      ...message.conversation,
      lastMessage: message,
      lastMessageAt: message.createdAt,

      // New conversation = one unread message
      unreadCount: isActiveConversation ? 0 : 1,
    };

    return [newConversation, ...previous];
  }

  return previous;
});
      };

 
      const handleMessageError = (error) => {
        console.error("Socket message error:", error);
      };

      // --------------------------------
      // Real-time message deletion
      // --------------------------------

       
      const handleMessageDeleted = ({
        messageId,
        conversationId,
        lastMessage,
        lastMessageAt,
      }) => {
        console.log("ChatContext: message deleted:", messageId);

        setMessages((previous) =>
          previous.filter((message) => message._id !== messageId),
        );

        setConversations((previous) =>
          previous.map((conversation) => {
            if (conversation._id !== conversationId) {
              return conversation;
            }

            if (conversation.lastMessage?._id === messageId) {
              return {
                ...conversation,

                lastMessage: lastMessage,

                lastMessageAt: lastMessageAt,
              };
            }

            return conversation;
          }),
        );
      };
      // --------------------------------
      // User online
      // --------------------------------

      const handleUserOnline = ({ userId, isOnline, lastSeen }) => {
        console.log("User came online:", userId);

        // Update users
        setUsers((previous) =>
          previous.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  isOnline,
                  lastSeen,
                }
              : user,
          ),
        );

        // Update conversations
        setConversations((previous) =>
          previous.map((conversation) => ({
            ...conversation,

            participants: conversation.participants.map((participant) =>
              participant._id === userId
                ? {
                    ...participant,
                    isOnline,
                    lastSeen,
                  }
                : participant,
            ),
          })),
        );

        // Update currently active conversation
        setActiveConversation((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,

            participants: previous.participants.map((participant) =>
              participant._id === userId
                ? {
                    ...participant,
                    isOnline,
                    lastSeen,
                  }
                : participant,
            ),
          };
        });
      };

      // --------------------------------
      // User offline
      // --------------------------------

      const handleUserOffline = ({ userId, isOnline, lastSeen }) => {
        console.log("User went offline:", userId);

        // Update users
        setUsers((previous) =>
          previous.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  isOnline,
                  lastSeen,
                }
              : user,
          ),
        );

        // Update conversations
        setConversations((previous) =>
          previous.map((conversation) => ({
            ...conversation,

            participants: conversation.participants.map((participant) =>
              participant._id === userId
                ? {
                    ...participant,
                    isOnline,
                    lastSeen,
                  }
                : participant,
            ),
          })),
        );

        // Update currently active conversation
        setActiveConversation((previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,

            participants: previous.participants.map((participant) =>
              participant._id === userId
                ? {
                    ...participant,
                    isOnline,
                    lastSeen,
                  }
                : participant,
            ),
          };
        });
      };
      socket.on("message:receive", handleIncomingMessage);

      socket.on("message:error", handleMessageError);
      socket.on("message:delete", handleMessageDeleted);
      socket.on("user:online", handleUserOnline);

      socket.on("user:offline", handleUserOffline);
      // return () => {
      //   socket.off(
      //     "message:receive",
      //     handleIncomingMessage
      //   );

      //   socket.off(
      //     "message:error",
      //     handleMessageError
      //   );
      // };

      return () => {
        socket.off("message:receive", handleIncomingMessage);

        socket.off("message:error", handleMessageError);

        socket.off("user:online", handleUserOnline);

        socket.off("user:offline", handleUserOffline);

        socket.off("message:delete", handleMessageDeleted);
      };
    };

    const unsubscribe = subscribeToSocket(handleSocket);

    return () => {
      unsubscribe();
    };
  }, []);

  // --------------------------------
  // Join active conversation
  // --------------------------------

  useEffect(() => {
    if (!activeConversation) {
      return;
    }

    const conversationId = activeConversation._id;

    const handleSocket = (socket) => {
      console.log("Joining conversation:", conversationId);

      socket.emit("conversation:join", conversationId);
    };

    const unsubscribe = subscribeToSocket(handleSocket);

    return () => {
      unsubscribe();
    };
  }, [activeConversation]);

  // --------------------------------
  // Fetch users
  // --------------------------------

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await api.get("/users");

      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // --------------------------------
  // Search users
  // --------------------------------

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoadingUsers(true);

      const response = await api.get(
        `/users/search?q=${encodeURIComponent(query)}`,
      );

      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // --------------------------------
  // Fetch conversations
  // --------------------------------

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);

      const response = await api.get("/conversations");

      setConversations(response.data.conversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // --------------------------------
  // Create / get conversation
  // --------------------------------
 
const createConversation = async (userId) => {
  try {
    const response = await api.post("/conversations", {
      userId,
    });

    const conversation = response.data.conversation;

    // Add/update conversation in sidebar immediately
    setConversations((previous) => {
      const exists = previous.some(
        (item) => item._id === conversation._id
      );

      if (exists) {
        return previous.map((item) =>
          item._id === conversation._id
            ? conversation
            : item
        );
      }

      return [conversation, ...previous];
    });

    // Select the conversation immediately
    setActiveConversation(conversation);

    // Load its messages
    await fetchMessages(conversation._id);

    return conversation;
  } catch (error) {
    console.error(
      "Failed to create conversation:",
      error
    );

    throw error;
  }
};
  // --------------------------------
  // Fetch messages
  // --------------------------------

  const fetchMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);

      const response = await api.get(
        `/messages/${conversationId}?page=1&limit=30`,
      );

      setMessages(response.data.messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);

      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // --------------------------------
  // Select conversation
  // --------------------------------

  // const selectConversation = async (conversation) => {
  //   setActiveConversation(conversation);

  //   await fetchMessages(conversation._id);
  // };
  
const selectConversation = async (conversation) => {
  // Mark this conversation as active
  setActiveConversation(conversation);

  // Clear its unread count in the sidebar
  setConversations((previous) =>
    previous.map((item) =>
      item._id === conversation._id
        ? { ...item, unreadCount: 0 }
        : item
    )
  );

  // Load messages for the selected conversation
  await fetchMessages(conversation._id);
};

  // --------------------------------
  // Initial data
  // --------------------------------

  // useEffect(() => {
  //   fetchConversations();
  //   fetchUsers();
  // }, []);

  // --------------------------------
// Initial data
// --------------------------------

useEffect(() => {
  if (authLoading) {
    return;
  }

  if (!user) {
    setUsers([]);
    setConversations([]);
    setActiveConversation(null);
    setMessages([]);

    return;
  }

  fetchUsers();
  fetchConversations();
}, [user, authLoading]);

  // --------------------------------
  // Start typing
  // --------------------------------

  const startTyping = (conversationId) => {
    const socket = requireSocket();

    if (!socket) {
      return;
    }

    socket.emit("typing:start", {
      conversationId,
    });
  };

  // --------------------------------
  // Stop typing
  // --------------------------------

  const stopTyping = (conversationId) => {
    const socket = requireSocket();

    if (!socket) {
      return;
    }

    socket.emit("typing:stop", {
      conversationId,
    });
  };

  // --------------------------------
  // Send message using Socket.IO
  // --------------------------------

  const sendMessage = (conversationId, text) => {
    const socket = requireSocket();

    if (!socket) {
      throw new Error("Socket is not connected");
    }

    console.log("Sending message:", {
      conversationId,
      text,
      socketId: socket.id,
      connected: socket.connected,
    });

    socket.emit("message:send", {
      conversationId,
      text,
    });
  };

  // --------------------------------
  // Delete message
  // --------------------------------

  

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

    console.log("DELETE MESSAGE REQUEST:", {
      messageId,
      socketId: socket.id,
      connected: socket.connected,
    });

    socket.emit(
      "message:delete",
      {
        messageId,
      },
      (response) => {
        console.log("DELETE MESSAGE RESPONSE:", response);
      },
    );
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

// Small helper so sendMessage can use the current socket
// eslint-disable-next-line import/first
import { getSocket } from "../services/socket";

const requireSocket = () => {
  const socket = getSocket();

  if (!socket) {
    return null;
  }

  if (!socket.connected) {
    return null;
  }

  return socket;
};

export const useChat = () => {
  return useContext(ChatContext);
};
