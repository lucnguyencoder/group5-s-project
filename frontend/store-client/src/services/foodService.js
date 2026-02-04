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
            !error.config?.url?.includes('/store/auth/login') &&
            !error.config?.url?.includes('/store/auth/register')) {

            Cookies.remove('token');
            Cookies.remove('user');

            window.location.href = '/store/auth/login';
        }
        return Promise.reject(error);
    }
);

export const foodService = {

    createFood: async (foodData) => {
        try {
            const formData = new FormData();
            if (foodData.food_image) {
                formData.append('food_image', foodData.food_image);
            }

            Object.keys(foodData).forEach(key => {
                if (key !== 'food_image' && key !== 'customization_groups') {
                    formData.append(key, foodData[key]);
                }
            });


            if (foodData.customization_groups) {
                formData.append('customization_groups', JSON.stringify(foodData.customization_groups));
            }

            const response = await api.post(`/store/foods`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                return response.data;
            }

            return {
                success: false,
                message: response.data.message || 'Failed to create food',
            };
        } catch (error) {
            console.error('Error creating food:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create food',
            };
        }
    },


    getFoodById: async (foodId) => {
        try {
            const response = await api.get(`/store/foods/${foodId}`);

            if (response.data.success) {
                return response.data;
            }

            return {
                success: false,
                message: response.data.message || 'Failed to fetch food details',
            };
        } catch (error) {
            console.error('Error fetching food details:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch food details',
            };
        }
    },


    getAllFoods: async (filters = {}, pagination = { page: 1, itemPerPage: 10 }) => {
        try {
            const params = { ...pagination, ...filters };
            const response = await api.get(`/store/foods`, { params });
            if (response.data.success) {
                return response.data;
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch foods',
                foods: [],
            };
        } catch (error) {
            console.error('Error fetching foods:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch foods',
                foods: [],
            };
        }
    },


    updateFood: async (foodId, foodData) => {
        try {
            const formData = new FormData();


            if (foodData.food_image && foodData.food_image instanceof File) {
                formData.append('food_image', foodData.food_image);
            }


            Object.keys(foodData).forEach(key => {
                if (key !== 'food_image' && key !== 'customization_groups') {
                    formData.append(key, foodData[key]);
                }
            });


            if (foodData.customization_groups) {
                formData.append('customization_groups', JSON.stringify(foodData.customization_groups));
            }

            const response = await api.put(`/store/foods/${foodId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                return response.data;
            }

            return {
                success: false,
                message: response.data.message || 'Failed to update food',
            };
        } catch (error) {
            console.error('Error updating food:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update food',
            };
        }
    },

    deleteFood: async (foodId) => {
        try {
            const response = await api.delete(`/store/foods/${foodId}`);

            console.log('Delete food response:', response.data);

            if (response.data.success) {
                return response.data;
            }

            return {
                success: false,
                message: response.data.message || 'Failed to delete food',
            };
        } catch (error) {
            console.error('Error deleting food:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete food',
            };
        }
    },


    updateFoodAvailability: async (foodId, isAvailable) => {
        try {
            const response = await api.patch(`/store/foods/${foodId}/availability`, {
                is_available: isAvailable
            });

            if (response.data.success) {
                return response.data;
            }

            return {
                success: false,
                message: response.data.message || 'Failed to update food availability',
            };
        } catch (error) {
            console.error('Error updating food availability:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update food availability',
            };
        }
    },


    updateFoodSaleStatus: async (foodId, isOnSale, salePrice) => {
        try {
            const response = await api.patch(`/store/foods/${foodId}/sale`, {
                is_on_sale: isOnSale,
                sale_price: salePrice
            });

            if (response.data.success) {
                return response.data;
            }

            return {
                success: false,
                message: response.data.message || 'Failed to update sale status',
            };
        } catch (error) {
            console.error('Error updating food sale status:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update sale status',
            };
        }

    },
    getFoodByStore: async (userId) => {
        try {
            const response = await api.get(`/store/foods/forCategory/${userId}`);
            if (response.data.success) {
                return {
                    success: true,
                    foods: response.data.foods || [],
                    message: response.data.message || 'Foods fetched successfully'
                };
            }

            return {
                success: false,
                message: response.data.message || 'Failed to fetch foods for store',
                foods: []
            };
        } catch (error) {
            console.error('Error fetching foods by store:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch foods for store',
                foods: []
            };
        }
    }
};
