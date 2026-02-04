import axios from "axios";
import { handleApiError } from "@/utils/apiUtils";
import { toast } from "sonner";
import Cookies from 'js-cookie';
import * as geolib from 'geolib';
import emergencyLocationData from "@/store/emergencyProvineData";

const API_BASE_URL = 'http://localhost:3000/api';
const PROVINCES_API_URL = "https://provinces.open-api.vn/api";
const LOCATION_API_URL = `${API_BASE_URL}/customer/locations`;

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

            toast.error("Your session has expired. Please log in again.");
            Cookies.remove('token');
            Cookies.remove('user');
            window.location.href = '/auth/login';
        }
        return Promise.reject(error);
    }
);


export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    });
};


export const getProvinces = async () => {
    try {
        const response = await axios.get(`${PROVINCES_API_URL}/`);


        return response.data.map(province => ({
            value: province.code,
            display: province.name,
            code: province.code
        }));

    } catch (error) {
        console.error("Error fetching provinces:", error);
        return emergencyLocationData.provine.map(province => ({
            value: province.code,
            display: province.name,
            code: province.code
        }));
    }
};


export const getDistrictsByProvince = async (provinceCode) => {
    try {
        const response = await axios.get(`${PROVINCES_API_URL}/p/${provinceCode}?depth=2`);

        return response.data.districts.map(district => ({
            value: district.code,
            display: district.name,
            code: district.code
        }));
    } catch (error) {
        console.error(`Error fetching districts for province ${provinceCode}:`, error);
        return emergencyLocationData.hn_distinct.districts.map(province => ({
            value: province.code,
            display: province.name,
            code: province.code
        }));
    }
};


export const getWardsByDistrict = async (districtCode) => {
    try {
        const response = await axios.get(`${PROVINCES_API_URL}/d/${districtCode}?depth=2`);

        return response.data.wards.map(ward => ({
            value: ward.code,
            display: ward.name,
            code: ward.code
        }));
    } catch (error) {
        console.error(`Error fetching wards for district ${districtCode}:`, error);
        return emergencyLocationData.hn_ward.wards.map(ward => ({
            value: ward.code,
            display: ward.name,
            code: ward.code
        }));
    }
};


export const reverseGeocode = async (latitude, longitude) => {
    try {
        return {
            latitude,
            longitude,
            address: `Coordinates: ${latitude}, ${longitude}`
        };
    } catch (error) {
        console.error("Error reverse geocoding:", error);
        throw error;
    }
};

export const getLocations = async () => {
    try {
        const response = await api.get('/customer/locations');
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const getLocationById = async (locationId) => {
    try {
        const response = await api.get(`/customer/locations/${locationId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

export const calculateDistanceOnDevice = (lat1, lon1, lat2, lon2) => {
    return geolib.getPreciseDistance(
        {
            latitude: parseFloat(lat1),
            longitude: parseFloat(lon1),
        },
        {
            latitude: parseFloat(lat2),
            longitude: parseFloat(lon2),
        }
    );
};

export const createLocation = async (locationData) => {
    try {
        const response = await api.post('/customer/locations', locationData);
        return response.data;
    } catch (error) {
        return handleApiError(error, true);
    }
};


export const updateLocation = async (locationId, locationData) => {
    try {
        const response = await api.put(`/customer/locations/${locationId}`, locationData);
        return response.data;
    } catch (error) {
        return handleApiError(error, true);
    }
};


export const deleteLocation = async (locationId) => {
    try {
        const response = await api.delete(`/customer/locations/${locationId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error, true);
    }
};


export const setDefaultLocation = async (locationId) => {
    try {
        const response = await api.put(`/customer/locations/${locationId}/default`);
        return response.data;
    } catch (error) {
        return handleApiError(error, true);
    }
};


export const saveLocation = async (locationData) => {
    try {
        const apiData = {
            address_line: locationData.address_line,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            recipient_name: locationData.recipient_name,
            recipient_phone: locationData.phone,
            is_default: locationData.is_default || false,

            province_name: locationData.province_name,
            district_name: locationData.district_name,
            ward_name: locationData.ward_name
        };

        return await createLocation(apiData);
    } catch (error) {
        console.error("Error saving location:", error);
        throw error;
    }
};

export default {
    getCurrentLocation,
    getProvinces,
    getDistrictsByProvince,
    getWardsByDistrict,
    reverseGeocode,
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation,
    setDefaultLocation,
    saveLocation,
    calculateDistanceOnDevice
};
