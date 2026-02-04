import React from "react";
import TicketMessage from "./TicketMessage";
import ReplyBox from "./ReplyBox";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminTicketDetail from "../../pages/ticketsCustomer/AdminTicketDetail"; // Thêm nếu dùng AdminTicketDetail

export default function TicketItem({
  ticket,
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
  userRole,
  handleChangeStatus, // Thêm prop này
}) {
  const handleClick = () => {
    handleOpenTicket(ticket.ticket_id);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle
          className="cursor-pointer hover:text-orange-600"
          onClick={handleClick}
        >
          Subject: {ticket.subject}
        </CardTitle>
        <CardDescription>
          Description: {ticket.description}
        </CardDescription>
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <span>Status:</span>
          <Badge variant={ticket.status === 'closed' ? 'destructive' : 'default'}>
            {ticket.status.toUpperCase()}
          </Badge>
          <span>| Created: {new Date(ticket.created_at).toLocaleString()}</span>
        </div>
      </CardHeader>

      {openTicketId === ticket.ticket_id && (
        <CardContent>
          {/* Nếu là admin, hiển thị AdminTicketDetail để đổi status */}
          {userRole === "admin" ? (
            <AdminTicketDetail
              ticket={ticket}
              handleStatusChange={(newStatus) => handleChangeStatus(ticket.ticket_id, newStatus)}
            />
          ) : (
            <>
              <h3 className="font-semibold text-sm mb-2">Ticket Messages</h3>
              <TicketMessage
                messages={ticketMessages[ticket.ticket_id]}
                loading={loadingMessages[ticket.ticket_id]}
                userRole={userRole}
              />
              {ticket.status !== "closed" && (
                <ReplyBox
                  ticketId={ticket.ticket_id}
                  replyInput={replyInputs[ticket.ticket_id] || ""}
                  setReplyInputs={setReplyInputs}
                  replyLoading={replyLoading[ticket.ticket_id]}
                  replyError={replyError[ticket.ticket_id]}
                  handleReply={handleReply}
                />
              )}
            </>
          )}
        </CardContent>
      )}

      <CardFooter className="flex justify-end">
        {ticket.status !== "closed" && (userRole === "customer" || userRole === "admin") && (
          <Button
            variant="destructive"
            onClick={() => handleCloseTicket(ticket.ticket_id)}
          >
            Close Ticket
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}