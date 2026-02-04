const { getCurrentStore } = require('../../services/store/StoreAuthService');
const storeDiscountService = require('../../services/store/storeDiscountService');
const consola = require('consola');

const storeDiscountController = {
    getAllDiscounts: async (req, res) => {
        const curr_store = await getCurrentStore(req);
        // consola.info('Current store:', curr_store);
        try {
            const storeId = curr_store.data.store.id;
            const discounts = await storeDiscountService.getAllDiscounts(storeId);
            return res.status(200).json({
                success: true,
                data: discounts
            });
        } catch (error) {
            consola.error('Error fetching all discounts:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch discounts',
                error: error.message
            });
        }
    },
    getDiscountById: async (req, res) => {
        try {
            const discountId = req.params.id;
            const discount = await storeDiscountService.getDiscountById(discountId);
            if (!discount) {
                return res.status(404).json({
                    success: false,
                    message: 'Discount not found'
                });
            }
            return res.status(200).json({
                success: true,
                data: discount
            });
        } catch (error) {
            consola.error('Error fetching discount by ID:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch discount',
                error: error.message
            });
        }
    },

    createDiscount: async (req, res) => {
        const curr_store = await getCurrentStore(req);
        try {
            const storeId = curr_store.data.store.id;
            const discountData = req.body;
            const newDiscount = await storeDiscountService.createDiscount(storeId, discountData);
            return res.status(201).json({
                success: true,
                data: newDiscount
            });
        } catch (error) {
            consola.error('Error creating discount:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create discount',
                error: error.message
            });
        }
    },

    updateDiscount: async (req, res) => {
        try {
            const discountId = req.params.id;
            const discountData = req.body;
            const updatedDiscount = await storeDiscountService.updateDiscount(discountId, discountData);
            if (!updatedDiscount) {
                return res.status(404).json({
                    success: false,
                    message: 'Discount not found'
                });
            }
            return res.status(200).json({
                success: true,
                data: updatedDiscount
            });
        } catch (error) {
            consola.error('Error updating discount:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update discount',
                error: error.message
            });
        }
    },

    toggleDiscount: async (req, res) => {
        try {
            const discountId = req.params.id;
            const result = await storeDiscountService.toggleDiscount(discountId);
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Discount not found or already disabled'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Discount toggled successfully'
            });
        } catch (error) {
            consola.error('Error toggling discount:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to toggle discount',
                error: error.message
            });
        }
    }
}

module.exports = storeDiscountController;