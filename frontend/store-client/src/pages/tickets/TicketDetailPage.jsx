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
      const res = await axios.get(
        `http://localhost:3000/api/store/tickets/${ticketId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      setTicket(res.data.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to load ticket details."
      );
      navigate("/tickets");
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

      // 🚨 TRY DIFFERENT DATA FORMATS
      const possibleDataFormats = [
        { message_content: reply.trim() },
        { content: reply.trim() },
        { message: reply.trim() },
        { reply: reply.trim() },
        { text: reply.trim() },
      ];

      let successResult = null;

      for (const dataFormat of possibleDataFormats) {
        try {
          console.error(`🚨 TRYING DATA FORMAT:`, dataFormat);

          const res = await axios.post(
            `http://localhost:3000/api/store/tickets/${ticketId}/reply`,
            dataFormat,
            {
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              withCredentials: true,
            }
          );

          console.error(`✅ SUCCESS WITH FORMAT:`, dataFormat);
          console.error(`✅ RESPONSE:`, res.data);

          successResult = res;
          break;
        } catch (formatErr) {
          console.error(
            `❌ FAILED WITH FORMAT:`,
            dataFormat,
            "Error:",
            formatErr.response?.status
          );
          continue;
        }
      }

      if (!successResult) {
        throw new Error("All data formats failed");
      }

      if (successResult.data.success) {
        toast.success("Reply sent successfully!");
        setReply("");
        fetchTicket();
      } else {
        throw new Error(successResult.data.message || "Failed to send reply");
      }
    } catch (err) {
      console.error("🚨 ALL FORMATS FAILED:", err);
      toast.error(err.message || "Failed to send reply");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleClose = async () => {
    setCloseLoading(true);
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:3000/api/store/tickets/${ticketId}/close`,
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
        err?.response?.data?.message || err.message || "Failed to close ticket."
      );
    } finally {
      setCloseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-border border-t-primary rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-16 h-16 text-muted-foreground mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Ticket Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The ticket you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button
            onClick={() => navigate("/tickets")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Back to Tickets
          </Button>
        </div>
      </div>
    );
  }

  const canReply = ticket.status !== "close" && ticket.status !== "closed";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto bg-card border-border shadow-2xl">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-card-foreground text-xl font-bold">
                  {ticket.subject}
                </CardTitle>
                {ticket.ticket_code && (
                  <p className="text-sm text-muted-foreground mt-1">
                    #{ticket.ticket_code}
                  </p>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  Status:{" "}
                  <span className="text-chart-2 font-medium">
                    {ticket.status}
                  </span>{" "}
                  | Created:{" "}
                  <span className="text-foreground">
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/tickets")}
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              >
                ← Back
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 bg-card">
            {/* Description Section */}
            <div className="mb-6">
              <div className="font-semibold text-foreground mb-3">
                Description:
              </div>
              <div className="bg-muted border border-border rounded-lg p-4 text-foreground">
                {ticket.description || "No description provided"}
              </div>
            </div>

            {/* Messages Section */}
            <div className="mb-6">
              <div className="font-semibold text-foreground mb-3">
                Messages:
                {ticket.messages && ticket.messages.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({ticket.messages.length} message
                    {ticket.messages.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto bg-muted rounded-lg p-4 border border-border custom-scrollbar">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((msg, index) => (
                    <MessageBubble
                      key={msg.message_id || `msg-${index}`}
                      message={msg}
                      currentUserType="store"
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <svg
                      className="w-12 h-12 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reply Form */}
            {canReply && (
              <div className="mb-6">
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <h3 className="font-semibold text-foreground mb-3">
                    Send Reply
                  </h3>
                  <form onSubmit={handleReply} className="space-y-3">
                    <Textarea
                      className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-ring focus:ring-ring"
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      maxLength={1000}
                      placeholder="Type your reply here..."
                      required
                      disabled={replyLoading}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {reply.length}/1000 characters
                      </span>
                      <Button
                        type="submit"
                        className="min-w-[100px] bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={replyLoading || !reply.trim()}
                      >
                        {replyLoading ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          "Send Reply"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              {canReply && ticket.status === "open" && (
                <Button
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleClose}
                  disabled={closeLoading}
                >
                  {closeLoading ? "Closing..." : "Close Ticket"}
                </Button>
              )}
            </div>

            {/* Closed Status */}
            {(ticket.status === "close" || ticket.status === "closed") && (
              <div className="bg-muted border border-border rounded-lg p-4 text-center mb-6">
                <svg
                  className="w-8 h-8 text-muted-foreground mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-semibold text-foreground">
                  This ticket is closed
                </p>
                <p className="text-sm text-muted-foreground">
                  No further replies can be added.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, currentUserType }) => {
  const isOwnMessage = () => {
    return message.sender_type === currentUserType;
  };

  const getSenderLabel = () => {
    switch (message.sender_type) {
      case "customer":
        return "Customer";
      case "admin":
        return "Support";
      case "store":
        return "Store";
      case "system":
        return "System";
      default:
        return "Unknown";
    }
  };

  const getBubbleClass = () => {
    if (isOwnMessage()) {
      return "bg-primary text-primary-foreground ml-auto border-border shadow-lg";
    }

    switch (message.sender_type) {
      case "admin":
      case "system":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20 shadow-lg";
      case "customer":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20 shadow-lg";
      default:
        return "bg-muted text-foreground border-border shadow-lg";
    }
  };

  const getSenderIcon = () => {
    const iconClass =
      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold";

    switch (message.sender_type) {
      case "customer":
        return (
          <div className={`${iconClass} bg-chart-1 text-chart-1-foreground`}>
            C
          </div>
        );
      case "admin":
      case "system":
        return (
          <div className={`${iconClass} bg-chart-2 text-chart-2-foreground`}>
            A
          </div>
        );
      case "store":
        return (
          <div className={`${iconClass} bg-chart-3 text-chart-3-foreground`}>
            S
          </div>
        );
      default:
        return (
          <div className={`${iconClass} bg-muted text-muted-foreground`}>?</div>
        );
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Unknown time";
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return "Invalid date" + e.message;
    }
  };

  return (
    <div
      className={`border rounded-lg p-3 max-w-[80%] transition-all duration-200 hover:shadow-xl ${getBubbleClass()}`}
    >
      <SetTitle title={`Ticket Detail`} />
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {getSenderIcon()}
          <span className="text-xs font-medium text-muted-foreground">
            {isOwnMessage() ? "You" : getSenderLabel()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatTime(message.created_at)}
        </span>
      </div>
      <div className="break-words leading-relaxed">
        {message.message_content || message.content || "No message content"}
      </div>
    </div>
  );
};

export default TicketDetailPage;
