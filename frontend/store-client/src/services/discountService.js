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
            !error.config?.url?.includes('/store/auth/login') &&
            !error.config?.url?.includes('/store/auth/register')) {

            Cookies.remove('token');
            Cookies.remove('user');

            window.location.href = '/store/auth/login';
        }
        return Promise.reject(error);
    }
);

export const discountService = {
    getAllDiscounts: async () => {
        try {
            const response = await api.get('/store/discount');
            console.log("Fetched discounts:", response.data);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch discounts:", error);
            throw error;
        }
    },

    getDiscountById: async (id) => {
        try {
            const response = await api.get(`/store/discount/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch discount with ID ${id}:`, error);
            throw error;
        }
    }
    ,
    createDiscount: async (discountData) => {
        try {
            const response = await api.post('/store/discount', discountData);
            return response.data;
        } catch (error) {
            console.error("Failed to create discount:", error);
            throw error;
        }
    }
    ,
    updateDiscount: async (id, discountData) => {
        try {
            const response = await api.put(`/store/discount/${id}`, discountData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update discount with ID ${id}:`, error);
            throw error;
        }
    }
    ,
    toggleDiscount: async (id) => {
        try {
            const response = await api.delete(`/store/discount/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to toggle discount with ID ${id}:`, error);
            throw error;
        }
    }
}
