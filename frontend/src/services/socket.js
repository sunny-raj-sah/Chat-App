 import { io } from "socket.io-client";

// const SOCKET_URL = "http://localhost:5000";

const SOCKET_URL =  process.env.REACT_APP_SOCKET_URL
let socket = null;

const socketReadyListeners = new Set();

export const connectSocket = (token) => {
  if (!token) {
    return null;
  }

  // Already connected
  if (socket?.connected) {
    return socket;
  }

  // Socket already exists but is connecting
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on("connect", () => {
    console.log(
      "Socket connected:",
      socket.id
    );

    // Tell all subscribers that the socket is available
    socketReadyListeners.forEach(
      (listener) => {
        listener(socket);
      }
    );
  });

  socket.on("connect_error", (error) => {
    console.error(
      "Socket connection error:",
      error.message
    );
  });

  socket.on("disconnect", (reason) => {
    console.log(
      "Socket disconnected:",
      reason
    );
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

/*
  Allows components/context to wait for the socket.

  If socket already exists, callback is called immediately.

  If socket does not exist yet, callback is called
  when connectSocket() successfully connects.
*/
export const subscribeToSocket = (callback) => {
  socketReadyListeners.add(callback);

  if (socket?.connected) {
    callback(socket);
  }

  return () => {
    socketReadyListeners.delete(callback);
  };
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

    // Do not clear socketReadyListeners here.
  // ChatContext remains mounted across logout/login and needs
  // its subscriptions to attach to the next socket connection.
  
  // socketReadyListeners.clear();
};