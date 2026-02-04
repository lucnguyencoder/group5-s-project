import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import TicketForm from "./TicketForm"; 
import { toast } from "sonner";
import ticketService from "@/services/ticketService";
import SetTitle from "@/components/common/SetTitle";

const TicketListPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Fetching tickets...");
      
      const res = await ticketService.getTickets();
      

      if (!res.data) {
        throw new Error("No data in response");
      }
      
      if (!res.data.data) {
        console.warn("No data.data in response, setting empty array");
        setTickets([]);
        return;
      }
      
      const ticketsData = Array.isArray(res.data.data) 
        ? res.data.data.map(ticket => {
            console.log("Processing ticket:", ticket);
            
            const ticketData = ticket.data || ticket;
            
            const normalized = {
              ...ticket,
              ...ticketData,
              ticketId: ticketData.ticket_id || ticketData.id || ticket.ticket_id || ticket.id || 'unknown'
            };
            
            console.log("Normalized ticket:", normalized);
            return normalized;
          })
        : [];
      
      console.log("Final tickets data:", ticketsData);
      setTickets(ticketsData);
      
    } catch (err) {
      console.error("Error fetching tickets:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load tickets."
      );
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = () => {
    setIsFormOpen(true);
  };

  const handleTicketCreated = (newTicket) => {
    if (!newTicket) {
      toast.error("Failed to process the new ticket");
      return;
    }

    // Kiểm tra cấu trúc lồng nhau và chuẩn hóa
    const ticketData = newTicket.data || newTicket;
    const normalizedTicket = {
      ...newTicket,
      ...ticketData,
      ticketId: ticketData.ticket_id || 
               ticketData.id || 
               newTicket.ticket_id || 
               newTicket.id
    };
    
    try {
      setTickets(prev => [...(Array.isArray(prev) ? prev : []), normalizedTicket]);
      toast.success("Ticket created successfully");
    } catch (error) {
      console.error("Error updating tickets state:", error);
      fetchTickets();
    }
    
    setIsFormOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return 'Invalid date' + e.message;
    }
  };

  const renderTicketList = () => {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No Tickets Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You don't have any support tickets yet. Create a new ticket to get help with any issues or questions.
          </p>
          <Button 
            onClick={handleCreateTicket} 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Your First Ticket
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <SetTitle title="Support Tickets" />
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </p>
         
        </div>
        
        <div className="space-y-3">
          {tickets.map((ticket, index) => (
            <Card 
              key={ticket.ticketId || `ticket-${index}`} 
              className="bg-card border-border hover:bg-accent/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => {
                const id = ticket.ticketId || ticket.ticket_id || ticket.id;
                if (!id) {
                  toast.error("Cannot view this ticket - missing ID");
                  return;
                }
                navigate(`/tickets/${id}`);
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground mb-1">{ticket.subject}</h4>
                    {ticket.ticket_code && (
                      <p className="text-xs text-muted-foreground mb-2">#{ticket.ticket_code}</p>
                    )}
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Created: {formatDate(ticket.created_at)}</span>
                  <span className="text-muted-foreground">
                    {ticket.messages?.length || 0} message{ticket.messages?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Card className="shadow-2xl bg-card border-border">
            <CardHeader className="border-b border-border bg-card">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-card-foreground">Support Tickets</CardTitle>
                  <p className="text-muted-foreground mt-1">Manage your support requests</p>
                </div>
                <Button 
                  onClick={handleCreateTicket}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  New Ticket
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 bg-card">
              {loading && (
                <div className="text-center py-16">
                  <div className="animate-spin h-8 w-8 border-4 border-border border-t-primary rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your tickets...</p>
                </div>
              )}
              
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <svg className="w-5 h-5 text-destructive mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-destructive">Error loading tickets</h3>
                      <p className="text-sm text-destructive/80 mt-1">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" 
                        onClick={fetchTickets}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {!loading && !error && renderTicketList()}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <TicketForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleTicketCreated}
      />
    </>
  );
};

export default TicketListPage;