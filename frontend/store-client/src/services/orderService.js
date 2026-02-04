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

        return Promise.reject(error);
    }
);

const orderService = {
    getOrdersList: async (filter) => {
        try {
            const response = await api.get(`/store/order`, { params: filter });
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            return {
                success: false,
                message: "Unexpected Error: " + error
            }
        }
    },

    updateOrder: async (orderId, type, data) => {
        try {
            const response = await api.put(`/store/order/${orderId}`, {
                update_type: type,
                update_value: data
            });
            console.log(response.data);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            return {
                success: false,
                message: "Unexpected Error: " + error
            }
        }
    },
    getCourierList: async () => {
        try {
            const response = await api.get(`/store/order/courier`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            return {
                success: false,
                message: "Unexpected Error: " + error
            }
        }
    },
}

export default orderService;