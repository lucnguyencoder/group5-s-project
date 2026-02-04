import axios from "axios";
import { toast } from "sonner";
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api/customer';

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

            toast.error("Your session has expired. Please log in again.");
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);

export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/order', orderData);
        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to create order'
        };
    } catch (error) {
        console.error('Order creation error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Network error'
        };
    }
}

export const getOrdersList = async (filter) => {
    try {
        const response = await api.get('/order', { params: filter });
        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to fetch orders'
        };
    } catch (error) {
        console.error('Orders fetch error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Network error'
        };
    }
}

export const getOrderDetailById = async (orderId) => {
    try {
        const response = await api.get(`/order/${orderId}`);
        if (response.data.success) {
            return {
                success: true,
                data: response.data.data
            };
        }
        return {
            success: false,
            message: response.data.message || 'Failed to fetch order details'
        };
    } catch (error) {
        console.error('Order detail fetch error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Network error'
        };
    }
}