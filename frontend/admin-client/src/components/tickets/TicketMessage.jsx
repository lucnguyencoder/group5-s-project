import React from "react";
import { Badge } from "@/components/ui/badge";


const getReplyHistory = (ticketId) => {
  try {
    const data = localStorage.getItem(`reply_history_${ticketId}`);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};


export default function TicketMessage({ messages, loading, userRole, ticketId }) {
  if (loading) {
    return (
      <div className="text-xs text-gray-400 py-2">Loading messages...</div>
    );
  }
  
  const replyHistory = getReplyHistory(ticketId);

  
  const allMessages = [
    ...(messages || []),
    ...replyHistory
      .filter(
        (msg) =>
          !(messages || []).some(
            (m) => m.message_content === msg && m.sender_type === userRole
          )
      )
      .map((msg, idx) => ({
        message_id: `local-${idx}`,
        message_content: msg,
        sender_type: userRole,
        created_at: new Date().toISOString(),
        isLocal: true,
      })),
  ];

  if (!allMessages || allMessages.length === 0) {
    return (
      <div className="text-xs text-gray-400 py-2">
        No messages for this ticket.
      </div>
    );
  }

  
 const getSenderDisplayName = (senderType, userRole) => {
  if (senderType === "admin") { 
    return "Admin";
  }
  if (senderType === userRole) {
    return "User"; 
  }
  
  return "Admin";
};

  return (
    <ul className="text-sm space-y-2 max-h-60 overflow-y-auto pr-2">
      {allMessages.map((msg) => (
        <li key={msg.message_id} className="border-b pb-2 last:border-b-0">
          <div className="flex items-center gap-2">
           
            <Badge variant={msg.sender_type === userRole ? "default" : "secondary"}>
              {getSenderDisplayName(msg.sender_type)}
            </Badge>
            <span className="text-gray-800">{msg.message_content}</span>
            {msg.isLocal && (
              <span className="ml-2 text-xs text-yellow-500">(local)</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(msg.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}