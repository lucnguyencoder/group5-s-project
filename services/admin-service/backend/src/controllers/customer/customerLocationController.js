const customerLocationService = require('../../services/customer/customerLocationService');

const customerLocationController = {
    getAllLocations: async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await customerLocationService.getAllLocations(userId);

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },

    getLocationById: async (req, res) => {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;

            const result = await customerLocationService.getLocationById(addressId, userId);

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },

    createLocation: async (req, res) => {
        try {
            const userId = req.user.id;
            const locationData = req.body;

            const result = await customerLocationService.createLocation(locationData, userId);

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },

    updateLocation: async (req, res) => {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;
            const locationData = req.body;

            const result = await customerLocationService.updateLocation(addressId, locationData, userId);

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },

    deleteLocation: async (req, res) => {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;

            const result = await customerLocationService.deleteLocation(addressId, userId);

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },

    setDefaultLocation: async (req, res) => {
        try {
            const userId = req.user.id;
            const addressId = req.params.id;

            const result = await customerLocationService.setDefaultLocation(addressId, userId);

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    }
};

module.exports = customerLocationController;