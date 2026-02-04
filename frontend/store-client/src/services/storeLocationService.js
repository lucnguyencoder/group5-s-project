import * as geolib from 'geolib';


const storeLocationService = {
    getCurrentLocation: () => {
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
    },

    calculateDistanceOnDevice: (lat1, lon1, lat2, lon2) => {
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
    }
}

export default storeLocationService;