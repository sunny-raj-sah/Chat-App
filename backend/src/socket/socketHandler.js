const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const socketHandler = (io) => {
  // --------------------------------
  // Socket authentication
  // --------------------------------

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token;

      if (!token) {
        return next(
          new Error(
            "Authentication required"
          )
        );
      }

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      const user =
        await User.findById(
          decoded.userId
        ).select("-password");

      if (!user) {
        return next(
          new Error("User not found")
        );
      }

      socket.user = user;

      next();
    } catch (error) {
      console.error(
        "Socket authentication error:",
        error.message
      );

      next(
        new Error(
          "Invalid or expired token"
        )
      );
    }
  });

  // --------------------------------
  // Connection
  // --------------------------------

  io.on(
    "connection",
    async (socket) => {
      console.log(
        `User connected: ${socket.user.name} (${socket.id})`
      );
             
       // --------------------------------
    // Join personal user room
    // --------------------------------

    const userRoom = `user:${socket.user._id}`;

    socket.join(userRoom);

    console.log(
      `${socket.user.name} joined personal room: ${userRoom}`
    );

      await User.findByIdAndUpdate(
        socket.user._id,
        {
          isOnline: true,
          lastSeen: null,
        }
      );
       // Notify all connected clients
  // that this user is online

      io.emit("user:online", {
  userId: socket.user._id.toString(),
  isOnline: true,
  lastSeen: null,
});

      // --------------------------------
      // Join conversation
      // --------------------------------

      socket.on(
        "conversation:join",
        async (conversationId) => {
          try {
            if (!conversationId) {
              return;
            }

            const conversation =
              await Conversation.findById(
                conversationId
              );

            if (!conversation) {
              console.error(
                "Conversation not found:",
                conversationId
              );

              return;
            }

            const isParticipant =
              conversation.participants.some(
                (participantId) =>
                  participantId.toString() ===
                  socket.user._id.toString()
              );

            if (!isParticipant) {
              console.error(
                `User ${socket.user.name} tried to join conversation without permission`
              );

              return;
            }

            const room =
              `conversation:${conversationId}`;

            socket.join(room);

            console.log(
              `${socket.user.name} joined ${room}`
            );

            console.log(
              "Current rooms:",
              [...socket.rooms]
            );
          } catch (error) {
            console.error(
              "Conversation join error:",
              error
            );
          }
        }
      );

      // --------------------------------
      // Typing start
      // --------------------------------

      socket.on(
        "typing:start",
        ({ conversationId }) => {
          if (!conversationId) {
            return;
          }

          const room =
            `conversation:${conversationId}`;

          socket.to(room).emit(
            "typing:start",
            {
              conversationId,
              userId:
                socket.user._id.toString(),
            }
          );
        }
      );

      // --------------------------------
      // Typing stop
      // --------------------------------

      socket.on(
        "typing:stop",
        ({ conversationId }) => {
          if (!conversationId) {
            return;
          }

          const room =
            `conversation:${conversationId}`;

          socket.to(room).emit(
            "typing:stop",
            {
              conversationId,
              userId:
                socket.user._id.toString(),
            }
          );
        }
      );
             
      // --------------------------------
// Delete message
// --------------------------------

socket.on(
  "message:delete",
  async ({ messageId }, callback) => {
    try {
      console.log(
        "DELETE MESSAGE REQUEST RECEIVED:",
        {
          messageId,
          userId:
            socket.user._id.toString(),
        }
      );

      // --------------------------------
      // Validate message ID
      // --------------------------------

      if (!messageId) {
        const response = {
          success: false,
          message: "messageId is required",
        };

        socket.emit(
          "message:error",
          response
        );

        callback?.(response);

        return;
      }

      // --------------------------------
      // Find message
      // --------------------------------

      const message =
        await Message.findById(
          messageId
        );

      if (!message) {
        const response = {
          success: false,
          message: "Message not found",
        };

        socket.emit(
          "message:error",
          response
        );

        callback?.(response);

        return;
      }

      // --------------------------------
      // Check message owner
      // --------------------------------

      if (
        message.sender.toString() !==
        socket.user._id.toString()
      ) {
        const response = {
          success: false,
          message:
            "You can only delete your own messages",
        };

        socket.emit(
          "message:error",
          response
        );

        callback?.(response);

        return;
      }

      // --------------------------------
      // Get conversation
      // --------------------------------

      const conversationId =
        message.conversation.toString();

      const conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        const response = {
          success: false,
          message:
            "Conversation not found",
        };

        socket.emit(
          "message:error",
          response
        );

        callback?.(response);

        return;
      }

      // --------------------------------
      // Delete from MongoDB
      // --------------------------------

      await Message.findByIdAndDelete(
        messageId
      );

      console.log(
        "MESSAGE DELETED FROM MONGODB:",
        messageId
      );

      // --------------------------------
      // Find new latest message
      // --------------------------------

      const latestMessage =
        await Message.findOne({
          conversation: conversationId,
        }).sort({
          createdAt: -1,
        });

      // --------------------------------
      // Update conversation preview
      // --------------------------------

      if (latestMessage) {
        conversation.lastMessage =
          latestMessage._id;

        conversation.lastMessageAt =
          latestMessage.createdAt;
      } else {
        conversation.lastMessage = null;
        conversation.lastMessageAt = null;
      }

      await conversation.save();

      // --------------------------------
      // Notify both users
      // --------------------------------

      io.to(
        `conversation:${conversationId}`
      ).emit(
        "message:delete",
        {
          messageId,
          conversationId,

          lastMessage:
            latestMessage || null,

          lastMessageAt:
            latestMessage?.createdAt ||
            null,
        }
      );

      // --------------------------------
      // Success response
      // --------------------------------

      callback?.({
        success: true,
        message:
          "Message deleted successfully",
      });

    } catch (error) {
      console.error(
        "DELETE MESSAGE ERROR:",
        error
      );

      const response = {
        success: false,
        message:
          "Failed to delete message",
      };

      socket.emit(
        "message:error",
        response
      );

      callback?.(response);
    }
  }
);
      // --------------------------------
      // Send message
      // --------------------------------

      socket.on(
        "message:send",
        async ({
          conversationId,
          text,
        }) => {
          try {
            console.log(
              "message:send received:",
              {
                user:
                  socket.user.name,
                conversationId,
                text,
              }
            );

            if (
              !conversationId ||
              !text?.trim()
            ) {
              return;
            }

            const conversation =
              await Conversation.findById(
                conversationId
              );

            if (!conversation) {
              socket.emit(
                "message:error",
                {
                  message:
                    "Conversation not found",
                }
              );

              return;
            }

            const isParticipant =
              conversation.participants.some(
                (participantId) =>
                  participantId.toString() ===
                  socket.user._id.toString()
              );

            if (!isParticipant) {
              socket.emit(
                "message:error",
                {
                  message:
                    "You are not part of this conversation",
                }
              );

              return;
            }

            
            const message =
              await Message.create({
                conversation:
                  conversationId,

                sender:
                  socket.user._id,

                text: text.trim(),

                status: "sent",
              });

            // --------------------------------
            // Update conversation
            // --------------------------------

            conversation.lastMessage =
              message._id;

            conversation.lastMessageAt =
              message.createdAt;

            await conversation.save();

            // --------------------------------
            // Populate message
            // --------------------------------

            // const populatedMessage =
            //   await Message.findById(
            //     message._id
            //   ).populate(
            //     "sender",
            //     "-password"
            //   );

            const populatedMessage =
  await Message.findById(message._id)
    .populate("sender", "-password")
    .populate({
      path: "conversation",
      populate: {
        path: "participants",
        select: "-password",
      },
    });
            const room =
              `conversation:${conversationId}`;

            console.log(
              "Emitting message to room:",
              room
            );

            console.log(
              "Room sockets:",
              io.sockets.adapter.rooms.get(
                room
              )
            );

            // --------------------------------
            // Send to sender + receiver
            // --------------------------------

            // io.to(room).emit(
            //   "message:receive",
            //   populatedMessage
            // );

            // --------------------------------
// Send message to conversation room
// --------------------------------

io.to(room).emit(
  "message:receive",
  populatedMessage
);

// --------------------------------
// Notify participants directly
// --------------------------------

conversation.participants.forEach((participantId) => {
  const participantRoom =
    `user:${participantId.toString()}`;

  io.to(participantRoom).emit(
    "conversation:message",
    populatedMessage
  );

  console.log(
    "Message notification emitted to:",
    participantRoom
  );
});

            console.log(
              "message:receive emitted:",
              populatedMessage._id
            );
          } catch (error) {
            console.error(
              "Socket message error:",
              error
            );

            socket.emit(
              "message:error",
              {
                message:
                  "Failed to send message",
              }
            );
          }
        }
      );

      // --------------------------------
      // Disconnect
      // --------------------------------

      socket.on(
        "disconnect",
        async () => {
          console.log(
            `User disconnected: ${socket.user.name}`
          );

          // await User.findByIdAndUpdate(
          //   socket.user._id,
          //   {
          //     isOnline: false,
          //     lastSeen: new Date(),
          //   }
          // );
          const lastSeen =
            new Date();

          await User.findByIdAndUpdate(
            socket.user._id,
            {
              isOnline: false,
              lastSeen,
            }
          );

//           io.emit("user:online", {
//   userId:
//     socket.user._id.toString(),

//   isOnline: true,

//   lastSeen: null,
// });

          io.emit("user:offline", {
            userId:
              socket.user._id.toString(),

            isOnline: false,

            lastSeen,
          });

          // io.emit("user:online", {
          //   userId: socket.user._id.toString(),
          //   isOnline: true,
          //   lastSeen: null,
          // });
        }
      );
    }
  );
};

module.exports = socketHandler;