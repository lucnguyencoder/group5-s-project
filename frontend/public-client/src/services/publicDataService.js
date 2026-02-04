import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:3000/api';

const publicApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

publicApi.interceptors.request.use(
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
const publicDataService = {
    getFoodDetails: async (foodId) => {
        try {
            const response = await publicApi.get(`/data/foods/${foodId}`);
            console.log(response)
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch food details'
            };
        } catch (error) {
            console.error('Food details fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    getFoods: async (queryParams = {}) => {
        try {
            const response = await publicApi.get('/data/foods', { params: queryParams });
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch foods'
            };
        } catch (error) {
            console.error('Foods fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    getStoreDetails: async (storeId) => {
        try {
            const response = await publicApi.get(`/data/stores/${storeId}`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch store details'
            };
        } catch (error) {
            console.error('Store details fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    addFavoriteFood: async (foodId) => {
        try {
            const user = JSON.parse(Cookies.get('user'));
            const response = await publicApi.post(`/customer/products/${foodId}/save`, { userId: user.id });
            console.log(response.data.saved);
            if (response.data.success) {
                return {
                    success: true,
                    saved: response.data.saved
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login to use this feature'
            };
        }
    },
    addFavoriteStore: async (storeId) => {
        try {
            const user = JSON.parse(Cookies.get('user'));
            const response = await publicApi.post(`/customer/stores/${storeId}/follow`, { userId: user.id });
            console.log(response.data.saved);
            if (response.data.success) {
                return {
                    success: true,
                    saved: response.data.saved
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login to use this feature'
            };
        }
    },
    isSavedFood: async (foodId) => {
        try {
            const user = JSON.parse(Cookies.get('user'));
            const response = await publicApi.get(`/customer/products/check?foodId=${foodId}&userId=${user.id}`);
            if (response.data.success) {
                return {
                    success: true,
                    saved: response.data.saved
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login to use this feature'
            };
        }
    },
    isFollowingStore: async (storeId) => {
        try {
            const user = JSON.parse(Cookies.get('user'));
            const response = await publicApi.get(`/customer/stores/check?storeId=${storeId}&userId=${user.id}`);
            if (response.data.success) {
                return {
                    success: true,
                    saved: response.data.saved
                }
            }
            return {
                success: false,
                message: response.data.message
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login to use this feature'
            };
        }
    },
    getCartItem: async (data) => {
        try {
            console.log("fetch", data)
            const response = await publicApi.post('/data/cart/item', data);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch cart items'
            };
        } catch (error) {
            console.error('Cart item fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    getStorePromotions: async (storeId) => {
        try {
            const response = await publicApi.get(`/data/stores/promotions/${storeId}`);
            if (response?.data?.success) {
                return {
                    success: true,
                    data: response?.data?.data
                };
            }
            return {
                success: false,
                message: response?.data?.message || 'Failed to fetch store promotions'
            };
        } catch (error) {
            console.error('Store promotions fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    getAllSavedFood: async () => {
        try {
            const user = JSON.parse(Cookies.get('user'));
            const response = await publicApi.get(`/customer/products/saved?userId=${user.id}`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch saved foods'
            };
        } catch (error) {
            console.error('Saved foods fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    getAllFollowingStore: async () => {
        try {
            const user = JSON.parse(Cookies.get('user'));
            const response = await publicApi.get(`/customer/stores/following?userId=${user.id}`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch following stores'
            };
        } catch (error) {
            console.error('Following stores fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },
    getStorelist: async (filter) => {
        const params = {
            page: filter.page || 0,
            limit: filter.limit || 10,
            search: filter.search,
            latitude: filter.latitude,
            longitude: filter.longitude,
            maxAllowedDistance: filter.maxAllowedDistance || 10,
            currentTime: filter.currentTime
        };

        Object.keys(params).forEach(key => {
            if (params[key] === undefined || params[key] === null || params[key] === '') {
                delete params[key];
            }
        });

        try {
            const response = await publicApi.get('/data/stores', { params });
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch stores'
            };
        } catch (error) {
            console.error('Store list fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    },

    getFeatureFood: async (storeId) => {
        try {
            const response = await publicApi.get(`/data/feature/${storeId}`);
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                };
            }
            return {
                success: false,
                message: response.data.message || 'Failed to fetch featured foods'
            };
        } catch (error) {
            console.error('Featured foods fetch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Network error'
            };
        }
    }
};

export default publicDataService;
