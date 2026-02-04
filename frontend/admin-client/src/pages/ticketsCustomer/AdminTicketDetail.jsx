import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SetTitle from "@/components/common/SetTitle";

const statusOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const AdminTicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getToken = () => {
    const cookieToken = Cookies.get("token");
    const localToken = localStorage.getItem("token");
    return cookieToken || localToken || null;
  };

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      const res = await axios.get(`http://localhost:3000/api/admin/profile`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      });
      setCurrentUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:3000/api/admin/tickets/${ticketId}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      setTicket(res.data.data);
      setStatus(res.data.data.status);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again!");
      } else {
        toast.error(
          err?.response?.data?.message ||
          err.message ||
          "Unable to load ticket information"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchTicket();
  }, [ticketId]);

  const handleStatusBadgeClick = () => {
    setShowDropdown(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status) {
      setShowDropdown(false);
      return;
    }

    try {
      const token = getToken();
      await axios.put(
        `http://localhost:3000/api/admin/tickets/${ticketId}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      setStatus(newStatus);
      toast.success("Status updated successfully!");
      fetchTicket();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Failed to update status!"
      );
    } finally {
      setShowDropdown(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setReplyLoading(true);
    try {
      const token = getToken();
      const res = await axios.post(
        `http://localhost:3000/api/admin/tickets/${ticketId}/reply`,
        { message_content: reply.trim() },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );
      toast.success("Reply sent successfully!");
      setReply("");
      fetchTicket();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to send reply"
      );
    } finally {
      setReplyLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30";
      case "in_progress":
        return "bg-chart-2/20 text-chart-2 border-chart-2/30";
      case "resolved":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      case "closed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-accent text-accent-foreground border-border";
    }
  };

  const statusLabel =
    statusOptions.find((opt) => opt.value === status)?.label || status;

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
            The ticket you're looking for doesn't exist.
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

  return (
    <div className="min-h-screen bg-background">
      <SetTitle title={`Ticket Details`} />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto bg-card border-border shadow-xl">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-card-foreground text-xl font-bold mb-2">
                  {ticket.subject}
                </CardTitle>
                {ticket.ticket_code && (
                  <p className="text-sm text-muted-foreground mb-3">
                    #{ticket.ticket_code}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Status:</span>
                    <div className="relative" ref={dropdownRef}>
                      <span
                        className={`inline-block px-3 py-1 rounded-md border font-medium cursor-pointer select-none transition-colors ${getStatusColor(
                          status
                        )}`}
                        onClick={handleStatusBadgeClick}
                        tabIndex={0}
                      >
                        {statusLabel}
                      </span>
                      {showDropdown && (
                        <div className="absolute z-10 mt-1 bg-popover border border-border rounded-md shadow-lg min-w-[140px]">
                          {statusOptions.map((opt) => (
                            <div
                              key={opt.value}
                              className={`px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors ${opt.value === status
                                ? "bg-accent text-accent-foreground font-medium"
                                : "text-popover-foreground"
                                }`}
                              onClick={() => handleStatusChange(opt.value)}
                            >
                              {opt.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-muted-foreground">
                    Created: {new Date(ticket.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/tickets/user")}
                className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ml-4"
              >
                ← Back
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 bg-card">
            <div className="mb-6">
              <div className="font-semibold text-foreground mb-3">
                Description:
              </div>
              <div className="bg-muted border border-border rounded-lg p-4 text-foreground">
                {ticket.description || "No description provided"}
              </div>
            </div>

            <div className="mb-6">
              <div className="font-semibold text-foreground mb-3">
                Messages:
                {ticket.messages && ticket.messages.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (
                    {ticket.messages.length} message
                    {ticket.messages.length !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto bg-muted rounded-lg p-4 border border-border">
                {ticket.messages && ticket.messages.length > 0 ? (
                  ticket.messages.map((msg) => (
                    <div
                      key={msg.message_id}
                      className={`border rounded-lg p-3 transition-all duration-200 ${msg.sender_type === "admin"
                        ? "bg-primary/10 text-primary border-primary/20 ml-auto max-w-[80%]"
                        : "bg-chart-1/10 text-chart-1 border-chart-1/20 max-w-[80%]"
                        }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${msg.sender_type === "admin"
                              ? "bg-primary text-primary-foreground"
                              : "bg-chart-1 text-chart-1-foreground"
                              }`}
                          >
                            {msg.sender_type === "admin" ? "A" : "C"}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {msg.sender_type === "admin" ? "Admin" : "Customer"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="break-words leading-relaxed">
                        {msg.message_content}
                      </div>
                    </div>
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

            <div className="mb-6">
              <div className="bg-muted rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-foreground mb-3">Send Reply</h3>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTicketDetail;
