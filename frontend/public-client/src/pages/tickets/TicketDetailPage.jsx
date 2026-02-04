import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import SetTitle from "@/components/common/SetTitle";

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.get(`http://localhost:3000/api/customer/tickets/${ticketId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      });
      setTicket(res.data.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Failed to load ticket details."
      );
      navigate("/messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplyLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `http://localhost:3000/api/customer/tickets/${ticketId}/replies`,
        { message_content: reply.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      toast.success("Reply sent!");
      setReply("");
      fetchTicket();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Failed to send reply."
      );
    } finally {
      setReplyLoading(false);
    }
  };

  const handleClose = async () => {
    setCloseLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:3000/api/customer/tickets/${ticketId}/close`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      toast.success("Ticket closed!");
      fetchTicket();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Failed to close ticket."
      );
    } finally {
      setCloseLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (!ticket) return null;
  const canReply = ticket.status !== "close";

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <SetTitle title={`Ticket #${ticket.ticket_id}`} />
      <CardHeader>
        <CardTitle>Ticket: {ticket.subject}</CardTitle>
        <div className="text-xs text-muted-foreground">
          Status: {ticket.status} | Created: {new Date(ticket.created_at).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="font-semibold">Description:</div>
          <div>{ticket.description}</div>
        </div>
        <div className="mb-4">
          <div className="font-semibold mb-2">Messages:</div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {ticket.messages && ticket.messages.length > 0 ? (
              ticket.messages.map((msg) => (
                <div key={msg.message_id} className="border rounded p-2">
                  <div className="text-xs text-gray-500">
                    {msg.sender_type === "customer" ? "You" : "Admin"} | {new Date(msg.created_at).toLocaleString()}
                  </div>
                  <div>{msg.message_content}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No messages yet.</div>
            )}
          </div>
        </div>


        {canReply && (
          <>
            <form onSubmit={handleReply} className="flex gap-2 mb-4">
              <Textarea
                className="flex-1"
                value={reply}
                onChange={e => setReply(e.target.value)}
                rows={2}
                maxLength={1000}
                placeholder="Type your reply..."
                required
                disabled={replyLoading}
              />
              <Button
                type="submit"
                variant="default"
                disabled={replyLoading || !reply.trim()}
              >
                {replyLoading ? "Sending..." : "Reply"}
              </Button>
            </form>


            {ticket.status === "open" && (
              <Button
                className="bg-red-700 hover:bg-red-400 text-white"
                onClick={handleClose}
                disabled={closeLoading}
              >
                {closeLoading ? "Closing..." : "Close Ticket"}
              </Button>
            )}
          </>
        )}

        {ticket.status === "close" && (
          <div className="text-green-600 font-semibold mt-4">This ticket is closed.</div>
        )}

        <Button className="mt-4" variant="outline" onClick={() => navigate("/tickets")}>
          Back to ticket list
        </Button>
      </CardContent>
    </Card>
  );
};

export default TicketDetailPage;