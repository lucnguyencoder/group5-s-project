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
    const token = getToken();
    return axios.get('http://localhost:3000/api/customer/tickets', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      withCredentials: true
    });
  },
  
  // Lấy chi tiết ticket theo ID
  getTicketById: async (ticketId) => {
    const token = getToken();
    return axios.get(`http://localhost:3000/api/customer/tickets/${ticketId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      withCredentials: true
    });
  },
  
  // Tạo ticket mới
  createTicket: async (ticketData) => {
    const token = getToken();
    return axios.post('http://localhost:3000/api/customer/tickets', ticketData, {
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
    return axios.post(`http://localhost:3000/api/customer/tickets/${ticketId}/replies`, 
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
  
  // Cập nhật trạng thái ticket
  updateTicketStatus: async (ticketId, status) => {
    const token = getToken();
    return axios.patch(`http://localhost:3000/api/customer/tickets/${ticketId}/status`, 
      { status },
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
    return axios.patch(`http://localhost:3000/api/customer/tickets/${ticketId}/close`, 
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