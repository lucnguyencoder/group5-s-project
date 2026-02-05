const { disableDiscount } = require('../../controllers/store/storeDiscountController');
const { Discount } = require('../../models');

const storeDiscountService = {
    getAllDiscounts: async (storeId) => {
        try {
            return await Discount.findAll({
                where: { store_id: storeId },
                order: [['created_at', 'DESC']]
            });
        } catch (error) {
            throw new Error(`Error fetching discounts: ${error.message}`);
        }
    },

    getDiscountById: async (discountId) => {
        try {
            console.log('Fetching discount by ID:', discountId);
            return await Discount.findOne({
                where: {
                    discount_id: discountId,
                }
            });
        } catch (error) {
            throw new Error(`Error fetching discount by ID: ${error.message}`);
        }
    },

    createDiscount: async (storeId, discountData) => {
        try {
            /**
             * Discount {
        int discount_id PK
        int store_id FK
        string discount_name
        string description
        enum discount_type "percentage, fixed_amount"
        enum discount_sale_type "items", "delivery"
        decimal discount_value
        decimal max_discount_amount "nullable"
        datetime valid_from "nullable"
        datetime valid_to "nullable"
        int usage_limit "nullable"
        boolean is_price_condition "default false"
        int min_price_condition "nullable"
        boolean is_active
        datetime created_at
        datetime updated_at
    }
             */

            const existingDiscount = await Discount.findOne({
                where: {
                    store_id: storeId,
                    code: discountData.code
                }
            });

            if (existingDiscount) {
                throw new Error('Code already exists');
            }

            const {
                discount_name,
                code,
                description,
                discount_type,
                discount_sale_type,
                discount_value,
                max_discount_amount,
                valid_from,
                valid_to,
                usage_limit,
                is_price_condition,
                min_price_condition,
                is_active,
                is_limit_usage_per_user,
                allow_usage_per_user,
                is_hidden
            } = discountData;

            return await Discount.create({
                discount_name,
                code,
                description,
                discount_type,
                discount_sale_type,
                discount_value,
                max_discount_amount,
                valid_from,
                valid_to,
                usage_limit,
                is_price_condition,
                min_price_condition,
                is_active,
                is_limit_usage_per_user,
                allow_usage_per_user,
                is_hidden,
                store_id: storeId
            });
        } catch (error) {
            throw new Error(`Error creating discount: ${error.message}`);
        }
    },

    updateDiscount: async (discountId, discountData) => {
        try {
            const discount = await Discount.findByPk(discountId);
            if (!discount) {
                throw new Error('Discount not found');
            }
            const {
                discount_name,
                code,
                description,
                discount_type,
                discount_sale_type,
                discount_value,
                max_discount_amount,
                valid_from,
                valid_to,
                usage_limit,
                is_price_condition,
                min_price_condition,
                is_limit_usage_per_user,
                allow_usage_per_user,
                is_active,
                is_hidden
            } = discountData;
            return await discount.update({
                discount_name,
                code,
                description,
                discount_type,
                discount_sale_type,
                discount_value,
                max_discount_amount,
                valid_from,
                valid_to,
                usage_limit,
                is_price_condition,
                min_price_condition,
                is_limit_usage_per_user,
                allow_usage_per_user,
                is_active,
                is_hidden
            });
        } catch (error) {
            throw new Error(`Error updating discount: ${error.message}`);
        }
    },

    toggleDiscount: async (discountId) => {
        try {
            const discount = await Discount.findByPk(discountId);
            if (!discount) {
                throw new Error('Discount not found');
            }
            return await discount.update({ is_active: false });
        } catch (error) {
            throw new Error(`Error disabling discount: ${error.message}`);
        }
    }
}

module.exports = storeDiscountService;