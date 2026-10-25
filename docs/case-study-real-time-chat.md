# Chat App

## Overview

ChatApp is a full-stack real-time messaging application built with React, Node.js, Express.js, MongoDB, and Socket.IO.

The project was designed to solve a common real-time communication problem: users should be able to authenticate, discover other users, create one-to-one conversations, exchange messages without refreshing the page, see presence changes, receive typing indicators, and remove their own messages while keeping the conversation state synchronized.

## Problem

A traditional REST-only chat implementation requires the client to repeatedly request new messages. That approach adds unnecessary polling and makes interactions such as typing indicators and online presence difficult to represent naturally.

The application therefore separates responsibilities:

- REST APIs handle authentication, users, conversations, and initial message/history retrieval.
- Socket.IO handles events that need immediate synchronization.
- MongoDB persists users, conversations, and messages.
- React Context API coordinates authentication and chat state on the client.

## Solution

The application combines RESTful APIs with authenticated Socket.IO communication.

At login or registration, the backend returns a JWT. The frontend stores the token and uses it for protected API requests and Socket.IO authentication. After the socket connection is authenticated, the server associates the socket with the corresponding user.

For a selected conversation, the client joins a conversation-specific Socket.IO room. Messages and conversation events are then delivered to the users participating in that room.

## Architecture

```text
                         React Frontend
                              |
                 +------------+------------+
                 |                         |
              Axios                   Socket.IO Client
                 |                         |
                 v                         v
        Express REST API             Socket.IO Server
                 |                         |
                 +------------+------------+
                              |
                           MongoDB
                              |
                  +-----------+-----------+
                  |           |           |
                Users   Conversations  Messages
```

The backend follows a controller / route / middleware / model structure, while Socket.IO event handling is isolated in `backend/src/socket/socketHandler.js`.

## Authentication

Authentication is JWT-based.

### Registration

1. The user submits name, email, and password.
2. The backend validates the required fields and password length.
3. The email is normalized to lowercase.
4. The password is hashed with bcrypt.
5. A user document is created.
6. A seven-day JWT is generated and returned with the user data.

### Login

1. The backend finds the user by normalized email.
2. bcrypt compares the supplied password with the stored hash.
3. The user's online state is updated.
4. A seven-day JWT is returned.

The frontend stores the token in `localStorage`, restores the session through `GET /api/users/me`, and establishes the Socket.IO connection using the same JWT.

## Protected REST APIs

Protected routes use an authentication middleware that verifies the Bearer token and loads the authenticated user.

The main API groups are:

| Area | Endpoints |
|---|---|
| Authentication | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET /api/users`, `GET /api/users/search`, `GET /api/users/:id`, `GET /api/users/me` |
| Conversations | `GET /api/conversations`, `POST /api/conversations` |
| Messages | `GET /api/messages/:conversationId`, `POST /api/messages` |

Message history supports pagination. The backend caps the requested page size at 100 messages.

## Data Model

### User

The user model stores:

- name
- email
- hashed password
- profile image URL
- online state
- last-seen timestamp
- timestamps

### Conversation

A conversation contains:

- participant user references
- latest message reference
- latest message timestamp
- timestamps

A participant index is defined to support conversation lookups.

### Message

A message contains:

- conversation reference
- sender reference
- text
- status
- delivered timestamp
- read timestamp
- timestamps

The message collection has an index on conversation and creation time to support ordered conversation-history queries.

## Real-Time Communication

Socket.IO is responsible for events where immediate synchronization matters.

The server authenticates every socket connection with the JWT supplied through `socket.handshake.auth.token`.

After authentication, the server stores the user on the socket:

```js
socket.user = user;
```

This means later socket events can use the authenticated user identity without trusting a user ID supplied by the client.

## Conversation Rooms

When a user opens a conversation, the client emits:

```text
conversation:join
```

The server:

1. Finds the conversation.
2. Checks that the authenticated socket user is a participant.
3. Joins the socket to `conversation:<conversationId>`.

This participant check prevents an authenticated user from simply joining an arbitrary conversation room.

## Message Flow

Messages are sent through Socket.IO rather than requiring a page refresh.

```text
Sender
  |
  | message:send
  v
Socket.IO Server
  |
  |-- validate conversation
  |-- validate participant
  |-- create Message
  |-- update Conversation.lastMessage
  |
  v
MongoDB
  |
  v
conversation:<conversationId>
  |
  +--------> Sender
  |
  +--------> Other participant
       message:receive
```

The server persists the message before broadcasting it. The conversation's latest-message reference and timestamp are also updated.

## Typing Indicators

Typing state is intentionally transient and is not stored in MongoDB.

The client emits:

```text
typing:start
typing:stop
```

The server forwards those events to the other sockets in the conversation room using `socket.to(room)`.

This keeps ephemeral UI state separate from persistent message data.

## Online / Offline Presence

The server updates the user's presence when the socket connects and disconnects.

On connection:

- `isOnline` becomes `true`
- `lastSeen` is cleared
- `user:online` is broadcast

On disconnect:

- `isOnline` becomes `false`
- `lastSeen` is set to the current time
- `user:offline` is broadcast

The React chat context consumes these events and updates both the user list and conversation participants.

## Message Deletion

Users can delete only their own messages.

The deletion flow is:

```text
Client
  |
  | message:delete
  v
Socket.IO Server
  |
  |-- find message
  |-- verify sender ownership
  |-- find conversation
  |-- delete message
  |-- find replacement latest message
  |-- update conversation preview
  |
  v
message:delete
  |
  +--------> Conversation participants
```

After deletion, the server recalculates the conversation's latest message. This is important because deleting the most recent message should not leave the sidebar pointing at a message that no longer exists.

## Frontend State Management

The frontend uses React Context API for application-level state.

### AuthContext

Responsible for:

- restoring the authenticated session
- login
- registration
- logout
- JWT persistence
- Socket.IO connection lifecycle
- normalizing the authenticated user ID

### ChatContext

Responsible for:

- user search results
- conversations
- active conversation
- messages
- loading states
- fetching conversation history
- creating conversations
- sending messages through Socket.IO
- typing events
- message deletion
- online/offline event synchronization

Incoming Socket.IO events update React state directly, so the UI can reflect changes without another full conversation fetch.

## Message History and Pagination

The REST message endpoint supports:

```text
GET /api/messages/:conversationId?page=1&limit=30
```

The backend:

- validates that the conversation exists
- verifies the authenticated user is a participant
- orders messages by creation time
- applies pagination
- returns pagination metadata

The default page size is 30 and the maximum accepted limit is 100.

## Security Considerations

The project includes several authorization checks:

- passwords are hashed with bcrypt
- protected REST routes use JWT middleware
- Socket.IO connections require a valid JWT
- conversation room joining checks conversation membership
- message sending checks conversation membership
- message deletion checks message ownership
- password fields are excluded from populated user responses
- secrets and database configuration are supplied through environment variables
- CORS is configured through the backend environment

One important production consideration is that the current authentication token is stored in browser `localStorage`. A future production-hardening step could move session handling toward secure, HTTP-only cookies depending on the deployment architecture.

## Engineering Decisions

### REST + Socket.IO instead of Socket.IO for everything

REST is a natural fit for authentication and initial data retrieval. Socket.IO is then used for state changes that benefit from immediate delivery.

This keeps persistent resource operations understandable while giving the chat experience real-time behavior.

### Conversation-specific rooms

Using a room per conversation limits message and typing broadcasts to the relevant participants instead of broadcasting every conversation event to every connected socket.

### Server-side authorization

The server does not trust the conversation or message ownership implied by the client. It derives the authenticated user from the verified JWT and performs membership/ownership checks before sensitive operations.

### Persistent versus transient state

Messages, conversations, and presence timestamps are stored in MongoDB. Typing indicators remain transient Socket.IO events because they represent short-lived UI state.

## Deployment

The repository contains separate frontend and backend applications.

- Frontend: deployed on Vercel
- Backend API and Socket.IO server: deployed on Render
- Database: MongoDB

The production frontend uses environment configuration for the API and Socket.IO server URLs.

## Limitations

The current implementation is intentionally focused on a one-to-one chat experience.

Known areas for further improvement include:

- group conversations
- message editing
- richer read/delivery workflows
- attachments
- unread counters
- conversation deletion
- Redis-backed Socket.IO scaling
- stronger production session handling
- automated test coverage
- message virtualization for very large histories

## Future Improvements

### Group Chat

Extend the conversation model and authorization rules to support multiple participants and group administration.

### Horizontal Socket Scaling

Introduce a Socket.IO adapter such as Redis when multiple backend instances are required.

### Better Session Security

Evaluate secure HTTP-only cookie-based session handling and CSRF protections for the deployment architecture.

### Rich Messaging

Add file/image attachments, message reactions, editing, replies, and richer notifications.

### Testing

Add automated API, authentication, socket-event, and frontend integration tests.

## Tech Stack

### Frontend

- React 19
- React Router
- Context API
- Axios
- Socket.IO Client
- Bootstrap 5
- Bootstrap Icons
- Emoji Picker React

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- Socket.IO
- JSON Web Tokens
- bcryptjs
- CORS
- dotenv

## Project Structure

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
├── README.md
└── docs/
    └── case-study-real-time-chat.md
```

## Links

- [Live Application](https://chat-app-real-time-chat-application-woad.vercel.app/login)
- [GitHub Repository](https://github.com/sunny-raj-sah/ChatApp-Real-Time-Chat-Application)
- [Portfolio](https://portfolio-eight-vert-40.vercel.app/#projects)
