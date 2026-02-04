import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import TicketMessageBox from "./TicketMessageBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import SetTitle from "@/components/common/SetTitle";

function TicketForm({ open, onClose, onSuccess }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message_content, setMessageContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdTicket, setCreatedTicket] = useState(null);

  const navigate = useNavigate();
  const getToken = () => {
    // Thử lấy từ cookies trước (ưu tiên cookies)
    const cookieToken = Cookies.get('token'); // Thay 'token' bằng JWT_COOKIE_NAME nếu khác

    // Nếu không có trong cookies, thử lấy từ localStorage
    const localToken = localStorage.getItem('token');

    // Trả về token từ nguồn nào đó hoặc null nếu không tìm thấy
    return cookieToken || localToken || null;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = getToken();

      const res = await axios.post(
        "http://localhost:3000/api/customer/tickets",
        {
          subject: subject.trim(),
          description: description.trim(),
          message_content: message_content.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          withCredentials: true,
        }
      );

      const data = res.data;

      if (data.success && data.data) {
        toast.success("Ticket sent to admin successfully!");
        setSubject("");
        setDescription("");
        setMessageContent("");
        setCreatedTicket(data.data);
        if (onSuccess) onSuccess();
        navigate("/tickets");
      } else {
        toast.error(data.message || "Failed to create ticket.");
        setError(data.message || "Failed to create ticket. Please try again later.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to create ticket. Please try again later.";
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };


  if (createdTicket) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ticket: {createdTicket.ticket_code}</DialogTitle>
          </DialogHeader>
          <TicketMessageBox ticket={createdTicket} onClose={onClose} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <SetTitle title="Create New Ticket" />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send a New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Subject</label>
            <Input
              className="w-full border rounded px-2 py-1"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              maxLength={100}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              className="w-full border rounded px-2 py-1"
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={1000}
              rows={3}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <Textarea
              className="w-full border rounded px-2 py-1"
              value={message_content}
              onChange={e => setMessageContent(e.target.value)}
              maxLength={500}
              rows={2}
              required
              disabled={loading}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TicketForm;