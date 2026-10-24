// // const jwt = require("jsonwebtoken");

// // const User = require("../models/User");
// // const Message = require("../models/Message");
// // const Conversation = require("../models/Conversation");

// // const socketHandler = (io) => {
// //   // --------------------------------
// //   // Socket authentication
// //   // --------------------------------

// //   io.use(async (socket, next) => {
// //     try {
// //       const token =
// //         socket.handshake.auth.token;

// //       if (!token) {
// //         return next(
// //           new Error(
// //             "Authentication required"
// //           )
// //         );
// //       }

// //       const decoded =
// //         jwt.verify(
// //           token,
// //           process.env.JWT_SECRET
// //         );

// //       const user =
// //         await User.findById(
// //           decoded.userId
// //         ).select("-password");

// //       if (!user) {
// //         return next(
// //           new Error("User not found")
// //         );
// //       }

// //       socket.user = user;

// //       next();
// //     } catch (error) {
// //       console.error(
// //         "Socket authentication error:",
// //         error.message
// //       );

// //       next(
// //         new Error(
// //           "Invalid or expired token"
// //         )
// //       );
// //     }
// //   });

// //   // --------------------------------
// //   // Connection
// //   // --------------------------------

// //   io.on(
// //     "connection",
// //     async (socket) => {
// //       console.log(
// //         `User connected: ${socket.user.name} (${socket.id})`
// //       );
             
// //        // --------------------------------
// //     // Join personal user room
// //     // --------------------------------

// //     const userRoom = `user:${socket.user._id}`;

// //     socket.join(userRoom);

// //     console.log(
// //       `${socket.user.name} joined personal room: ${userRoom}`
// //     );

// //       await User.findByIdAndUpdate(
// //         socket.user._id,
// //         {
// //           isOnline: true,
// //           lastSeen: null,
// //         }
// //       );
// //        // Notify all connected clients
// //   // that this user is online

// //       io.emit("user:online", {
// //   userId: socket.user._id.toString(),
// //   isOnline: true,
// //   lastSeen: null,
// // });

// //       // --------------------------------
// //       // Join conversation
// //       // --------------------------------

// //       socket.on(
// //         "conversation:join",
// //         async (conversationId) => {
// //           try {
// //             if (!conversationId) {
// //               return;
// //             }

// //             const conversation =
// //               await Conversation.findById(
// //                 conversationId
// //               );

// //             if (!conversation) {
// //               console.error(
// //                 "Conversation not found:",
// //                 conversationId
// //               );

// //               return;
// //             }

// //             const isParticipant =
// //               conversation.participants.some(
// //                 (participantId) =>
// //                   participantId.toString() ===
// //                   socket.user._id.toString()
// //               );

// //             if (!isParticipant) {
// //               console.error(
// //                 `User ${socket.user.name} tried to join conversation without permission`
// //               );

// //               return;
// //             }

// //             const room =
// //               `conversation:${conversationId}`;

// //             socket.join(room);

// //             console.log(
// //               `${socket.user.name} joined ${room}`
// //             );

// //             console.log(
// //               "Current rooms:",
// //               [...socket.rooms]
// //             );
// //           } catch (error) {
// //             console.error(
// //               "Conversation join error:",
// //               error
// //             );
// //           }
// //         }
// //       );

// //       // --------------------------------
// //       // Typing start
// //       // --------------------------------

// //       socket.on(
// //         "typing:start",
// //         ({ conversationId }) => {
// //           if (!conversationId) {
// //             return;
// //           }

// //           const room =
// //             `conversation:${conversationId}`;

// //           socket.to(room).emit(
// //             "typing:start",
// //             {
// //               conversationId,
// //               userId:
// //                 socket.user._id.toString(),
// //             }
// //           );
// //         }
// //       );

// //       // --------------------------------
// //       // Typing stop
// //       // --------------------------------

// //       socket.on(
// //         "typing:stop",
// //         ({ conversationId }) => {
// //           if (!conversationId) {
// //             return;
// //           }

// //           const room =
// //             `conversation:${conversationId}`;

// //           socket.to(room).emit(
// //             "typing:stop",
// //             {
// //               conversationId,
// //               userId:
// //                 socket.user._id.toString(),
// //             }
// //           );
// //         }
// //       );
             
// //       // --------------------------------
// // // Delete message
// // // --------------------------------

// // socket.on(
// //   "message:delete",
// //   async ({ messageId }, callback) => {
// //     try {
// //       console.log(
// //         "DELETE MESSAGE REQUEST RECEIVED:",
// //         {
// //           messageId,
// //           userId:
// //             socket.user._id.toString(),
// //         }
// //       );

// //       // --------------------------------
// //       // Validate message ID
// //       // --------------------------------

// //       if (!messageId) {
// //         const response = {
// //           success: false,
// //           message: "messageId is required",
// //         };

// //         socket.emit(
// //           "message:error",
// //           response
// //         );

// //         callback?.(response);

// //         return;
// //       }

// //       // --------------------------------
// //       // Find message
// //       // --------------------------------

// //       const message =
// //         await Message.findById(
// //           messageId
// //         );

// //       if (!message) {
// //         const response = {
// //           success: false,
// //           message: "Message not found",
// //         };

// //         socket.emit(
// //           "message:error",
// //           response
// //         );

// //         callback?.(response);

// //         return;
// //       }

// //       // --------------------------------
// //       // Check message owner
// //       // --------------------------------

// //       if (
// //         message.sender.toString() !==
// //         socket.user._id.toString()
// //       ) {
// //         const response = {
// //           success: false,
// //           message:
// //             "You can only delete your own messages",
// //         };

// //         socket.emit(
// //           "message:error",
// //           response
// //         );

// //         callback?.(response);

// //         return;
// //       }

// //       // --------------------------------
// //       // Get conversation
// //       // --------------------------------

// //       const conversationId =
// //         message.conversation.toString();

// //       const conversation =
// //         await Conversation.findById(
// //           conversationId
// //         );

// //       if (!conversation) {
// //         const response = {
// //           success: false,
// //           message:
// //             "Conversation not found",
// //         };

// //         socket.emit(
// //           "message:error",
// //           response
// //         );

// //         callback?.(response);

// //         return;
// //       }

// //       // --------------------------------
// //       // Delete from MongoDB
// //       // --------------------------------

// //       await Message.findByIdAndDelete(
// //         messageId
// //       );

// //       console.log(
// //         "MESSAGE DELETED FROM MONGODB:",
// //         messageId
// //       );

// //       // --------------------------------
// //       // Find new latest message
// //       // --------------------------------

// //       const latestMessage =
// //         await Message.findOne({
// //           conversation: conversationId,
// //         }).sort({
// //           createdAt: -1,
// //         });

// //       // --------------------------------
// //       // Update conversation preview
// //       // --------------------------------

// //       if (latestMessage) {
// //         conversation.lastMessage =
// //           latestMessage._id;

// //         conversation.lastMessageAt =
// //           latestMessage.createdAt;
// //       } else {
// //         conversation.lastMessage = null;
// //         conversation.lastMessageAt = null;
// //       }

// //       await conversation.save();

// //       // --------------------------------
// //       // Notify both users
// //       // --------------------------------

// //       io.to(
// //         `conversation:${conversationId}`
// //       ).emit(
// //         "message:delete",
// //         {
// //           messageId,
// //           conversationId,

// //           lastMessage:
// //             latestMessage || null,

// //           lastMessageAt:
// //             latestMessage?.createdAt ||
// //             null,
// //         }
// //       );

// //       // --------------------------------
// //       // Success response
// //       // --------------------------------

// //       callback?.({
// //         success: true,
// //         message:
// //           "Message deleted successfully",
// //       });

// //     } catch (error) {
// //       console.error(
// //         "DELETE MESSAGE ERROR:",
// //         error
// //       );

// //       const response = {
// //         success: false,
// //         message:
// //           "Failed to delete message",
// //       };

// //       socket.emit(
// //         "message:error",
// //         response
// //       );

// //       callback?.(response);
// //     }
// //   }
// // );
// //       // --------------------------------
// //       // Send message
// //       // --------------------------------

// //       socket.on(
// //         "message:send",
// //         async ({
// //           conversationId,
// //           text,
// //         }) => {
// //           try {
// //             console.log(
// //               "message:send received:",
// //               {
// //                 user:
// //                   socket.user.name,
// //                 conversationId,
// //                 text,
// //               }
// //             );

// //             if (
// //               !conversationId ||
// //               !text?.trim()
// //             ) {
// //               return;
// //             }

// //             const conversation =
// //               await Conversation.findById(
// //                 conversationId
// //               );

// //             if (!conversation) {
// //               socket.emit(
// //                 "message:error",
// //                 {
// //                   message:
// //                     "Conversation not found",
// //                 }
// //               );

// //               return;
// //             }

// //             const isParticipant =
// //               conversation.participants.some(
// //                 (participantId) =>
// //                   participantId.toString() ===
// //                   socket.user._id.toString()
// //               );

// //             if (!isParticipant) {
// //               socket.emit(
// //                 "message:error",
// //                 {
// //                   message:
// //                     "You are not part of this conversation",
// //                 }
// //               );

// //               return;
// //             }

            
// //             const message =
// //               await Message.create({
// //                 conversation:
// //                   conversationId,

// //                 sender:
// //                   socket.user._id,

// //                 text: text.trim(),

// //                 status: "sent",
// //               });

// //             // --------------------------------
// //             // Update conversation
// //             // --------------------------------

// //             conversation.lastMessage =
// //               message._id;

// //             conversation.lastMessageAt =
// //               message.createdAt;

// //             await conversation.save();

// //             // --------------------------------
// //             // Populate message
// //             // --------------------------------

// //             // const populatedMessage =
// //             //   await Message.findById(
// //             //     message._id
// //             //   ).populate(
// //             //     "sender",
// //             //     "-password"
// //             //   );

// //             const populatedMessage =
// //   await Message.findById(message._id)
// //     .populate("sender", "-password")
// //     .populate({
// //       path: "conversation",
// //       populate: {
// //         path: "participants",
// //         select: "-password",
// //       },
// //     });
// //             const room =
// //               `conversation:${conversationId}`;

// //             console.log(
// //               "Emitting message to room:",
// //               room
// //             );

// //             console.log(
// //               "Room sockets:",
// //               io.sockets.adapter.rooms.get(
// //                 room
// //               )
// //             );

// //             // --------------------------------
// //             // Send to sender + receiver
// //             // --------------------------------

// //             // io.to(room).emit(
// //             //   "message:receive",
// //             //   populatedMessage
// //             // );

// //             // --------------------------------
// // // Send message to conversation room
// // // --------------------------------

// // io.to(room).emit(
// //   "message:receive",
// //   populatedMessage
// // );

// // // --------------------------------
// // // Notify participants directly
// // // --------------------------------

// // conversation.participants.forEach((participantId) => {
// //   const participantRoom =
// //     `user:${participantId.toString()}`;

// //   io.to(participantRoom).emit(
// //     "conversation:message",
// //     populatedMessage
// //   );

// //   console.log(
// //     "Message notification emitted to:",
// //     participantRoom
// //   );
// // });

// //             console.log(
// //               "message:receive emitted:",
// //               populatedMessage._id
// //             );
// //           } catch (error) {
// //             console.error(
// //               "Socket message error:",
// //               error
// //             );

// //             socket.emit(
// //               "message:error",
// //               {
// //                 message:
// //                   "Failed to send message",
// //               }
// //             );
// //           }
// //         }
// //       );

// //       // --------------------------------
// //       // Disconnect
// //       // --------------------------------

// //       socket.on(
// //         "disconnect",
// //         async () => {
// //           console.log(
// //             `User disconnected: ${socket.user.name}`
// //           );

// //           // await User.findByIdAndUpdate(
// //           //   socket.user._id,
// //           //   {
// //           //     isOnline: false,
// //           //     lastSeen: new Date(),
// //           //   }
// //           // );
// //           const lastSeen =
// //             new Date();

// //           await User.findByIdAndUpdate(
// //             socket.user._id,
// //             {
// //               isOnline: false,
// //               lastSeen,
// //             }
// //           );

// // //           io.emit("user:online", {
// // //   userId:
// // //     socket.user._id.toString(),

// // //   isOnline: true,

// // //   lastSeen: null,
// // // });

// //           io.emit("user:offline", {
// //             userId:
// //               socket.user._id.toString(),

// //             isOnline: false,

// //             lastSeen,
// //           });

// //           // io.emit("user:online", {
// //           //   userId: socket.user._id.toString(),
// //           //   isOnline: true,
// //           //   lastSeen: null,
// //           // });
// //         }
// //       );
// //     }
// //   );
// // };

// // module.exports = socketHandler;
// // ------------------------------------------------
// const jwt = require("jsonwebtoken");

// const User = require("../models/User");
// const Message = require("../models/Message");
// const Conversation = require("../models/Conversation");

// // When a user's LAST socket closes, wait this long before marking them
// // offline. A page refresh closes the old socket and opens a new one within
// // a second or so; without the grace period the late "disconnect" of the old
// // socket can overwrite the "online" of the new one (user stuck offline).
// const OFFLINE_GRACE_MS = 2000;

// const userRoomOf = (userId) => `user:${userId}`;
// const conversationRoomOf = (conversationId) => `conversation:${conversationId}`;

// // ONE place that turns a Mongoose document into what the client receives.
// // toJSON() runs the schema's transform, which is where decryption must live
// // (see the Message model snippet in the answer).
// const toClientMessage = (message) =>
//   message && typeof message.toJSON === "function" ? message.toJSON() : message;

// const isParticipant = (conversation, userId) =>
//   conversation.participants.some((p) => p.toString() === userId);

// const socketHandler = (io) => {
//   // Presence lives in memory (sockets) and the DB. If the server crashed
//   // earlier, the DB may still say "online" for people who are not connected.
//   // Reset on boot. Remove this if you ever run more than one server instance.
//   User.updateMany(
//     { isOnline: true },
//     { isOnline: false, lastSeen: new Date() }
//   ).catch((error) => console.error("Presence reset failed:", error.message));

//   // The truth about who is online = who has a live, authenticated socket.
//   const getOnlineUserIds = () => {
//     const ids = new Set();
//     for (const s of io.sockets.sockets.values()) {
//       if (s.user) ids.add(s.user._id.toString());
//     }
//     return [...ids];
//   };

//   // --------------------------------
//   // Socket authentication
//   // --------------------------------

//   io.use(async (socket, next) => {
//     try {
//       const token = socket.handshake.auth.token;

//       if (!token) {
//         return next(new Error("Authentication required"));
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       const user = await User.findById(decoded.userId).select("-password");

//       if (!user) {
//         return next(new Error("User not found"));
//       }

//       socket.user = user;
//       next();
//     } catch (error) {
//       console.error("Socket authentication error:", error.message);
//       next(new Error("Invalid or expired token"));
//     }
//   });

//   // --------------------------------
//   // Connection
//   // --------------------------------

//   // NOTE: this callback is NOT async on purpose. Every socket.on(...) below
//   // must be registered synchronously. In the old version an `await` ran
//   // before the listeners were registered, so events the client emitted right
//   // after connecting (conversation:join, ...) could be silently dropped.
//   io.on("connection", (socket) => {
//     const userId = socket.user._id.toString();
//     const userRoom = userRoomOf(userId);

//     console.log(`User connected: ${socket.user.name} (${socket.id})`);

//     // Personal room: every message / delete event for this user is delivered
//     // here, so it arrives even if the user has not opened that conversation.
//     socket.join(userRoom);

//     // --------------------------------
//     // Presence snapshot (client asks after its listeners are attached)
//     // --------------------------------

//     socket.on("presence:request", () => {
//       socket.emit("presence:snapshot", { onlineUserIds: getOnlineUserIds() });
//     });

//     // --------------------------------
//     // Join conversation room (used for typing indicators)
//     // --------------------------------

//     socket.on("conversation:join", async (conversationId) => {
//       try {
//         if (!conversationId) return;

//         const conversation = await Conversation.findById(conversationId);

//         if (!conversation) {
//           console.error("Conversation not found:", conversationId);
//           return;
//         }

//         if (!isParticipant(conversation, userId)) {
//           console.error(
//             `User ${socket.user.name} tried to join a conversation without permission`
//           );
//           return;
//         }

//         socket.join(conversationRoomOf(conversationId));

//         // Remember who the OTHER participants are, so typing events can be
//         // sent to their personal rooms without a DB lookup per keystroke.
//         socket.data.peers = socket.data.peers || new Map();
//         socket.data.peers.set(
//           String(conversationId),
//           conversation.participants
//             .map((p) => p.toString())
//             .filter((id) => id !== userId)
//         );
//       } catch (error) {
//         console.error("Conversation join error:", error);
//       }
//     });

//     // --------------------------------
//     // Typing
//     // --------------------------------

//     // Typing goes to the other participants' PERSONAL rooms, so their
//     // sidebar shows "typing..." even when that chat is not open.
//     const emitTyping = (event, conversationId) => {
//       if (!conversationId) return;

//       const peers = socket.data.peers?.get(String(conversationId));
//       if (!peers || peers.length === 0) return; // not a validated member

//       io.to(peers.map(userRoomOf)).emit(event, { conversationId, userId });
//     };

//     socket.on("typing:start", ({ conversationId } = {}) =>
//       emitTyping("typing:start", conversationId)
//     );

//     socket.on("typing:stop", ({ conversationId } = {}) =>
//       emitTyping("typing:stop", conversationId)
//     );

//     // --------------------------------
//     // Send message
//     // --------------------------------

//     socket.on("message:send", async ({ conversationId, text } = {}) => {
//       try {
//         if (!conversationId || typeof text !== "string" || !text.trim()) {
//           return;
//         }

//         const conversation = await Conversation.findById(conversationId);

//         if (!conversation) {
//           socket.emit("message:error", { message: "Conversation not found" });
//           return;
//         }

//         if (!isParticipant(conversation, userId)) {
//           socket.emit("message:error", {
//             message: "You are not part of this conversation",
//           });
//           return;
//         }

//         const message = await Message.create({
//           conversation: conversationId,
//           sender: socket.user._id,
//           text: text.trim(),
//           status: "sent",
//         });

//         conversation.lastMessage = message._id;
//         conversation.lastMessageAt = message.createdAt;
//         await conversation.save();

//         const populatedMessage = await Message.findById(message._id)
//           .populate("sender", "-password")
//           .populate({
//             path: "conversation",
//             populate: { path: "participants", select: "-password" },
//           });

//         // Deliver to every participant's PERSONAL room. io.to([a, b]) sends
//         // each socket the event once, even if it matches both rooms.
//         // This is what fixes "recipient sees nothing until they search":
//         // before, the event went to the conversation room, which the
//         // recipient only joins after opening that conversation.
//         const targetRooms = conversation.participants.map((p) =>
//           userRoomOf(p.toString())
//         );

//         // Diagnostic: prints each target room and how many sockets are in
//         // it. A 0 means that user has no live socket (not logged in / not
//         // connected). If you do not see this "[chat]" line in your terminal,
//         // the OLD socketHandler.js is still running.
//         console.log(
//           "[chat] delivering message to:",
//           targetRooms.map((r) => `${r} (${io.sockets.adapter.rooms.get(r)?.size ?? 0} sockets)`)
//         );

//         io.to(targetRooms).emit(
//           "message:receive",
//           toClientMessage(populatedMessage)
//         );
//       } catch (error) {
//         console.error("Socket message error:", error);
//         socket.emit("message:error", { message: "Failed to send message" });
//       }
//     });

//     // --------------------------------
//     // Delete message
//     // --------------------------------

//     socket.on("message:delete", async ({ messageId } = {}, callback) => {
//       const fail = (message) => {
//         const response = { success: false, message };
//         socket.emit("message:error", response);
//         callback?.(response);
//       };

//       try {
//         if (!messageId) return fail("messageId is required");

//         const message = await Message.findById(messageId);
//         if (!message) return fail("Message not found");

//         if (message.sender.toString() !== userId) {
//           return fail("You can only delete your own messages");
//         }

//         const conversationId = message.conversation.toString();
//         const conversation = await Conversation.findById(conversationId);
//         if (!conversation) return fail("Conversation not found");

//         await Message.findByIdAndDelete(messageId);

//         const latestMessage = await Message.findOne({
//           conversation: conversationId,
//         }).sort({ createdAt: -1 });

//         conversation.lastMessage = latestMessage ? latestMessage._id : null;
//         conversation.lastMessageAt = latestMessage
//           ? latestMessage.createdAt
//           : null;
//         await conversation.save();

//         const targetRooms = conversation.participants.map((p) =>
//           userRoomOf(p.toString())
//         );

//         io.to(targetRooms).emit("message:delete", {
//           messageId,
//           conversationId,
//           lastMessage: latestMessage ? toClientMessage(latestMessage) : null,
//           lastMessageAt: latestMessage ? latestMessage.createdAt : null,
//         });

//         callback?.({ success: true, message: "Message deleted successfully" });
//       } catch (error) {
//         console.error("DELETE MESSAGE ERROR:", error);
//         fail("Failed to delete message");
//       }
//     });

//     // --------------------------------
//     // Disconnect
//     // --------------------------------

//     socket.on("disconnect", async () => {
//       console.log(`User disconnected: ${socket.user.name} (${socket.id})`);

//       try {
//         await new Promise((resolve) => setTimeout(resolve, OFFLINE_GRACE_MS));

//         // Same user still connected (other tab, or the refresh reconnected)?
//         const remaining = await io.in(userRoom).fetchSockets();
//         if (remaining.length > 0) return;

//         const lastSeen = new Date();

//         await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });

//         io.emit("user:offline", { userId, isOnline: false, lastSeen });
//       } catch (error) {
//         console.error("Disconnect handling error:", error);
//       }
//     });

//     // --------------------------------
//     // Mark online (after all listeners exist)
//     // --------------------------------

//     (async () => {
//       try {
//         await User.findByIdAndUpdate(userId, {
//           isOnline: true,
//           lastSeen: null,
//         });

//         // Everyone else learns about it live. The connecting client itself
//         // gets the full picture from presence:snapshot instead.
//         socket.broadcast.emit("user:online", {
//           userId,
//           isOnline: true,
//           lastSeen: null,
//         });
//       } catch (error) {
//         console.error("Mark online error:", error);
//       }
//     })();
//   });
// };

// module.exports = socketHandler;

// -----------------------------------------------------------
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

// When a user's LAST socket closes, wait this long before marking them
// offline. A page refresh closes the old socket and opens a new one within
// a second or so; without the grace period the late "disconnect" of the old
// socket can overwrite the "online" of the new one (user stuck offline).
const OFFLINE_GRACE_MS = 2000;

const userRoomOf = (userId) => `user:${userId}`;
const conversationRoomOf = (conversationId) => `conversation:${conversationId}`;

// ONE place that turns a Mongoose document into what the client receives.
// toJSON() runs the schema's transform, which is where decryption must live
// (see the Message model snippet in the answer).
const toClientMessage = (message) =>
  message && typeof message.toJSON === "function" ? message.toJSON() : message;

const isParticipant = (conversation, userId) =>
  conversation.participants.some((p) => p.toString() === userId);

const socketHandler = (io) => {
  // Presence lives in memory (sockets) and the DB. If the server crashed
  // earlier, the DB may still say "online" for people who are not connected.
  // Reset on boot. Remove this if you ever run more than one server instance.
  User.updateMany(
    { isOnline: true },
    { isOnline: false, lastSeen: new Date() }
  ).catch((error) => console.error("Presence reset failed:", error.message));

  // The truth about who is online = who has a live, authenticated socket.
  const getOnlineUserIds = () => {
    const ids = new Set();
    for (const s of io.sockets.sockets.values()) {
      if (s.user) ids.add(s.user._id.toString());
    }
    return [...ids];
  };

  // --------------------------------
  // Socket authentication
  // --------------------------------

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error.message);
      next(new Error("Invalid or expired token"));
    }
  });

  // --------------------------------
  // Connection
  // --------------------------------

  // NOTE: this callback is NOT async on purpose. Every socket.on(...) below
  // must be registered synchronously. In the old version an `await` ran
  // before the listeners were registered, so events the client emitted right
  // after connecting (conversation:join, ...) could be silently dropped.
  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    const userRoom = userRoomOf(userId);

    console.log(`User connected: ${socket.user.name} (${socket.id})`);

    // Personal room: every message / delete event for this user is delivered
    // here, so it arrives even if the user has not opened that conversation.
    socket.join(userRoom);

    // --------------------------------
    // Presence snapshot (client asks after its listeners are attached)
    // --------------------------------

    socket.on("presence:request", () => {
      socket.emit("presence:snapshot", { onlineUserIds: getOnlineUserIds() });
    });

    // --------------------------------
    // Join conversation room (used for typing indicators)
    // --------------------------------

    socket.on("conversation:join", async (conversationId) => {
      try {
        if (!conversationId) return;

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          console.error("Conversation not found:", conversationId);
          return;
        }

        if (!isParticipant(conversation, userId)) {
          console.error(
            `User ${socket.user.name} tried to join a conversation without permission`
          );
          return;
        }

        socket.join(conversationRoomOf(conversationId));

        // Remember who the OTHER participants are, so typing events can be
        // sent to their personal rooms without a DB lookup per keystroke.
        socket.data.peers = socket.data.peers || new Map();
        socket.data.peers.set(
          String(conversationId),
          conversation.participants
            .map((p) => p.toString())
            .filter((id) => id !== userId)
        );
      } catch (error) {
        console.error("Conversation join error:", error);
      }
    });

    // --------------------------------
    // Typing
    // --------------------------------

    // Typing goes to the other participants' PERSONAL rooms, so their
    // sidebar shows "typing..." even when that chat is not open.
    const emitTyping = (event, conversationId) => {
      if (!conversationId) return;

      const peers = socket.data.peers?.get(String(conversationId));
      if (!peers || peers.length === 0) return; // not a validated member

      io.to(peers.map(userRoomOf)).emit(event, { conversationId, userId });
    };

    socket.on("typing:start", ({ conversationId } = {}) =>
      emitTyping("typing:start", conversationId)
    );

    socket.on("typing:stop", ({ conversationId } = {}) =>
      emitTyping("typing:stop", conversationId)
    );

    // --------------------------------
    // Send message
    // --------------------------------

    socket.on("message:send", async ({ conversationId, text } = {}) => {
      try {
        if (!conversationId || typeof text !== "string" || !text.trim()) {
          return;
        }

        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          socket.emit("message:error", { message: "Conversation not found" });
          return;
        }

        if (!isParticipant(conversation, userId)) {
          socket.emit("message:error", {
            message: "You are not part of this conversation",
          });
          return;
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.user._id,
          text: text.trim(),
          status: "sent",
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = message.createdAt;
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "-password")
          .populate({
            path: "conversation",
            populate: { path: "participants", select: "-password" },
          });

        // Deliver to every participant's PERSONAL room. io.to([a, b]) sends
        // each socket the event once, even if it matches both rooms.
        // This is what fixes "recipient sees nothing until they search":
        // before, the event went to the conversation room, which the
        // recipient only joins after opening that conversation.
        const targetRooms = conversation.participants.map((p) =>
          userRoomOf(p.toString())
        );

        // Diagnostic: prints each target room and how many sockets are in
        // it. A 0 means that user has no live socket (not logged in / not
        // connected). If you do not see this "[chat]" line in your terminal,
        // the OLD socketHandler.js is still running.
        console.log(
          "[chat] delivering message to:",
          targetRooms.map((r) => `${r} (${io.sockets.adapter.rooms.get(r)?.size ?? 0} sockets)`)
        );

        io.to(targetRooms).emit(
          "message:receive",
          toClientMessage(populatedMessage)
        );
      } catch (error) {
        console.error("Socket message error:", error);
        socket.emit("message:error", { message: "Failed to send message" });
      }
    });

    // --------------------------------
    // Delete message
    // --------------------------------

    socket.on("message:delete", async ({ messageId } = {}, callback) => {
      const fail = (message) => {
        const response = { success: false, message };
        socket.emit("message:error", response);
        callback?.(response);
      };

      try {
        if (!messageId) return fail("messageId is required");

        const message = await Message.findById(messageId);
        if (!message) return fail("Message not found");

        if (message.sender.toString() !== userId) {
          return fail("You can only delete your own messages");
        }

        const conversationId = message.conversation.toString();
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return fail("Conversation not found");

        await Message.findByIdAndDelete(messageId);

        const latestMessage = await Message.findOne({
          conversation: conversationId,
        }).sort({ createdAt: -1 });

        conversation.lastMessage = latestMessage ? latestMessage._id : null;
        conversation.lastMessageAt = latestMessage
          ? latestMessage.createdAt
          : null;
        await conversation.save();

        const targetRooms = conversation.participants.map((p) =>
          userRoomOf(p.toString())
        );

        io.to(targetRooms).emit("message:delete", {
          messageId,
          conversationId,
          lastMessage: latestMessage ? toClientMessage(latestMessage) : null,
          lastMessageAt: latestMessage ? latestMessage.createdAt : null,
        });

        callback?.({ success: true, message: "Message deleted successfully" });
      } catch (error) {
        console.error("DELETE MESSAGE ERROR:", error);
        fail("Failed to delete message");
      }
    });

    // --------------------------------
    // Disconnect
    // --------------------------------

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.user.name} (${socket.id})`);

      try {
        await new Promise((resolve) => setTimeout(resolve, OFFLINE_GRACE_MS));

        // Same user still connected (other tab, or the refresh reconnected)?
        const remaining = await io.in(userRoom).fetchSockets();
        if (remaining.length > 0) return;

        const lastSeen = new Date();

        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });

        io.emit("user:offline", { userId, isOnline: false, lastSeen });
      } catch (error) {
        console.error("Disconnect handling error:", error);
      }
    });

    // --------------------------------
    // Mark online (after all listeners exist)
    // --------------------------------

    (async () => {
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: true,
          lastSeen: null,
        });

        // Everyone else learns about it live. The connecting client itself
        // gets the full picture from presence:snapshot instead.
        socket.broadcast.emit("user:online", {
          userId,
          isOnline: true,
          lastSeen: null,
        });
      } catch (error) {
        console.error("Mark online error:", error);
      }
    })();
  });
};

module.exports = socketHandler;