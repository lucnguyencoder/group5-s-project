import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Cookies from 'js-cookie';
import SetTitle from '@/components/common/SetTitle';

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = () => {
    const cookieToken = Cookies.get('token');
    const localToken = localStorage.getItem('token');
    return cookieToken || localToken || null;
  };

  // 🎯 Filter only TIC tickets
  const filterTICTickets = (ticketsArray) => {
    return ticketsArray.filter(ticket => {
      const ticketCode = ticket.ticket_code || ticket.ticket_id || "";
      return String(ticketCode).startsWith('TIC');
    });
  };

  // 🔄 Sort TIC tickets by ticket_id (newest first)
  const sortTICTickets = (ticketsArray) => {
    return ticketsArray.sort((a, b) => {
      // Sort by ticket_id numerically (newest first)
      const idA = parseInt(a.ticket_id) || 0;
      const idB = parseInt(b.ticket_id) || 0;
      return idB - idA;
    });
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = getToken();
        const response = await axios.get('http://localhost:3000/api/admin/tickets/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const ticketsData = Array.isArray(response.data.data) ? response.data.data : [];

        // 🎯 Filter only TIC tickets and sort them
        const ticTickets = filterTICTickets(ticketsData);
        const sortedTICTickets = sortTICTickets(ticTickets);
        setTickets(sortedTICTickets);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-chart-1/10 text-chart-1 border-chart-1/20">Open</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Closed</Badge>;
      default:
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SetTitle title="Tickets" />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Customer Support Tickets (TIC)</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4 bg-card border-border">
                <Skeleton className="h-4 w-1/4 mb-2 bg-muted" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Customer Support Tickets (TIC)</h1>
          <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg text-destructive">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Customer Support Tickets (TIC)</h1>
          <div className="text-sm text-muted-foreground">
            TIC tickets only • Total: {tickets.length}
          </div>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-muted-foreground text-lg mb-2">No TIC tickets found</p>
            <p className="text-muted-foreground text-sm">Customer tickets (TIC) will appear here when they are created</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card
                key={ticket.ticket_id}
                className="p-4 bg-card border-border hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/5"
                onClick={() => navigate(`/tickets/user/${ticket.ticket_id}`)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-card-foreground text-lg mb-1">{ticket.subject}</h3>
                    <p className="text-sm text-muted-foreground mb-2">#{ticket.ticket_code}</p>
                    {ticket.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {ticket.description.length > 100
                          ? ticket.description.substring(0, 100) + '...'
                          : ticket.description
                        }
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    Created: {new Date(ticket.created_at).toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {ticket.messages?.length || 0} message{ticket.messages?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketListPage;