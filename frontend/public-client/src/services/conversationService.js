import axios from 'axios';
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api';
const CHAT_SOCKET_URL = 'http://localhost:3000/chat';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 &&
            !error.config?.url?.includes('/auth/login') &&
            !error.config?.url?.includes('/auth/register')) {
            Cookies.remove('token');
            Cookies.remove('user');
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

let socket = null;

export const connectToChat = (token) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(CHAT_SOCKET_URL, {
        auth: { token },
    });

    socket.on('connect', () => {
        console.log('Connected to chat server');
    });

    socket.on('error', (error) => {
        console.error('Chat socket error:', error);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
    });

    return socket;
};

export const disconnectFromChat = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const joinConversation = (conversationId) => {
    if (!socket) return;
    socket.emit('join-conversation', conversationId);
};

export const listenForMessages = (callback) => {
    if (!socket) return;
    socket.on('message', (message) => {
        callback(message);
    });
};

export const sendMessage = (conversationId, messageData) => {
    if (!socket) return;
    socket.emit('new-message', {
        conversationId,
        messageData,
    });
};

export const notifyReading = (conversationId) => {
    if (!socket) return;
    socket.emit('reading-messages', conversationId);
};

export const listenForReadingStatus = (callback) => {
    if (!socket) return;
    socket.on('reading', (readingData) => {
        callback(readingData);
    });
};
export const getConversations = async (page = 1, limit = 20) => {
    try {
        const response = await api.get('/customer/conversations', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};

export const startConversation = async (storeId) => {
    try {
        const response = await api.post(
            '/customer/conversations/start',
            { storeId }
        );
        return response.data;
    } catch (error) {
        console.error('Error starting conversation:', error);
        throw error;
    }
};

export const getConversationWithMessages = async (conversationId, page = 1, limit = 20) => {
    try {
        const response = await api.get(
            `/customer/conversations/${conversationId}`,
            { params: { page, limit } }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation with messages:', error);
        throw error;
    }
};

export const getMessages = async (conversationId, page = 1, limit = 20) => {
    try {
        const response = await api.get(
            `/customer/conversations/${conversationId}/messages`,
            { params: { page, limit } }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const sendMessageApi = async (conversationId, formData) => {
    try {
        const token = Cookies.get('token') || localStorage.getItem('token');
        const response = await axios.post(
            `${API_BASE_URL}/customer/conversations/${conversationId}/messages`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const addReaction = async (messageId, reaction) => {
    try {
        console.log('Adding reaction:', reaction);
        const response = await api.post(
            `/customer/conversations/messages/${messageId}/reactions`,
            { reaction }
        );
        console.log('Reaction added:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding reaction:', error);
        throw error;
    }
};

export const removeReaction = async (messageId) => {
    try {
        const response = await api.delete(
            `/customer/conversations/messages/${messageId}/reactions`
        );
        return response.data;
    } catch (error) {
        console.error('Error removing reaction:', error);
        throw error;
    }
};

export const markMessagesAsRead = async (conversationId) => {
    try {
        const response = await api.post(
            `/customer/conversations/${conversationId}/read`
        );
        return response.data;
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
};
