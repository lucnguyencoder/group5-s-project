import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertCircle, Send, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import ticketService from "@/services/ticketService"; 
import SetTitle from "@/components/common/SetTitle";

function TicketForm({ open, onClose, onSuccess }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdTicket, setCreatedTicket] = useState(null);
  const [formStep, setFormStep] = useState(0); 

  const navigate = useNavigate();
  
  const validateForm = () => {
    if (!subject.trim()) {
      setError("Please enter a subject");
      return false;
    }
    if (!description.trim()) {
      setError("Please provide a description");
      return false;
    }
    if (!message.trim()) {
      setError("Please include a message");
      return false;
    }
    return true;
  };
  
  const handlePreview = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setError("");
      setFormStep(1);
    }
  };
  
  const handleBack = () => {
    setFormStep(0);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ticketService.createTicket({
        subject: subject.trim(),
        description: description.trim(),
        message: message.trim()
      });

      const data = res.data;
      console.log("Ticket creation response:", data);

      if (data.success && data.data) {
        console.log("Ticket data being passed to onSuccess:", data.data);
        toast.success("Ticket created successfully!");
        setCreatedTicket(data.data);
        setFormStep(2);
        if (onSuccess) onSuccess(data.data);
      } else {
        toast.error(data.message || "Failed to create ticket");
        setError(data.message || "Failed to create ticket. Please try again later.");
        setFormStep(0);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create ticket. Please try again later.";
      toast.error(msg);
      setError(msg);
      setFormStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTickets = () => {
    onClose();
    navigate("/tickets");
  };

  const renderForm = () => (
    <form onSubmit={handlePreview} className="space-y-4">
      <SetTitle title="Create Support Ticket" />
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          placeholder="Brief summary of your issue"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          maxLength={100}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground text-right">{subject.length}/100</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Please describe your issue in detail"
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={1000}
          rows={3}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground text-right">{description.length}/1000</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message">Initial Message</Label>
        <Textarea
          id="message"
          placeholder="Additional details or questions"
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
          rows={2}
          required
          disabled={loading}
        />
        <p className="text-xs text-muted-foreground text-right">{message.length}/500</p>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Processing..." : "Continue"}
        </Button>
      </div>
    </form>
  );

  const renderPreview = () => (
    <div className="space-y-4">
      <div className="border rounded-md p-4 space-y-3">
        <div>
          <h4 className="font-medium text-sm">Subject</h4>
          <p>{subject}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">Description</h4>
          <p className="text-sm whitespace-pre-wrap">{description}</p>
        </div>
        <div>
          <h4 className="font-medium text-sm">Initial Message</h4>
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Ticket"}
        </Button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
        <p className="text-green-800 font-medium mb-2">Ticket Created Successfully!</p>
        <p className="text-sm">Your ticket has been sent to our support team.</p>
        {createdTicket?.ticket_code && (
          <p className="text-sm">Ticket ID: <span className="font-mono">{createdTicket.ticket_code}</span></p>
        )}
      </div>
      
      <div className="flex gap-2 justify-center">
        <Button onClick={handleViewTickets}>
          View All Tickets
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {formStep === 0 && "Create Support Ticket"}
            {formStep === 1 && "Review Your Ticket"}
            {formStep === 2 && "Ticket Created"}
          </DialogTitle>
          {formStep === 0 && (
            <DialogDescription>
              Fill out the form below to create a new support ticket
            </DialogDescription>
          )}
        </DialogHeader>
        
        {formStep === 0 && renderForm()}
        {formStep === 1 && renderPreview()}
        {formStep === 2 && renderSuccess()}
      </DialogContent>
    </Dialog>
  );
}

export default TicketForm;