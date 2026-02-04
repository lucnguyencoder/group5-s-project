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

const groupService = {
    getAllGroups: async (filters = {}) => {
        try {
            const queryParam = new URLSearchParams();
            if (filters.name) {
                queryParam.append('name', filters.name);
            }
            if (filters.type) {
                queryParam.append('type', filters.type);
            }
            // Remove pagination parameters
            const query = queryParam.toString();
            const response = await api.get(`/admin/groups?${query}`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    count: response.data.count
                }
            }
            else {
                return {
                    success: false,
                    data: [],
                    message: response.data.message || 'Failed to get user groups'
                }
            }
        }
        catch (error) {
            return error.response?.data || {
                success: false,
                message: 'Network error',
                data: []
            };
        }
    },

    getGroupById: async (id) => {
        try {
            const response = await api.get(`/admin/groups/${id}`);
            if (response.data.success) {
                return response.data;
            }
            return {
                success: false,
                message: response.data.message || 'Failed to get Group'
            }
        }
        catch (error) {
            return {
                success: false,
                message: response.data.message || 'Sever Error'
            }
        }
    },

    getAllPermissions: async () => {
        try {
            const response = await api.get('/admin/groups/permission');
            return {
                success: response.data.success,
                data: response.data.data,
                message: response.data?.message
            };
        } catch (error) {
            console.error('Error fetching permissions:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch permissions'
            };
        }
    },

    getPermissionByGroupId: async (id) => {
        try {
            const response = await api.get(`/admin/groups/permission/${id}`);
            console.log(response);
            if (response.data.success) {
                return {
                    success: response.data.success,
                    data: response.data.data,
                    message: response.data.message
                }
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch permissions'
            };
        }
        catch (error) {
            console.error('Error fetching permissions:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch permissions'
            };
        }
    },

    addPermission: async (permission_id, group_id) => {
        try {
            const response = await api.put('/admin/groups/permission/add', { permission_id, group_id });
            if (response.data.success) {
                return {
                    success: response.data.success,
                    message: response.data.message
                }
            }
            return {
                success: response.data.success,
                message: response.data.message
            }
        }
        catch (error) {
            console.error('Error to add:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add'
            };
        }
    },

    removePermission: async (permission_id, group_id) => {
        try {
            const response = await api.delete('/admin/groups/permission/delete', { data: { permission_id, group_id } });
            console.log(response);
            if (response.data.success) {
                return {
                    success: response.data.success,
                    message: response.data.message
                }
            }
            return {
                success: response.data.success,
                message: response.data.message
            }
        }
        catch (error) {
            console.error('Error to remove:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove'
            };
        }
    },

    createGroup: async (groupData) => {
        const response = await api.post('/admin/groups', groupData);
        return response.data;
    },

    updateGroup: async (id, groupData) => {
        try {
            const response = await api.put(`/admin/groups/${id}`, groupData);
            return {
                success: response.data.success,
                data: response.data.data,
                message: response.data.message
            };
        } catch (error) {
            console.error('Error updating group:', error);
            throw new Error(error.response?.data?.message || 'Failed to update group');
        }
    },

    addGroup: async (groupData) => {
        try {
            const response = await api.post('/admin/groups/add', groupData);
            if (response.data.success) {
                return {
                    success: response.data.success,
                    message: response.data.message,
                    groupId: response.data.groupId
                }
            }
            return {
                success: response.data.success,
                message: response.data.message
            }
        }
        catch (error) {
            console.error('Error adding group:', error);
            throw new Error(error.response?.data?.message || 'Failed to add group');
        }
    }
}

export default groupService;