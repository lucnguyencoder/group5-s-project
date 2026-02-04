import React, { useState, useEffect } from "react";
import TicketList from "../../components/tickets/TicketList";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from "sonner";
import SetTitle from "@/components/common/SetTitle";

export default function TicketsListPage() {
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [openTicketId, setOpenTicketId] = useState(null);
  const [ticketMessages, setTicketMessages] = useState({});
  const [loadingMessages, setLoadingMessages] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [replyError, setReplyError] = useState({});

  const getAuthHeaders = () => {
    const cookieToken = Cookies.get('token');
    const localToken = localStorage.getItem("token");
    const token = cookieToken || localToken;

    const headers = { "Content-Type": "application/json" };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  };

  // 🎯 Filter only TIC (Customer) tickets


  useEffect(() => {
    const fetchTickets = async () => {
      setLoadingTickets(true);
      try {
        const url = "http://localhost:3000/api/admin/tickets/all";

        const res = await axios.get(url, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });

        const ticketsData = Array.isArray(res.data.data) ? res.data.data : [];

        // 🎯 Filter only TIC tickets and sort them
        const ticTickets = filterTICTickets(ticketsData);
        const sortedTICTickets = sortTICTickets(ticTickets);
        setTickets(sortedTICTickets);

      } catch (err) {
        console.error("Failed to fetch tickets:", err, err?.response?.data);
        setTickets([]);
        toast.error(
          err?.response?.data?.message || "Failed to load tickets."
        );
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  const handleCloseTicket = async (ticketId) => {
    try {
      const url = `http://localhost:3000/api/admin/tickets/${ticketId}/close`;

      await axios.put(
        url,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      // Update ticket status and re-sort TIC tickets
      setTickets((prev) => {
        const updatedTickets = prev.map((t) =>
          t.ticket_id === ticketId ? { ...t, status: "closed" } : t
        );
        return sortTICTickets(updatedTickets);
      });

      toast.success("Ticket closed successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to close ticket!"
      );
    }
  };

  const handleReply = async (ticketId) => {
    const reply = replyInputs[ticketId]?.trim();
    if (!reply) {
      setReplyError((prev) => ({
        ...prev,
        [ticketId]: "Reply cannot be empty",
      }));
      return;
    }
    setReplyLoading((prev) => ({ ...prev, [ticketId]: true }));
    setReplyError((prev) => ({ ...prev, [ticketId]: "" }));

    try {
      const endpoint = `http://localhost:3000/api/admin/tickets/${ticketId}/reply`;

      const res = await axios.post(
        endpoint,
        { message_content: reply },
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      const responseData = res.data;

      const newMessage = {
        message_id: responseData.data?.message_id || Date.now(),
        message_content: reply,
        sender_type: "admin",
        created_at: new Date().toISOString(),
        ...responseData.data,
      };

      setTicketMessages((prev) => ({
        ...prev,
        [ticketId]: [...(prev[ticketId] || []), newMessage],
      }));

      setReplyInputs((prev) => ({ ...prev, [ticketId]: "" }));

      toast.success("Reply sent successfully!");
    } catch (err) {
      setReplyError((prev) => ({
        ...prev,
        [ticketId]: err.response?.data?.message || "Failed to reply",
      }));
      toast.error(
        err.response?.data?.message || "Failed to send reply!"
      );
    }
    setReplyLoading((prev) => ({ ...prev, [ticketId]: false }));
  };

  const handleOpenTicket = async (ticketId) => {
    if (ticketId === openTicketId) {
      setOpenTicketId(null);
      return;
    }

    setOpenTicketId(ticketId);
    if (!ticketMessages[ticketId] || ticketId === openTicketId) {
      setLoadingMessages((prev) => ({ ...prev, [ticketId]: true }));
      try {
        const url = `http://localhost:3000/api/admin/tickets/${ticketId}`;

        const res = await axios.get(url, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });
        setTicketMessages((prev) => ({
          ...prev,
          [ticketId]: res.data.data?.messages || [],
        }));
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setTicketMessages((prev) => ({ ...prev, [ticketId]: [] }));
        toast.error("Failed to load ticket messages.");
      }
      setLoadingMessages((prev) => ({ ...prev, [ticketId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Customer Support Tickets (TIC)</h1>
          <div className="text-sm text-muted-foreground">
            Showing only TIC tickets • Total: {tickets.length}
          </div>
        </div>

        <TicketList
          tickets={tickets}
          loadingTickets={loadingTickets}
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
        />

        {tickets.length === 0 && !loadingTickets && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-muted-foreground text-lg mb-2">No Customer Tickets Found</p>
            <p className="text-muted-foreground text-sm">Customer tickets (TIC) will appear here when they are created</p>
          </div>
        )}
      </div>
    </div>
  );
}