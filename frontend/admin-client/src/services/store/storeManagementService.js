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

const storeManagementService = {
    getAllStores: async (filters = {}, pagination = { page: 1, itemPerPage: 10 }) => {
        try {

            const queryParams = new URLSearchParams();

            if (filters.name) {
                queryParams.append('name', filters.name);
            }
            if (filters.address) {
                queryParams.append('address', filters.address);
            }
            if (filters.status) {
                queryParams.append('status', filters.status);
            }
            if (filters.isActive !== undefined) {
                queryParams.append('isActive', filters.isActive);
            }
            if (filters.isTempClosed !== undefined) {
                queryParams.append('isTempClosed', filters.isTempClosed);
            }

            queryParams.append('page', pagination.page);
            queryParams.append('itemPerPage', pagination.itemPerPage);

            const queryString = queryParams.toString();
            const url = `/admin/stores?${queryString}`;

            const response = await api.get(url);

            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    pagination: response.data.pagination,
                    count: response.data.count
                };
            } else {
                console.error('Failed to get stores:', response.data.message);
                return {
                    success: false,
                    message: response.data.message || 'Failed to get stores',
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

    getStoreById: async (id) => {
        try {
            const response = await api.get(`/admin/stores/${id}`);

            if (response.data.success) {
                return response.data.data;
            } else {
                console.error('Failed to get store details:', response.data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching store details:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch store details');
        }
    },

    createStore: async (storeData) => {
        try {
            const response = await api.post('/admin/stores', storeData);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to create store');
            }
        } catch (error) {
            console.error('Error creating store:', error);
            throw new Error(error.response?.data?.message || 'Failed to create store');
        }
    },

    updateStore: async (id, updateData) => {
        try {
            const response = await api.put(`/admin/stores/${id}`, updateData);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to update store');
            }
        } catch (error) {
            console.error('Error updating store:', error);
            throw new Error(error.response?.data?.message || 'Failed to update store');
        }
    },

    toggleStoreStatus: async (id) => {
        try {
            const response = await api.patch(`/admin/stores/${id}/toggle-status`);

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    isActive: response.data.isActive
                };
            } else {
                throw new Error(response.data.message || 'Failed to toggle store status');
            }
        } catch (error) {
            console.error('Error toggling store status:', error);
            throw new Error(error.response?.data?.message || 'Failed to toggle store status');
        }
    },

    toggleStoreTempClosed: async (id) => {
        try {
            const response = await api.patch(`/admin/stores/${id}/toggle-temp-closed`);

            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    isTempClosed: response.data.isTempClosed
                };
            } else {
                throw new Error(response.data.message || 'Failed to toggle store temporary closure');
            }
        } catch (error) {
            console.error('Error toggling store temporary closure:', error);
            throw new Error(error.response?.data?.message || 'Failed to toggle store temporary closure');
        }
    },

    addStoreMember: async (storeId, memberData) => {
        try {
            const response = await api.post(`/admin/stores/${storeId}/members`, memberData);

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to add store member');
            }
        } catch (error) {
            console.error('Error adding store member:', error);
            throw new Error(error.response?.data?.message || 'Failed to create store member');
        }
    }
};

export default storeManagementService;
