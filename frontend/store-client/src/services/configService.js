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

const configService = {
    getConfig: async () => {
        try {
            const response = await api.get('/store/profile/config');
            console.log('Configuration fetched:', response);
            return response.data.data.storeSettings;
        } catch (error) {
            console.error('Error fetching configuration:', error);
            throw error;
        }
    },

    updateConfig: async (configData) => {
        try {
            const response = await api.post('/store/profile/config', configData);
            return response.data;
        } catch (error) {
            console.error('Error updating configuration:', error);
            throw error;
        }
    },

};

export { api, configService };
