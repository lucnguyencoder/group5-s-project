import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token');
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
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export const aiAgentService = {
    sendMessage: async (message, chatHistory = []) => {
        try {
            const response = await api.post('/customer/ai-agent/chat', {
                message,
                chatHistory
            });
            return response.data;
        } catch (error) {
            console.error('Error sending message to AI:', error);
            throw error;
        }
    },

    streamChat: async (message, chatHistory = [], callbacks = {}) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }
            const source = new EventSource(`${API_BASE_URL}/customer/ai-agent/stream-chat?token=${token}`, {
                withCredentials: true
            });
            source.addEventListener('connected', () => {
                if (callbacks.onOpen) callbacks.onOpen();
                fetch(`${API_BASE_URL}/customer/ai-agent/stream-chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ message, chatHistory })
                });
            });
            source.addEventListener('chunk', (event) => {
                const data = JSON.parse(event.data);
                if (callbacks.onChunk) callbacks.onChunk(data.text);
            });
            source.addEventListener('done', (event) => {
                const data = JSON.parse(event.data);
                if (callbacks.onComplete) callbacks.onComplete(data);
                source.close();
            });
            source.addEventListener('error', (event) => {
                let errorMessage = 'An error occurred with the streaming connection';
                try {
                    if (event.data) {
                        const data = JSON.parse(event.data);
                        errorMessage = data.message || errorMessage;
                    }
                } catch (e) {
                    console.error('Error parsing error event data', e);
                }
                if (callbacks.onError) callbacks.onError(errorMessage);
                source.close();
            });
            return () => {
                source.close();
            };
        } catch (error) {
            if (callbacks.onError) callbacks.onError(error.message);
            return null;
        }
    },

    getRecommendations: async (preferences) => {
        try {
            const response = await api.post('/customer/ai-agent/recommendations', {
                preferences
            });
            return response.data;
        } catch (error) {
            console.error('Error getting recommendations:', error);
            throw error;
        }
    }
};
