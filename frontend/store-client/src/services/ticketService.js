import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import Cookies from 'js-cookie';

// Hàm lấy token từ cookies hoặc localStorage
const getToken = () => {
  const cookieToken = Cookies.get('token');
  const localToken = localStorage.getItem('token');
  return cookieToken || localToken || null;
};

// Service cho tickets
const ticketService = {
  // Lấy danh sách tickets
  getTickets: async () => {
    try {
      console.log("TicketService: Making request to get tickets");
      
      const token = Cookies.get("token") || localStorage.getItem("token");
      console.log("Token found:", !!token);
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      };
      
      console.log("Request config:", config);
      
      const response = await axios.get("http://localhost:3000/api/store/tickets", config);
      
      console.log("TicketService response:", response);
      return response;
      
    } catch (error) {
      console.error("TicketService error:", error);
      console.error("Error response:", error.response);
      throw error;
    }
  },
  
  // Lấy chi tiết ticket theo ID
  getTicketById: async (ticketId) => {
    const token = getToken();
    return axios.get(`http://localhost:3000/api/store/tickets/${ticketId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      withCredentials: true
    });
  },
  
  // Tạo ticket mới
  createTicket: async (ticketData) => {
    const token = getToken();
    return axios.post('http://localhost:3000/api/store/tickets', ticketData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      withCredentials: true
    });
  },
  
  // Gửi reply cho ticket
  sendReply: async (ticketId, messageContent) => {
    const token = getToken();
    return axios.post(`http://localhost:3000/api/store/tickets/${ticketId}/reply`, 
      { message_content: messageContent },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        withCredentials: true
      }
    );
  },
    
  // Đóng ticket
  closeTicket: async (ticketId) => {
    const token = getToken();
    return axios.patch(`http://localhost:3000/api/store/tickets/${ticketId}/close`, 
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        withCredentials: true
      }
    );
  }
};

export default ticketService;