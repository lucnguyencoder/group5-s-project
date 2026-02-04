# Customer Chat Integration Guide

This guide explains how to implement the chat functionality for customers in your frontend application.

## API Endpoints

### Get All Conversations

```javascript
GET / api / customer / conversations;
```

Query parameters:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of conversations per page (default: 20)

Response:

```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "customer_id": "user-uuid",
        "store_id": "store-uuid",
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z",
        "last_message_at": "2023-01-01T00:00:00Z",
        "store": {
          "id": "store-uuid",
          "name": "Store Name",
          "logo_url": "https://example.com/logo.jpg"
        },
        "lastMessage": {
          "id": "message-uuid",
          "content": "Hello",
          "image_url": null,
          "sender_id": "user-uuid",
          "sender_type": "customer",
          "created_at": "2023-01-01T00:00:00Z",
          "is_read": true
        },
        "unreadCount": 0
      }
    ],
    "totalCount": 10,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

### Start a New Conversation

```javascript
POST / api / customer / conversations / start;
```

Request body:

```json
{
  "storeId": "store-uuid"
}
```

Response:

```json
{
  "success": true,
  "message": "New conversation created",
  "data": {
    "id": "conversation-uuid",
    "customer_id": "user-uuid",
    "store_id": "store-uuid",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "last_message_at": "2023-01-01T00:00:00Z",
    "customer": {
      "id": "user-uuid",
      "email": "user@example.com",
      "profile_picture": "https://example.com/avatar.jpg"
    },
    "store": {
      "id": "store-uuid",
      "name": "Store Name",
      "logo_url": "https://example.com/logo.jpg"
    }
  }
}
```

### Get a Conversation with Messages

```javascript
GET /api/customer/conversations/:conversationId
```

Query parameters:

- `page` (optional): Page number for messages (default: 1)
- `limit` (optional): Number of messages per page (default: 20)

Response:

```json
{
  "success": true,
  "data": {
    "id": "conversation-uuid",
    "customer_id": "user-uuid",
    "store_id": "store-uuid",
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "last_message_at": "2023-01-01T00:00:00Z",
    "customer": {
      "id": "user-uuid",
      "email": "user@example.com",
      "profile_picture": "https://example.com/avatar.jpg"
    },
    "store": {
      "id": "store-uuid",
      "name": "Store Name",
      "logo_url": "https://example.com/logo.jpg"
    },
    "messages": [
      {
        "id": "message-uuid",
        "conversation_id": "conversation-uuid",
        "sender_id": "user-uuid",
        "sender_type": "customer",
        "content": "Hello",
        "image_url": null,
        "replied_to_id": null,
        "reactions": [],
        "order_id": null,
        "food_id": null,
        "is_read": true,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z",
        "repliedTo": null
      }
    ]
  }
}
```

### Get Messages from a Conversation

```javascript
GET /api/customer/conversations/:conversationId/messages
```

Query parameters:

- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of messages per page (default: 20)

Response:

```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "message-uuid",
        "conversation_id": "conversation-uuid",
        "sender_id": "user-uuid",
        "sender_type": "customer",
        "content": "Hello",
        "image_url": null,
        "replied_to_id": null,
        "reactions": [],
        "order_id": null,
        "food_id": null,
        "is_read": true,
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z",
        "repliedTo": null
      }
    ],
    "totalCount": 50,
    "totalPages": 3,
    "currentPage": 1
  }
}
```

### Send a Message

```javascript
POST /api/customer/conversations/:conversationId/messages
```

Request body (form-data):

- `content` (optional): Text content of the message
- `image` (optional): Image file (max 5MB)
- `repliedToId` (optional): ID of the message being replied to
- `orderId` (optional): ID of a related order
- `foodId` (optional): ID of a related food item

Response:

```json
{
  "success": true,
  "data": {
    "id": "message-uuid",
    "conversation_id": "conversation-uuid",
    "sender_id": "user-uuid",
    "sender_type": "customer",
    "content": "Hello",
    "image_url": "https://example.com/message-image.jpg",
    "replied_to_id": "another-message-uuid",
    "reactions": [],
    "order_id": "order-uuid",
    "food_id": "food-uuid",
    "is_read": false,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z",
    "repliedTo": {
      "id": "another-message-uuid",
      "content": "Previous message",
      "image_url": null,
      "sender_id": "store-owner-uuid",
      "sender_type": "store"
    }
  }
}
```

### React to a Message

```javascript
POST /api/customer/conversations/messages/:messageId/reactions
```

Request body:

```json
{
  "reaction": "like" // Allowed values: like, love, laugh, wow, sad, angry
}
```

Response:

```json
{
  "success": true,
  "data": {
    "reactions": [
      {
        "userId": "user-uuid",
        "type": "like"
      }
    ]
  }
}
```

### Remove a Reaction

```javascript
DELETE /api/customer/conversations/messages/:messageId/reactions
```

Response:

```json
{
  "success": true,
  "data": {
    "reactions": []
  }
}
```

### Mark Messages as Read

```javascript
POST /api/customer/conversations/:conversationId/read
```

Response:

```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

## Real-time Chat with Socket.io

### Setup Socket.io Connection

First, install the socket.io client library:

```bash
npm install socket.io-client
```

Then, create a chat service to manage the socket connection:

```javascript
import { io } from "socket.io-client";

let socket;

export const connectToChat = (token) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(`${API_BASE_URL}/chat`, {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("Connected to chat server");
  });

  socket.on("error", (error) => {
    console.error("Chat socket error:", error);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from chat server");
  });

  return socket;
};

export const disconnectFromChat = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
```

### Joining a Conversation

```javascript
export const joinConversation = (conversationId) => {
  if (!socket) return;
  socket.emit("join-conversation", conversationId);

  // Listen for the confirmation
  socket.on("joined-conversation", (data) => {
    console.log(`Joined conversation: ${data.conversationId}`);
  });
};
```

### Listening for Messages

```javascript
export const listenForMessages = (callback) => {
  if (!socket) return;

  socket.on("message", (message) => {
    callback(message);
  });
};
```

### Sending a Message

```javascript
export const sendMessage = (conversationId, messageData) => {
  if (!socket) return;

  socket.emit("new-message", {
    conversationId,
    messageData,
  });
};
```

### Message Reactions

```javascript
export const sendReaction = (messageId, reaction) => {
  if (!socket) return;

  socket.emit("message-reaction", {
    messageId,
    reaction,
  });
};

export const listenForReactions = (callback) => {
  if (!socket) return;

  socket.on("reaction", (reactionData) => {
    callback(reactionData);
  });
};
```

### Reading Status

```javascript
export const notifyReading = (conversationId) => {
  if (!socket) return;

  socket.emit("reading-messages", conversationId);
};

export const listenForReadingStatus = (callback) => {
  if (!socket) return;

  socket.on("reading", (readingData) => {
    callback(readingData);
  });
};
```

## Complete Implementation Example

Here's an example of a React component implementing the chat functionality:

```jsx
import React, { useEffect, useState, useRef } from "react";
import {
  connectToChat,
  disconnectFromChat,
  joinConversation,
  listenForMessages,
  sendMessage,
  sendReaction,
  listenForReactions,
  notifyReading,
  listenForReadingStatus,
} from "../services/chatService";
import { getMessages, markAsRead } from "../services/api";

function ChatComponent({ conversationId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socket.current = connectToChat(localStorage.getItem("token"));

    return () => {
      disconnectFromChat();
    };
  }, []);

  // Load initial messages and join conversation
  useEffect(() => {
    if (conversationId) {
      loadMessages();
      joinConversation(conversationId);
      markAsRead(conversationId);

      // Set up listeners
      listenForMessages((message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      listenForReactions((reactionData) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === reactionData.messageId
              ? {
                  ...msg,
                  reactions: [
                    ...msg.reactions.filter(
                      (r) => r.userId !== reactionData.userId
                    ),
                    {
                      userId: reactionData.userId,
                      type: reactionData.reaction,
                    },
                  ],
                }
              : msg
          )
        );
      });

      listenForReadingStatus((readingData) => {
        console.log(`User ${readingData.userId} is reading the conversation`);
        // You can implement a visual indicator here
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("message");
        socket.current.off("reaction");
        socket.current.off("reading");
      }
    };
  }, [conversationId]);

  const loadMessages = async (loadMore = false) => {
    if (loading) return;

    try {
      setLoading(true);
      const pageToLoad = loadMore ? page + 1 : 1;

      const response = await getMessages(conversationId, pageToLoad);

      if (response.success) {
        if (loadMore) {
          setMessages((prev) => [...response.data.messages, ...prev]);
        } else {
          setMessages(response.data.messages);
          scrollToBottom();
        }

        setPage(pageToLoad);
        setHasMore(pageToLoad < response.data.totalPages);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!newMessage.trim() && !image) return;

    const messageData = {
      content: newMessage,
      image_url: null, // This will be set by the server
      replied_to_id: replyTo?.id || null,
      order_id: null, // Set this if relevant
      food_id: null, // Set this if relevant
    };

    // Send through API
    const formData = new FormData();
    formData.append("content", newMessage);
    if (image) formData.append("image", image);
    if (replyTo) formData.append("repliedToId", replyTo.id);

    fetch(`/api/customer/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    // Send through socket for real-time update
    sendMessage(conversationId, messageData);

    // Reset form
    setNewMessage("");
    setImage(null);
    setReplyTo(null);
  };

  const handleReaction = (messageId, reaction) => {
    sendReaction(messageId, reaction);

    // Also update via API for persistence
    fetch(`/api/customer/conversations/messages/${messageId}/reactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ reaction }),
    });
  };

  const handleRemoveReaction = (messageId) => {
    sendReaction(messageId, null);

    // Also update via API for persistence
    fetch(`/api/customer/conversations/messages/${messageId}/reactions`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.currentTarget;

    // Load more messages when scrolling to the top
    if (scrollTop === 0 && hasMore && !loading) {
      loadMessages(true);
    }

    // Notify when user is reading
    notifyReading(conversationId);
  };

  const handleReply = (message) => {
    setReplyTo(message);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container" onScroll={handleScroll}>
        {loading && <div className="loading-indicator">Loading...</div>}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.sender_id === currentUser.id ? "outgoing" : "incoming"
            }`}
          >
            {message.repliedTo && (
              <div className="replied-message">
                <p>{message.repliedTo.content}</p>
                {message.repliedTo.image_url && (
                  <img
                    src={message.repliedTo.image_url}
                    alt="Replied message attachment"
                    className="thumbnail"
                  />
                )}
              </div>
            )}

            <div className="message-content">
              {message.content && <p>{message.content}</p>}
              {message.image_url && (
                <img src={message.image_url} alt="Message attachment" />
              )}
            </div>

            <div className="message-footer">
              <span className="timestamp">
                {new Date(message.created_at).toLocaleTimeString()}
              </span>

              <div className="reactions">
                {message.reactions.map((reaction, index) => (
                  <span key={index} className="reaction">
                    {reaction.type}
                  </span>
                ))}

                <div className="reaction-buttons">
                  <button onClick={() => handleReaction(message.id, "like")}>
                    👍
                  </button>
                  <button onClick={() => handleReaction(message.id, "love")}>
                    ❤️
                  </button>
                  <button onClick={() => handleReaction(message.id, "laugh")}>
                    😂
                  </button>
                  <button onClick={() => handleReaction(message.id, "wow")}>
                    😮
                  </button>
                  <button onClick={() => handleReaction(message.id, "sad")}>
                    😢
                  </button>
                  <button onClick={() => handleReaction(message.id, "angry")}>
                    😠
                  </button>
                  <button onClick={() => handleRemoveReaction(message.id)}>
                    ❌
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleReply(message)}
                className="reply-button"
              >
                Reply
              </button>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        {replyTo && (
          <div className="reply-preview">
            <p>Replying to: {replyTo.content}</p>
            <button onClick={() => setReplyTo(null)}>Cancel</button>
          </div>
        )}

        {image && (
          <div className="image-preview">
            <img src={URL.createObjectURL(image)} alt="Upload preview" />
            <button onClick={() => setImage(null)}>Remove</button>
          </div>
        )}

        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />

          <label className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            📎
          </label>

          <button type="submit" disabled={!newMessage.trim() && !image}>
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatComponent;
```

## Best Practices

1. **Pagination**: Always implement infinite scrolling with the pagination parameters to load older messages.

2. **Real-time Updates**: Use Socket.io for real-time messaging but always send HTTP requests for persistence.

3. **Error Handling**: Implement proper error handling for both API calls and socket connections.

4. **Offline Support**: Consider implementing offline message queuing to improve user experience.

5. **Image Optimization**: Compress images before uploading to improve performance.

6. **Read Receipts**: Update message read status in real-time using the socket events.

7. **Security**: Never trust client-side data; always validate on the server.
