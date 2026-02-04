import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import SetTitle from "@/components/common/SetTitle";

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      setError("");
      try {
        const token = Cookies.get("token");
        const res = await axios.get("http://localhost:3000/api/customer/tickets", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        });
        setTickets(res.data.data || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          err.message ||
          "Failed to load tickets."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex justify-center items-start bg-muted">
      <SetTitle title="My Tickets" />
      <Card className="w-full max-w-4xl mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && tickets.length === 0 && (
            <div>No tickets found. You can create a new ticket from your account page.</div>
          )}
          <ul className="divide-y">
            {tickets.map((ticket) => (
              <li key={ticket.ticket_id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {ticket.status} | {new Date(ticket.created_at).toLocaleString()}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(`/messages/${ticket.ticket_id}`)}
                >
                  View
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketListPage;