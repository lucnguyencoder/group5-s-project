const geolib = require('geolib');

const calculateDistance = (lat1, lon1, lat2, lon2) => {
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
/**
             * {
                    "store_id": 1,
                    "allow_pick_up": false,
                    "shipping_per_km_fee": 10000,
                    "minimum_shipping_fee": 20000,
                    "shipping_distance_limit": 10,
                    "shipping_distance_to_calculate_fee": 3,
                    "minimum_order_price": 10000000,
                    "bank": "Techcombank",
                    "bank_number": "19037648903016",
                    "created_at": "2025-07-14 15:25:11",
                    "updated_at": "2025-07-14 15:25:11"
                }
             */

const calculateShippingFee = (distance, storeSettings) => {
    distance = distance / 1000;
    if (distance <= storeSettings.shipping_distance_to_calculate_fee) {
        return storeSettings.minimum_shipping_fee;
    }

    const extraDistance = distance - storeSettings.shipping_distance_to_calculate_fee;
    const extraFee = Math.ceil(extraDistance) * storeSettings.shipping_per_km_fee;

    return storeSettings.minimum_shipping_fee + extraFee;
}

module.exports = {
    calculateDistance,
    calculateShippingFee
}