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
const avatarService = {

    uploadAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            };

            const response = await api.post(
                "/images/avatar/upload",
                formData,
                config
            );

            return response.data;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            throw error.response?.data || {
                success: false,
                message: "Failed to upload avatar"
            };
        }
    },

    /**
     * Get the current avatar URL
     * @returns {Promise<Object>} - Response with the avatar URL
     */
    getAvatar: async () => {
        try {
            const response = await api.get("/images/avatar");
            return response.data;
        } catch (error) {
            console.error("Error getting avatar:", error);
            throw error.response?.data || {
                success: false,
                message: "Failed to get avatar"
            };
        }
    },

    /**
     * Remove the current avatar
     * @returns {Promise<Object>} - Response with success message
     */
    removeAvatar: async () => {
        try {
            const response = await api.delete("/images/avatar");
            return response.data;
        } catch (error) {
            console.error("Error removing avatar:", error);
            throw error.response?.data || {
                success: false,
                message: "Failed to remove avatar"
            };
        }
    }
};

export default avatarService;
