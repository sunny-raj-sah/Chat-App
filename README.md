# 💬 Chat App

 
A full-stack one-to-one real-time messaging application built with **React, Node.js, Express.js, MongoDB, and Socket.IO**.

ChatApp supports JWT authentication, user search, conversations, real-time messaging, online/offline presence, typing indicators, message status fields, paginated message history, and ownership-controlled message deletion.
 
ChatApp is a full-stack real-time messaging application built with **React, Node.js, Express.js, MongoDB, and Socket.IO**.

The application allows authenticated users to search for other users, create one-to-one conversations, exchange messages in real time, see online/offline presence, receive typing indicators, track message status, and delete their own messages.

---
 

## 🚀 Live Application

 
**Frontend:** https://chat-app-real-time-chat-application-woad.vercel.app/login

**Backend:** https://chatapp-real-time-chat-application-f1bf.onrender.com/

**GitHub Repository:**
https://github.com/sunny-raj-sah/ChatApp-Real-Time-Chat-Application

**Portfolio:**
https://portfolio-eight-vert-40.vercel.app/#projects

## ✨ Features
 
 
 

- 🔐 User registration and JWT-based login
- 🔎 Search users by name or email
- 💬 One-to-one conversations
- ⚡ Real-time messaging with Socket.IO
- 🟢 Online/offline presence and last seen
- ✍️ Real-time typing indicators
- ✓ Sent / delivered / read message status model
- 🗑️ Delete your own messages with server-side ownership validation
- 📋 Conversation previews and automatic reordering
- 📜 Paginated message history
- 📱 Responsive chat interface
- 😀 Emoji picker support

 
## 🛠️ Tech Stack
 
# 📌 Project Overview

Traditional REST-based applications generally require the client to make repeated requests to check whether new data is available.

For a chat application, this approach is not ideal because features such as:

* real-time messages
* typing indicators
* online/offline presence
* message deletion

require immediate communication between connected clients.

ChatApp solves this by combining:

* **REST APIs** for authentication and persistent resource operations
* **Socket.IO** for real-time communication
* **MongoDB** for persistent application data
* **React Context API** for frontend state management
* **JWT** for authentication and authorization

The result is a full-stack application where persistent data and real-time events work together.

---

# ✨ Key Features
>>>>>>> 2a54fb5 (update feature)

| Layer | Technologies |
|---|---|
| Frontend | React 19, React Router, Context API, Axios, Socket.IO Client |
| UI | Bootstrap 5, Bootstrap Icons, Emoji Picker React |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Real-time | Socket.IO |
| Authentication | JWT, bcryptjs |
| Configuration | dotenv |
| Deployment | Vercel, Render |

 
## 🏗️ Architecture

```text
                    React Frontend
                         |
              +----------+----------+
              |                     |
            Axios              Socket.IO Client
              |                     |
              v                     v
       Express REST API       Socket.IO Server
              |                     |
              +----------+----------+
                         |
                      MongoDB
                         |
             +-----------+-----------+
             |           |           |
           Users   Conversations  Messages
 
* User registration
* User login
* JWT-based authentication
* Password hashing using bcrypt
* Protected REST API routes
* Persistent authentication using localStorage
* Socket.IO authentication using JWT
* Logout functionality
* Automatic session restoration

---

## 👤 User Management

* Fetch available users
* Search users by name or email
* Retrieve authenticated user information
* Retrieve individual user information
* Display online/offline status
* Display last-seen information

---

## 💬 Conversations

* Create one-to-one conversations
* Reuse an existing conversation
* Display conversation list
* Display latest message preview
* Display latest message timestamp
* Automatically reorder conversations after new messages
* Track conversation participants
* Conversation-specific Socket.IO rooms

---

## ⚡ Real-Time Messaging

* Real-time message sending
* Real-time message receiving
* Socket.IO communication
* Persistent messages in MongoDB
* Conversation-specific message broadcasting
* Authentication-aware socket communication
* Message error handling

---

## ✍️ Typing Indicators

Users can see when another participant is typing.

The application uses:

```text
typing:start
typing:stop
```

These events are transmitted through Socket.IO and are not persisted in MongoDB because typing represents temporary UI state.

---

## 🟢 Online / Offline Presence

The application tracks user presence using Socket.IO connection lifecycle events.

When a user connects:

```text
isOnline = true
lastSeen = null
```

When a user disconnects:

```text
isOnline = false
lastSeen = current time
```

The server broadcasts:

```text
user:online
user:offline
```

The frontend then updates the user and conversation participant state.

---

## 🗑️ Message Deletion

Users can delete only messages that they own.

The server verifies:

1. The message exists.
2. The authenticated user is the sender.
3. The related conversation exists.
4. The message is deleted from MongoDB.
5. The conversation preview is updated.
6. The deletion event is broadcast to the conversation room.

This ensures that a client cannot delete another user's message simply by supplying a different message ID.

---

## 📜 Message History

Conversation messages are retrieved through a protected REST endpoint.

Example:

```text
GET /api/messages/:conversationId?page=1&limit=30
```

The backend supports pagination.

Default page size:

```text
30 messages
```

Maximum requested page size:

```text
100 messages
```

The backend also verifies that the authenticated user belongs to the conversation before returning its messages.

---

# 🏗️ System Architecture

```text
                         React Frontend
                              |
                 +------------+------------+
                 |                         |
              Axios                   Socket.IO
                 |                       Client
                 |                         |
                 v                         v
          Express REST API          Socket.IO Server
                 |                         |
                 +------------+------------+
                              |
                              v
                           MongoDB
                              |
               +--------------+--------------+
               |              |              |
             Users      Conversations     Messages
```

The application uses two communication mechanisms.

### REST API

REST is used for operations such as:

* registration
* login
* fetching the current user
* searching users
* fetching conversations
* creating conversations
* retrieving message history

### Socket.IO

Socket.IO is used for real-time events:

* sending messages
* receiving messages
* typing indicators
* online/offline presence
* joining conversation rooms
* deleting messages

---

# 🔐 Authentication Architecture

Authentication is based on JSON Web Tokens.

```text
                 Register / Login
                       |
                       v
                 Express API
                       |
              +--------+--------+
              |                 |
           bcrypt             JWT
              |                 |
              +--------+--------+
                       |
                       v
                 React Frontend
                       |
              +--------+--------+
              |                 |
         localStorage        Socket.IO
              |                 |
              v                 v
        Axios Bearer       auth.token
              |                 |
              v                 v
       Protected API      Socket Middleware
                                |
                                v
                           jwt.verify()
                                |
                                v
                           socket.user
```

---

# 📝 Registration Flow

The registration process works as follows:

```text
User
 |
 | name + email + password
 v
POST /api/auth/register
 |
 v
Validate request
 |
 v
Normalize email
 |
 v
Check existing user
 |
 v
Hash password using bcrypt
 |
 v
Create User
 |
 v
Generate JWT
 |
 v
Return token + user
 |
 v
React
 |
 +--> localStorage
 |
 +--> connect Socket.IO
```

The backend does not store the plain-text password.

---

# 🔑 Login Flow

```text
User
 |
 | email + password
 v
POST /api/auth/login
 |
 v
Find user
 |
 v
Compare password using bcrypt
 |
 v
Update online state
 |
 v
Generate JWT
 |
 v
Return token + user
 |
 v
React
 |
 +--> store token
 |
 +--> set authenticated user
 |
 +--> connect Socket.IO
```

The JWT currently has a **7-day expiration period**.

---

# 🛡️ Protected REST API

Protected routes use authentication middleware.

The client sends the JWT using the Authorization header:

```text
Authorization: Bearer <token>
```

The backend:

```text
Request
   |
   v
Authorization Header
   |
   v
Extract JWT
   |
   v
Verify JWT
   |
   v
Find User
   |
   v
req.user
   |
   v
Controller
```

This allows controllers to operate using the authenticated user instead of trusting a user ID supplied by the client.

---

# ⚡ Socket.IO Authentication

Socket.IO connections are also authenticated.

The frontend connects using:

```text
auth: {
    token
}
```

The backend reads:

```text
socket.handshake.auth.token
```

Then verifies the token using the server's JWT secret.

If authentication succeeds:

```text
socket.user = user
```

If authentication fails:

```text
Invalid or expired token
```

The connection is rejected.

---

# 💬 Conversation Architecture

Each conversation gets its own Socket.IO room.

The room follows this format:

```text
conversation:<conversationId>
```

For example:

```text
conversation:64f8c...
```

When a user opens a conversation, the frontend emits:

```text
conversation:join
```

with the conversation ID.

The server then:

1. Finds the conversation.
2. Checks whether the authenticated user is a participant.
3. Creates/joins the Socket.IO room.

```text
Client
  |
  | conversation:join
  v
Socket.IO Server
  |
  |-- find conversation
  |
  |-- check participant
  |
  v
conversation:<conversationId>
```

This prevents an authenticated user from joining an arbitrary conversation room without being a participant.

---

# 📤 Message Sending Flow

Messages are primarily sent using Socket.IO.

```text
User A
  |
  | message:send
  |
  v
Socket.IO Server
  |
  +--> Validate conversation
  |
  +--> Verify participant
  |
  +--> Create Message
  |
  +--> Update Conversation
  |
  v
MongoDB
  |
  v
conversation:<conversationId>
  |
  +----------------+
  |                |
  v                v
User A           User B
  |                |
  +---- message:receive
```

The message is persisted before it is broadcast.

This means the database remains the source of truth for stored messages.

---

# 📥 Message Receiving Flow

When the backend successfully creates a message:

```text
Message created
      |
      v
MongoDB
      |
      v
Populate sender
      |
      v
conversation:<conversationId>
      |
      v
message:receive
      |
      v
React ChatContext
      |
      v
Update messages state
      |
      v
Update conversation preview
```

The frontend also checks for duplicate messages before adding them to state.

---

# ✍️ Typing Indicator Architecture

Typing indicators use transient Socket.IO events.

```text
User A
  |
  | typing:start
  v
Socket.IO Server
  |
  | socket.to(room)
  v
User B
```

When typing stops:

```text
User A
  |
  | typing:stop
  v
Socket.IO Server
  |
  v
User B
```

Typing state is not stored in MongoDB because it is temporary UI information.

---

# 🟢 Presence Architecture

When the Socket.IO connection is established:

```text
Socket connected
      |
      v
User.isOnline = true
      |
      v
lastSeen = null
      |
      v
user:online
```

When the socket disconnects:

```text
Socket disconnected
      |
      v
User.isOnline = false
      |
      v
lastSeen = new Date()
      |
      v
user:offline
```

The frontend listens to these events and updates:

* user list
* conversation participants
* active conversation

without requiring a full page refresh.

---

# 🗑️ Message Deletion Flow

Message deletion is handled through Socket.IO.

```text
User
 |
 | message:delete
 v
Socket.IO Server
 |
 +--> Find message
 |
 +--> Check sender ownership
 |
 +--> Find conversation
 |
 +--> Delete message
 |
 +--> Find new latest message
 |
 +--> Update conversation
 |
 v
message:delete
 |
 +--------> Conversation participants
```

If the deleted message was the latest message, the backend finds the previous latest message and updates:

```text
conversation.lastMessage
conversation.lastMessageAt
```

This keeps the conversation sidebar consistent.

---

# 🗃️ Database Design

The application uses MongoDB with Mongoose.

There are three primary models:

```text
User
Conversation
Message
```

---

## 👤 User Model

The User model contains:

```text
User
├── name
├── email
├── password
├── profileImage
├── isOnline
├── lastSeen
└── timestamps
```

Important fields:

### `name`

Stores the user's display name.

### `email`

Stores the user's email address.

### `password`

Stores the bcrypt-hashed password.

### `profileImage`

Stores the user's profile image URL.

### `isOnline`

Tracks the current online state.

### `lastSeen`

Stores the last known disconnect time.

---

# 💬 Conversation Model

The Conversation model contains:

```text
Conversation
├── participants[]
├── lastMessage
├── lastMessageAt
└── timestamps
```

### `participants`

References users participating in the conversation.

### `lastMessage`

References the latest message.

### `lastMessageAt`

Stores the timestamp used for conversation ordering and preview information.

---

# 💭 Message Model

The Message model contains:

```text
Message
├── conversation
├── sender
├── text
├── status
├── deliveredAt
├── readAt
└── timestamps
```

### `conversation`

References the conversation containing the message.

### `sender`

References the user who sent the message.

### `text`

Stores the message content.

### `status`

Stores message delivery state.

### `deliveredAt`

Stores delivery timestamp information.

### `readAt`

Stores read timestamp information.

---

# 🧠 Frontend Architecture

The frontend uses React Context API to manage application-level state.

There are two important contexts.

```text
AuthContext
     |
     +--> authentication
     +--> user
     +--> login
     +--> register
     +--> logout
     +--> socket lifecycle


ChatContext
     |
     +--> users
     +--> conversations
     +--> active conversation
     +--> messages
     +--> loading states
     +--> socket events
```

---

# 🔐 AuthContext

`AuthContext` is responsible for authentication state.

It manages:

* current user
* authentication loading state
* login
* registration
* logout
* JWT persistence
* session restoration
* Socket.IO connection
* Socket.IO disconnection

The context also normalizes the user ID so frontend components can consistently use:

```text
user._id
```

---

# 💬 ChatContext

`ChatContext` manages the chat application's state.

It handles:

* users
* conversations
* active conversation
* messages
* loading states
* user search
* conversation creation
* message fetching
* message sending
* typing events
* message deletion
* online status
* offline status

Incoming Socket.IO events directly update React state.

This allows the UI to react to real-time events without refetching the entire application state.

---

# 📡 REST API

All protected endpoints require JWT authentication unless stated otherwise.

---

## Authentication Routes

### Register

```http
POST /api/auth/register
```

Purpose:

```text
Create a new user account.
```

---

### Login

```http
POST /api/auth/login
```

Purpose:

```text
Authenticate a user and return a JWT.
```

---

# 👤 User Routes

### Current User

```http
GET /api/users/me
```

Returns the authenticated user.

---

### Get Users

```http
GET /api/users
```

Returns users available to the authenticated user.

---

### Search Users

```http
GET /api/users/search?q=<query>
```

Searches users using a name or email query.

---

### Get User

```http
GET /api/users/:id
```

Returns a specific user.

---

# 💬 Conversation Routes

### Get Conversations

```http
GET /api/conversations
```

Returns the authenticated user's conversations.

---

### Create / Get Conversation

```http
POST /api/conversations
```

Creates or retrieves a one-to-one conversation with another user.

---

# 💭 Message Routes

### Get Messages

```http
GET /api/messages/:conversationId
```

Returns paginated messages for a conversation.

Example:

```http
GET /api/messages/64f8c...?page=1&limit=30
```

---

### Send Message

```http
POST /api/messages
```

The backend provides a REST message endpoint, while the primary chat interface uses the Socket.IO:

```text
message:send
```

event for real-time messaging.

---

# 🔌 Socket Events

| Event               | Direction       | Purpose                               |
| ------------------- | --------------- | ------------------------------------- |
| `conversation:join` | Client → Server | Join an authorized conversation room  |
| `message:send`      | Client → Server | Send a message                        |
| `message:receive`   | Server → Client | Deliver a persisted message           |
| `message:delete`    | Both            | Delete and synchronize a message      |
| `typing:start`      | Client → Server | Start typing indicator                |
| `typing:stop`       | Client → Server | Stop typing indicator                 |
| `user:online`       | Server → Client | Notify clients that a user is online  |
| `user:offline`      | Server → Client | Notify clients that a user is offline |
| `message:error`     | Server → Client | Report socket operation errors        |

---

# 📊 Message Status

The Message model supports:

```text
sent
delivered
read
```

with timestamp fields:

```text
deliveredAt
readAt
```

The data model therefore provides a foundation for delivery/read tracking even as the current real-time flow primarily focuses on message creation, delivery, presence, and deletion.

---

# 🔒 Security

The application implements multiple authorization checks.

## Password Security

Passwords are hashed using:

```text
bcryptjs
```

Plain-text passwords are not stored.

---

## JWT Authentication

Protected REST routes verify JWT tokens before allowing access.

Socket.IO connections also verify the JWT during the connection handshake.

---

## Conversation Authorization

Before a user joins a conversation room, the server checks whether the authenticated user belongs to that conversation.

---

## Message Authorization

Before sending a message, the backend verifies that the authenticated user belongs to the conversation.

Before deleting a message, the backend verifies that:

```text
message.sender === authenticated user
```

---

## Password Protection

When users are populated for messaging operations, the password field is excluded.

---

## Environment Variables

Sensitive configuration such as:

```text
MONGO_URI
JWT_SECRET
CLIENT_URL
```

is supplied through environment variables.

---

## CORS

The backend configures CORS using the configured frontend client URL.

---

# ⚠️ Production Security Consideration

The current frontend stores the JWT in:

```text
localStorage
```

This works for the current application architecture but is not the strongest option for a production authentication system.

A future security-hardening approach could evaluate:

```text
HTTP-only Secure Cookies
        +
CSRF Protection
        +
Appropriate SameSite Configuration
```

based on the deployment architecture.

---

# 📂 Project Structure

```text
ChatApp-Real-Time-Chat-Application/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── conversationController.js
│   │   │   ├── messageController.js
│   │   │   └── userController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Conversation.js
│   │   │   └── Message.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── conversationRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   └── userRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── socket.js
│   │   │
│   │   ├── socket/
│   │   │   └── socketHandler.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
├── frontend/
│   │
│   ├── src/
│   │   │
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── conversation/
│   │   │   └── user/
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── .env
│
├── docs/
│   └── case-study-real-time-chat.md
│
└── README.md
 
```

The application intentionally combines REST and Socket.IO:

 
- **REST** handles authentication, user search, conversation retrieval, and message-history pagination.
- **Socket.IO** handles message delivery, typing, presence, conversation rooms, and message deletion.

## 🔐 Authentication Flow

1. User registers or logs in through the Express API.
2. Passwords are hashed/verified with bcrypt.
3. The server issues a JWT valid for 7 days.
4. React stores the token in localStorage.
5. Axios uses the token for protected API requests.
6. Socket.IO sends the same token during connection authentication.
7. The backend verifies the token and associates the authenticated user with the socket.

## 💬 Real-Time Message Flow

```text
Sender
  |
  | message:send
  v
Socket.IO Server
  |
  +--> validate conversation
  +--> verify participant
  +--> create Message
  +--> update Conversation
  |
  v
MongoDB
  |
  v
conversation:<conversationId>
  |
  +--------> Sender
  +--------> Receiver
              |
              v
       message:receive
```

Conversation-specific rooms keep real-time events scoped to the relevant participants.
 
# ⚙️ Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/sunny-raj-sah/ChatApp-Real-Time-Chat-Application.git
```

Navigate into the project:

```bash
cd ChatApp-Real-Time-Chat-Application
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

# 🎨 Frontend Setup

Open another terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Start the React application:

```bash
npm start
```

The frontend will normally run on:

```text
http://localhost:3000
```

---

# 🌐 Environment Variables

## Backend

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

## Frontend

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Never commit real secrets to GitHub.

---

# 🚀 Deployment

The application is deployed using separate frontend and backend services.

```text
Frontend
   |
   v
Vercel
   |
   | HTTP + Socket.IO
   v
Render
   |
   v
Node.js + Express + Socket.IO
   |
   v
MongoDB
```

### Frontend

Deployed using:

```text
Vercel
```

### Backend

The Express + Socket.IO server is deployed using:

```text
Render
```

### Database

The application uses:

```text
MongoDB
```

The production frontend receives the deployed API and Socket.IO URLs through environment variables.

---

# 🧩 Engineering Decisions

## Why React Context API?

The application needs shared state across multiple chat components.

Context API provides centralized state for:

```text
Authentication
Users
Conversations
Messages
Socket Events
```

without introducing an additional state-management library.
 

## ✍️ Typing & Presence

 
Typing is handled through transient Socket.IO events:

```text
typing:start
typing:stop
```

Presence is persisted on the user document:

```text
user:online  -> isOnline = true
user:offline -> isOnline = false + lastSeen
```

The React chat context updates users and conversation participants when these events arrive.
 
## Why REST + Socket.IO?

REST is appropriate for:

```text
Authentication
User search
Conversation retrieval
Message history
```

Socket.IO is appropriate for:

```text
Real-time messages
Typing indicators
Presence
Message deletion
```

Using both allows each communication method to handle the type of data it is best suited for.

---

## Why Conversation Rooms?

Instead of broadcasting every message to every connected socket, each conversation has its own room:

```text
conversation:<conversationId>
```

Only participants who have successfully joined that conversation room receive its real-time conversation events.
 

## 🗑️ Message Deletion

 
Only the sender can delete a message.

The backend:

1. Finds the message.
2. Verifies the authenticated socket user owns it.
3. Deletes it from MongoDB.
4. Finds the new latest message for the conversation.
5. Updates the conversation preview.
6. Emits the deletion event to the conversation room.

## 🗃️ Data Models

### User

```text
User
├── name
├── email
├── password
├── profileImage
├── isOnline
├── lastSeen
└── timestamps
```

### Conversation

```text
Conversation
├── participants[]
├── lastMessage
├── lastMessageAt
└── timestamps
```

### Message

```text
Message
├── conversation
├── sender
├── text
├── status
├── deliveredAt
├── readAt
└── timestamps
```

## 📂 Project Structure

```text
ChatApp-Real-Time-Chat-Application/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── socket/
│       ├── app.js
│       └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── chat/
│       │   ├── conversation/
│       │   └── user/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.js
│       └── index.js
├── docs/
│   └── case-study-real-time-chat.md
└── README.md
```

## ⚙️ Local Setup

### Clone

```bash
git clone https://github.com/sunny-raj-sah/ChatApp-Real-Time-Chat-Application.git
cd ChatApp-Real-Time-Chat-Application
```

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Run:

```bash
npm run dev
```

### Frontend

In another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

Run:

```bash
npm start
```

Open:

```text
http://localhost:3000
```
 
## Why Server-Side Authorization?

The frontend cannot be trusted to determine whether a user is allowed to access a conversation or delete a message.

Therefore the backend performs authorization checks using the authenticated user attached to the request/socket.

This provides an important security boundary between the client and the application's data.

---

## Why Persist Messages Before Broadcasting?

The backend first creates the message in MongoDB and then broadcasts the populated message.

```text
Create Message
      |
      v
MongoDB
      |
      v
Broadcast
```

This keeps persistent storage synchronized with the real-time event.

---

# 🧪 Error Handling

The application includes error handling for situations such as:

* missing authentication token
* invalid or expired JWT
* user not found
* conversation not found
* unauthorized conversation access
* missing message ID
* message not found
* unauthorized message deletion
* invalid message input
* socket connection errors

Socket errors are communicated through:

```text
message:error
```

---

# 📈 Scalability Considerations

The current implementation uses a single Socket.IO server.

For a horizontally scaled architecture with multiple backend instances, a shared Socket.IO adapter such as Redis could be introduced.

Example future architecture:

```text
                  Load Balancer
                       |
          +------------+------------+
          |                         |
          v                         v
     Node Server 1             Node Server 2
          |                         |
          +------------+------------+
                       |
                  Redis Adapter
                       |
                       v
                    MongoDB
```

This is a future architectural improvement rather than part of the current deployment.

---

# ⚠️ Current Limitations

The current project focuses primarily on one-to-one messaging.

Potential limitations include:

* no group conversations
* no message editing
* no file/image attachments
* no message reactions
* no push notifications
* limited unread-message functionality
* read/delivery workflows can be expanded
* Socket.IO scaling is currently single-server
* authentication can be further hardened for production
* automated test coverage can be expanded
 

## 🔌 REST API

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/me` | Current user |
| GET | `/api/users` | List users |
| GET | `/api/users/search?q=<query>` | Search users |
| GET | `/api/users/:id` | Get user |
| GET | `/api/conversations` | Get conversations |
| POST | `/api/conversations` | Create/get conversation |
| GET | `/api/messages/:conversationId` | Paginated message history |
| POST | `/api/messages` | REST message endpoint |


 HEADThe primary chat UI sends messages through Socket.IO.
 
## 👥 Group Chat

Extend the conversation model to support multiple participants.
 

## 🔌 Socket Events

 
| Event | Direction | Purpose |
|---|---|---|
| `conversation:join` | Client → Server | Join authorized room |
| `message:send` | Client → Server | Send message |
| `message:receive` | Server → Client | Deliver message |
| `message:delete` | Both | Delete/synchronize message |
| `typing:start` | Both | Start typing indicator |
| `typing:stop` | Both | Stop typing indicator |
| `user:online` | Server → Client | Presence update |
| `user:offline` | Server → Client | Presence update |
| `message:error` | Server → Client | Socket error |
 
## 📎 File Sharing

Add support for:

* images
* documents
* videos
* file attachments

---

## ✏️ Message Editing

Allow users to edit their own messages with appropriate authorization and real-time synchronization.

---

## 🔔 Notifications

Add:

* browser notifications
* unread counters
* notification preferences
* push notifications

---

## 😀 Message Reactions

Allow users to react to messages using emojis or predefined reactions.

---

## 🚀 Horizontal Socket Scaling

Introduce a Redis Socket.IO adapter when multiple backend instances are required.

---

## 🔐 Stronger Authentication

Evaluate:

* HTTP-only cookies
* refresh tokens
* CSRF protection
* token rotation
* session management

---

## 🧪 Automated Testing

Add tests for:

```text
Authentication
REST APIs
Authorization
MongoDB operations
Socket.IO events
Frontend components
Integration flows
```

---

## 📜 Large Message History

Introduce message virtualization and more advanced pagination/infinite scrolling for very large conversations.

---

# 🧠 Key Engineering Concepts Demonstrated
>>>>>>> 2a54fb5 (update feature)

## 🔒 Security

 
- bcrypt password hashing
- JWT verification
- Protected REST routes
- Authenticated Socket.IO connections
- Conversation membership checks
- Message ownership checks
- Password exclusion from populated user objects
- Environment-based secrets
- CORS configuration
 
```text
React
React Context API
React Hooks
Node.js
Express.js
REST APIs
MongoDB
Mongoose
JWT Authentication
bcrypt Password Hashing
Socket.IO
WebSockets
Real-Time Communication
Socket Authentication
Conversation Rooms
Authorization
Pagination
State Management
API Integration
Presence Tracking
Typing Indicators
Environment Variables
CORS
Vercel Deployment
Render Deployment
```

---

# 📚 What I Learned

Through this project, I worked with several important full-stack concepts.

### Authentication

Understanding how JWT authentication can be shared across REST APIs and Socket.IO connections.

### Real-Time Communication

Understanding how persistent WebSocket connections differ from traditional HTTP request/response communication.

### Socket Rooms

Learning how conversation-specific rooms can isolate real-time events between different conversations.

### Authorization

Implementing authorization checks on the backend rather than relying only on frontend restrictions.

### State Synchronization

Keeping React state synchronized with real-time server events.

### Database Relationships

Working with relationships between:

```text
Users
   ↓
Conversations
   ↓
Messages
```

### Production Deployment

Connecting:

```text
React → Vercel
Node.js + Socket.IO → Render
MongoDB → Database
```

and configuring environment variables between deployed services.

---

# 📸 Screenshots

Add project screenshots here.

Example:

```markdown
![Login](./docs/screenshots/login.png)

![Chat Interface](./docs/screenshots/chat.png)

![Conversation](./docs/screenshots/conversation.png)
```

Recommended screenshots:

1. Login page
2. Registration page
3. User search
4. Conversation sidebar
5. Real-time chat
6. Online/offline status
7. Typing indicator
8. Message deletion

---

# 🔗 Project Links

### Live Application

https://chat-app-real-time-chat-application-woad.vercel.app/login

### GitHub

https://github.com/sunny-raj-sah/ChatApp-Real-Time-Chat-Application

### Portfolio

https://portfolio-eight-vert-40.vercel.app/#projects
 
> The current frontend persists JWTs in localStorage. For stronger production session security, HTTP-only secure cookies can be evaluated with an appropriate CSRF strategy.

## 🚀 Deployment

- **Frontend:** Vercel
- **Backend + Socket.IO:** Render
- **Database:** MongoDB

## 📖 Engineering Case Study

Detailed architecture and implementation documentation:

**[Real-Time Chat Application Case Study](./docs/case-study-real-time-chat.md)**

## 🛣️ Future Improvements

- Group conversations
- Message editing
- Unread message counters
- Attachments and image sharing
- Message reactions
- Conversation deletion
- Push notifications
- Richer read/delivery event handling
- Redis Socket.IO adapter for horizontal scaling
- Automated API/frontend/socket tests
- Message virtualization for large histories

## 🔗 Links

- [Live Application](https://chat-app-real-time-chat-application-woad.vercel.app/login)
- [GitHub Repository](https://github.com/sunny-raj-sah/ChatApp-Real-Time-Chat-Application)
- [Sunny Raj Portfolio](https://portfolio-eight-vert-40.vercel.app/#projects)

## 👨‍💻 Author

## Sunny Raj

**Full Stack Engineer | Backend Engineer | AI Engineer**

B.Tech in Computer Science & Engineering

 
- GitHub: https://github.com/sunny-raj-sah
- Portfolio: https://portfolio-eight-vert-40.vercel.app/
 
### GitHub

https://github.com/sunny-raj-sah

### LinkedIn

https://linkedin.com/in/sunny-raj-885588313

### Portfolio

https://portfolio-eight-vert-40.vercel.app/

---

 
 
