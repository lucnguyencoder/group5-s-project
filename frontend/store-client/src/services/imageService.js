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

const imageService = {

    uploadStoreAvatar: async (file) => {
        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            };

            const response = await api.post("images/store/avatar/upload", file, config);
            return response.data;
        } catch (error) {
            console.error("Error uploading store avatar:", error);
            throw error.response?.data || {
                success: false,
                message: "Failed to upload store avatar"
            };
        }
    },
    uploadStoreCover: async (file) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            };
            const response = await api.post("/images/store/cover/upload", file, config);
            return response.data;
        } catch (error) {
            console.error("Error uploading store cover:", error);
            throw error.response?.data || {
                success: false,
                message: "Failed to upload store cover"
            };
        }
    }
};

export { imageService };