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

const storeService = {
    getCurrentStore: async () => {
        try {
            const response = await api.get('/store/me');
            if (response.data.success) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching store data:', error);
            return null;
        }
    },

    updateStore: async (storeId, storeData) => {
        try {

            const response = await api.put('/store/profile/update', { storeId, storeData });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message
            }
        }
    },

    getAllStaff: async (storeId, filters = {}, pagination = { page: 1, itemPerPage: 10 }) => {
        try {
            const queryParam = new URLSearchParams();
            if (filters.type) {
                queryParam.append('type', filters.type);
            }
            if (filters.email) {
                queryParam.append('email', filters.email);
            }
            if (filters.active !== undefined) {
                queryParam.append('is_courier_active', filters.active);
            }
            queryParam.append('page', pagination.page);
            queryParam.append('itemPerPage', pagination.itemPerPage);
            queryParam.append('storeId', storeId);

            const queryString = queryParam.toString();

            const response = await api.get(`/store/staff?${queryString}`);
            console.log(response.data);
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    currentPage: response.data.currentPage,
                    totalPage: response.data.totalPage,
                    staff: response.data.staff
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message
            }
        }
    },

    getStaffById: async (staffId) => {
        try {
            const response = await api.get(`/store/staff/${staffId}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    staff: response.data.staff
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message
            }
        }
    },

    updateStaff: async (staffId, staffData) => {
        try {
            const { id } = JSON.parse(Cookies.get('user'));
            const response = await api.put(`/store/staff`, { updateData: staffData, staffId, userId: id });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update staff'
            }
        }
    },

    createStaff: async (staffData) => {
        try {
            const response = await api.post('/store/staff', { staffData });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create staff'
            }
        }
    },

    disableStaff: async (staffId) => {
        try {
            const response = await api.put(`/store/staff/${staffId}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: `Staff with ID: ${staffId} is updated`,
                    isActive: response.data.isActive
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete staff'
            }
        }
    },

    changeRole: async (staffId, role) => {
        try {
            console.log(role)
            const response = await api.put(`/store/staff/change-role/${staffId}`, { role });
            if (response.data.success) {
                return {
                    success: true,
                    role: response.data.role
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete staff'
            }
        }
    },

    createCategory: async (data) => {
        try {
            const response = await api.post('/store/categories', { data });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    categoryId: response.data.categoryId
                }
            }
            else {
                return {
                    success: false,
                    message: response.data.message
                }
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create category'
            }
        }
    },

    getAllCategory: async (storeId, filters = {}, pagination = { page: 1, itemPerPage: 10 }) => {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('storeId', storeId);
            if (filters.category_name) {
                queryParams.append('category_name', filters.category_name);
            }
            queryParams.append('page', pagination.page);
            queryParams.append('itemPerPage', pagination.itemPerPage);

            const response = await api.get(`/store/categories?${queryParams.toString()}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    categories: response.data.categories,
                    currentPage: response.data.currentPage,
                    totalPage: response.data.totalPage,
                    totalCount: response.data.totalCount,
                    itemPerPage: response.data.itemPerPage
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch categories'
            }
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const response = await api.get(`/store/categories/${categoryId}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    category: response.data.category
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch category'
            }
        }
    },

    updateCategory: async (categoryId, updateData) => {
        try {
            const response = await api.put(`/store/categories/${categoryId}`, { updateData });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update category'
            }
        }
    },

    removeFoodCategory: async (categoryId, food_id) => {
        try {
            const response = await api.delete(`/store/categories/categoryFood/${categoryId}`, { data: { food_id: food_id } });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete category'
            }
        }
    },

    addFoodCategory: async (categoryId, food_id) => {
        try {
            const response = await api.post(`/store/categories/${categoryId}/add-food`, { food_id });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add food to category'
            }
        }
    },
    deleteCategory: async (categoryId) => {
        try {
            const response = await api.delete(`/store/categories/${categoryId}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete category'
            }
        }
    },

    createCustomization: async (customizationData) => {
        try {
            const response = await api.post('/store/custom', { customizationData });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    customizationId: response.data.customizationId
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create customization'
            }
        }
    },

    getCustomizations: async (storeId) => {
        try {
            const response = await api.get(`/store/custom/${storeId}`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to get customizations'
            }
        }
    },

    updateCustomization: async (updateData) => {
        try {
            const response = await api.put(`/store/custom/`, { updateData });
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update customization'
            }
        }
    },

    deleteCustomizationById: async (customizationData) => {
        try {
            const response = await api.delete(`/store/custom/`, { data: customizationData });
            if (response.data.success) {
                return {
                    success: true,
                    message: 'Customization deleted successfully',
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete customization'
            }
        }
    },

    deleteAllCustomizations: async (storeId) => {
        try {
            const response = await api.delete(`/store/custom/${storeId}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: 'All customizations deleted successfully',
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete all customizations'
            }
        }
    },

    setCheckInOut: async (staffId) => {
        try {
            const response = await api.put(`/store/staff/checkIn/${staffId}`);
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message,
                    isActive: response.data.isActive
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to set check in/out'
            }
        }
    }
};

export { api, storeService };
