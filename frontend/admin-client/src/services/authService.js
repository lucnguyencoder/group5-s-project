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
            !error.config?.url?.includes('/admin/auth/login') &&
            !error.config?.url?.includes('/admin/auth/register')) {

            Cookies.remove('token');
            Cookies.remove('user');

            window.location.href = '/admin/auth/login';
        }
        return Promise.reject(error);
    }
);



const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/admin/auth/login', credentials);

            if (response.data.success) {
                const { token, user } = response.data.data;
                Cookies.set('token', token, { expires: 1 });
                Cookies.set('user', JSON.stringify(user), { expires: 1 });
                return response.data;
            } else {
                console.error('Login failed:', response.data.message);
                return { success: false, message: response.data.message || 'Login failed' };
            }
        } catch (error) {
            return error.response?.data || { success: false, message: 'Network error' };
        }
    },
    register: async (userData) => {
        try {
            const response = await api.post('/admin/auth/register', userData);



            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
    logout: () => {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location.href = '/';
    },


    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/me');
            console.log("getCurentUser response:", response.data);
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch {

            return null;
        }
    },


    isAuthenticated: () => {
        return !!Cookies.get('token');
    },
    getToken: () => {
        return Cookies.get('token');
    },


    getUserFromCookies: () => {
        try {
            const userStr = Cookies.get('user');
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error('Error parsing user from cookies:', error);
            return null;
        }
    },
    changePassword: async (userId, currentPassword, newPassword) => {
        try {
            await api.put('/admin/profile/change-password', {
                userId: userId,
                currentPassword: currentPassword,
                newPassword: newPassword
            });
            return {
                success: true,
                message: "Password changed successfully"
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to change password'
            };
        }
    },

    updateProfile: async (userId, profileData) => {
        try {
            const response = await api.put('/admin/profile',
                {
                    userId: userId,
                    profileData: profileData
                })

            if (response.data.success) {
                const currentUser = authService.getUserFromCookies();
                const updatedUser = {
                    ...currentUser,
                    profile: {
                        ...response.data.data.customerProfile
                    }
                };
                Cookies.set('user', JSON.stringify(updatedUser), { expires: 1 });
                return response.data;
            }
            throw new Error(response.data.message || 'Failed to update profile');
        } catch (error) {
            console.error('Profile update error:', error);
            throw error.response?.data || { success: false, message: 'Network error' };
        }
    },
};

export default authService;