import React from "react";
import TicketItem from "./TicketItem";
import { useUserRole } from "../../context/UserRoleContext"; 


export default function TicketList({
  tickets,
  loadingTickets,
  openTicketId,
  handleOpenTicket,
  ticketMessages,
  loadingMessages,
  replyInputs,
  setReplyInputs,
  replyLoading,
  replyError,
  handleReply,
  handleCloseTicket,
  handleChangeStatus, // Thêm prop này
}) {
  const { userRole } = useUserRole();

  if (loadingTickets) {
    return <div className="text-gray-500 text-sm">Loading tickets...</div>;
  }
  if (!tickets || tickets.length === 0) {
    return <div className="text-gray-500 text-sm">No tickets found.</div>;
  }
  return (
    <ul className="divide-y divide-gray-200">
      {tickets.map((ticket) => (
        <TicketItem
          key={ticket.ticket_id}
          ticket={ticket}
          openTicketId={openTicketId}
          handleOpenTicket={handleOpenTicket}
          ticketMessages={ticketMessages}
          loadingMessages={loadingMessages}
          replyInputs={replyInputs}
          setReplyInputs={setReplyInputs}
          replyLoading={replyLoading}
          replyError={replyError}
          handleReply={handleReply}
          handleCloseTicket={handleCloseTicket}
          userRole={userRole}
          handleChangeStatus={handleChangeStatus} 
          handleStatusChange={handleChangeStatus}
        />
      ))}
    </ul>
  );
}