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

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response.data.success) {
                console.log("services" + response.data.is_enabled_2fa)
                if (response.data.is_enabled_2fa) {
                    return response.data;
                }
                else {
                    const { token, user } = response.data.data;
                    Cookies.set('token', token, { expires: 1 });
                    Cookies.set('user', JSON.stringify(user), { expires: 1 });
                    return response.data;
                }
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
            const response = await api.post('/auth/register', userData);
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

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/account-recovery/request', { email })
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    requestId: response.data.data.requestId
                }
            }
        }
        catch (error) {
            throw error.response?.data || {
                success: false,
                message: 'error'
            };
        }
    },

    verifyOTP: async (id, otp) => {
        try {
            const response = await api.post('/auth/account-recovery/verifyOTP', { id, otp })
            if (response.data.success) {
                return {
                    success: true,
                    resetToken: response.data.data.resetToken,
                    message: response.data.message
                };
            }
            return {
                success: false,
                message: response.data.message || 'OTP verification failed'
            };
        }
        catch (error) {
            throw error.response?.data || {
                success: false,
                message: error.message || 'Network error occurred'
            };
        }

    },

    changePassword: async (passwordData) => {
        try {
            const response = await api.put('/customer/profile/change-password', passwordData);
            if (response.data.success) {
                // Update token if provided in response
                if (response.data.data?.token) {
                    Cookies.set('token', response.data.data.token, { expires: 1 });
                }
            }
            return {
                success: response.data.success,
                message: response.data.message,
                data: response.data.data
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to change password'
            };
        }
    },

    resetPassword: async (resetToken, newPass) => {
        try {
            console.log(resetToken + newPass);
            const response = await api.post('/auth/account-recovery/reset-password', {
                resetToken,
                newPass
            });

            console.log(response.toString())
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Password changed successfully'
                };
            }

            return {
                success: false,
                message: response.data.message || 'Failed to change password'
            };
        }
        catch (error) {
            throw error.response?.data || {
                success: false,
                message: error.message || 'Network error occurred'
            };
        }
    },

    // changePassword: async (passwordData) => {
    //     try {
    //         const response = await api.put('/customer/profile/change-password', passwordData);
    //         if (response.data.success) {
    //             // Update token if provided in response
    //             if (response.data.data?.token) {
    //                 Cookies.set('token', response.data.data.token, { expires: 1 });
    //             }
    //         }
    //         return {
    //             success: response.data.success,
    //             message: response.data.message,
    //             data: response.data.data
    //         };
    //     } catch (error) {
    //         return {
    //             success: false,
    //             message: error.response?.data?.message || 'Failed to change password'
    //         };
    //     }
    // },


    updateProfile: async (profileData) => {
        try {
            const response = await api.put('/customer/profile', profileData);

            if (response.data.success) {
                const currentUser = authService.getUserFromCookies();
                const updatedUser = {
                    ...currentUser,
                    profile: {
                        ...currentUser.profile,
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
    verify2FA: async (tempToken, id, otp) => {
        try {
            const response = await api.post('/auth/authenticate/verify', {
                id: id,
                otp: otp,
                data: {
                    tempToken: tempToken
                }
            });
            if (response.data.success) {
                const { token, user } = response.data.data;
                Cookies.set('token', token, { expires: 1 });
                Cookies.set('user', JSON.stringify(user), { expires: 1 });
                return {
                    success: true,
                    message: response.data.message
                };
            }
            else return {
                success: false,
                message: response.data.message
            };
        }
        catch (error) {
            throw error.response?.data || {
                success: false,
                message: error.message || 'Network error occurred'
            }
        }
    },
    toggle2Fa: async (userId) => {
        console.log('service');
        try {
            console.log('service');
            const response = await api.post('/customer/profile/toggle2fa', { userId });
            console.log(response.data.data)
            if (response.data.success) {
                return response.data;
            }
            else {
                return response.data
            }
        } catch (error) {
            throw error.response?.data || {
                success: false,
                message: error.message || 'Network error occurred'
            };
        }
    }
};

export default authService;