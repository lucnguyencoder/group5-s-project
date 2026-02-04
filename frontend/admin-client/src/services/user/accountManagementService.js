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

const accountManagementService = {
    getAllAccounts: async (filters = {}, pagination = { page: 1, itemPerPage: 10 }) => {
        try {
            const queryParams = new URLSearchParams();

            if (filters.email) {
                queryParams.append('email', filters.email);
            }

            if (filters.userType) {
                queryParams.append('user_type', filters.userType);
            }

            if (filters.isActive !== undefined) {
                queryParams.append('is_active', filters.isActive);
            }

            queryParams.append('page', pagination.page);
            queryParams.append('itemPerPage', pagination.itemPerPage);

            const queryString = queryParams.toString();
            const url = `/admin/users?${queryString}`;
            const response = await api.get(url);
            console.log("getAllAccounts response:", response.data);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    pagination: response.data.pagination,
                    count: response.data.count
                };
            } else {
                console.error('Failed to get accounts:', response.data.message);
                return {
                    success: false,
                    message: response.data.message || 'Failed to get accounts',
                    data: [],
                    pagination: { currentPage: 1, totalPages: 1, itemPerPage: 10, totalCount: 0 }
                };
            }
        } catch (error) {
            return error.response?.data || {
                success: false,
                message: 'Network error',
                data: [],
                pagination: { currentPage: 1, totalPages: 1, itemPerPage: 10, totalCount: 0 }
            };
        }
    },


    getAccountById: async (id) => {
        try {
            const response = await api.get(`/admin/users/${id}`);
            console.log("getAccountById response:", response.data);

            if (response.data.success) {
                return response.data.data;
            } else {
                console.error('Failed to get account details:', response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching account details:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch account details');
        }
    },


    createUser: async (userData) => {
        try {
            console.log('UserData: ', userData)
            const response = await api.post('/admin/users', userData);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to create user');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error(error.response?.data?.message || 'Failed to create user');
        }
    },

    updateUser: async (id, updateData) => {
        try {
            const response = await api.put(`/admin/users/${id}`, updateData);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to update user');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            throw new Error(error.response?.data?.message || 'Failed to update user');
        }
    },


    toggleUserStatus: async (id) => {
        try {

            const response = await api.delete(`/admin/users/${id}`);

            if (response.data.success) {
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to toggle user status');
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
            throw new Error(error.response?.data?.message || 'Failed to toggle user status');
        }
    },

    getGroups: async (type = '') => {
        try {

            const response = await api.get('/admin/groups');

            if (response.data.success) {
                let groups = response.data.data;


                if (type) {
                    groups = groups.filter(group => group.type === type);
                }

                return groups;
            } else {
                console.error('Failed to get groups:', response.data.message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
            return [];
        }
    }
};

export default accountManagementService;