// shared/components/MessageBubble.jsx
import React from 'react';

export const MessageBubble = ({ message, currentUserType, formatTime }) => {
  const isOwnMessage = () => {
    if (currentUserType === 'store') return message.sender_type === 'store';
    if (currentUserType === 'customer') return message.sender_type === 'customer';
    if (currentUserType === 'admin') return message.sender_type === 'admin';
    return false;
  };

  const getSenderLabel = () => {
    switch (message.sender_type) {
      case 'store': return 'Store';
      case 'customer': return 'Customer';
      case 'admin': return 'Support';
      case 'system': return 'System';
      default: return 'Unknown';
    }
  };

  const getBubbleClass = () => {
    if (isOwnMessage()) {
      return 'bg-blue-100 text-blue-900 ml-auto border-blue-200';
    }
    
    switch (message.sender_type) {
      case 'admin':
      case 'system':
        return 'bg-green-100 text-green-900 border-green-200';
      default:
        return 'bg-gray-100 text-gray-900 border-gray-200';
    }
  };

  return (
    <div className={`border rounded-lg p-3 max-w-[80%] ${getBubbleClass()}`}>
      <div className="flex justify-between items-center text-xs text-gray-600 mb-2">
        <span className="font-medium">
          {isOwnMessage() ? 'You' : getSenderLabel()}
        </span>
        <span>{formatTime(message.created_at)}</span>
      </div>
      <div className="break-words">
        {message.message_content || message.content || 'No message content'}
      </div>
    </div>
  );
};