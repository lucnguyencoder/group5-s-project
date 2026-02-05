const { where, Op } = require("sequelize");
const { Food, Review, OrderItem, Order, UserSavedProduct } = require("../../models");
const FoodMetrics = require("../../models/foodMetrics");
const { default: consola } = require("consola");

const storeMetricService = {
    initFoodMetric: async (foodId) => {
        try {
            if (!foodId || isNaN(foodId)) {
                throw new Error('Invalid foodId');
            }

            const food = await Food.findByPk(foodId);
            if (!food) {
                throw new Error('Food not found');
            }

            const existingMetric = await FoodMetrics.findOne({ where: { food_id: foodId } });
            if (existingMetric) {
                return existingMetric;
            }

            const metric = await FoodMetrics.create({
                food_id: foodId
            });

            return metric;
        } catch (error) {
            consola.error('Error initializing food metric:', error);
            throw error;
        }
    },
    getMetricService: async (foodId) => {
        try {
            const metric = await FoodMetrics.findOne({
                where: { food_id: foodId }
            });

            if (!metric) {
                throw new Error('Food metrics not found');
            }

            return metric;
        } catch (error) {
            consola.error('Error fetching food metrics:', error);
            throw error;
        }
    },
    updateMetricService: async ({ foodId, updateType = null }) => {
        try {
            let metric = await FoodMetrics.findOne({
                where: { food_id: foodId }
            });

            if (!metric || metric === undefined) {
                metric = await storeMetricService.initFoodMetric(foodId);
            }
            let update = {}
            if (updateType === 'rating' || updateType === null) {
                const allRatings = await Review.findAll({
                    where: { food_id: foodId },
                    attributes: ['rating'],
                    raw: true
                });

                const number_of_rating = allRatings.length || 0;
                const totalRating = allRatings.reduce((sum, review) => sum + review.rating, 0);
                const averageRating = allRatings.length > 0 ? totalRating / allRatings.length : 0;
                update.number_of_ratings = number_of_rating;
                update.average_rating = averageRating;
            }
            if (updateType === 'order' || updateType === null) {
                const orderUniqueId = await OrderItem.findAll({
                    where: { food_id: foodId },
                    attributes: [[OrderItem.sequelize.fn('DISTINCT', OrderItem.sequelize.col('order_id')), 'order_id']],
                    raw: true
                });
                const orderIdOnly = orderUniqueId.map(item => item.order_id);
                update.number_of_orders = orderIdOnly.length;
                const successOrderId = await Order.findAll({
                    where: {
                        order_id: { [Op.in]: orderIdOnly },
                        is_completed: true
                    },
                    attributes: ['order_id'],
                    raw: true
                });
                if (successOrderId.length > 0) {
                    const customerUniqueId = await Order.findAll(
                        {
                            where: {
                                order_id: { [Op.in]: orderIdOnly }
                            },
                            attributes: [[Order.sequelize.fn('DISTINCT', Order.sequelize.col('customer_id')), 'customer_id']],
                            raw: true
                        }
                    );
                    update.number_of_people_ordered = customerUniqueId.length;
                }
                else {
                    update.number_of_people_ordered = 0;
                }
            }

            if (updateType === 'favorite' || updateType === null) {
                const saved_count = await UserSavedProduct.count({
                    where: { food_id: foodId }
                });

                update.number_of_favorites = saved_count;
            }

            await FoodMetrics.update(update, {
                where: { food_id: foodId }
            });


        } catch (error) {
            consola.error('Error updating food metrics:', error);
            throw error;
        }
    },
    getMetricByFoodId: async (foodId) => {
        try {
            const res = await FoodMetrics.findOne({
                where: { food_id: foodId }
            });
            if (!res) {
                await storeMetricService.initFoodMetric(foodId);
                return await FoodMetrics.findOne({
                    where: { food_id: foodId }
                });
            }
            return res;
        } catch (err) {
            console.error('Error fetching food metrics by ID:', err);
            throw err;
        }
    }
}

module.exports = storeMetricService;