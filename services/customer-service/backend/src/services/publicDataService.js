const Food = require('../models/food');
const Store = require('../models/store');
const StoreProfile = require('../models/storeProfile')(require('../config/db').sequelize);
const CustomizationGroup = require('../models/customizationGroup');
const CustomizationOption = require('../models/customizationOption');
const { Op, Sequelize } = require('sequelize');
const { consola } = require('consola');
const { StoreSettings, Discount, OrderItem, Order, sequelize, storeFeatureItems, Category } = require('../models');
const { calculateDistance, calculateShippingFee } = require('./common/locationService');
const { calculateOrderPricing } = require('./common/pricingCalculationService');
const storeMetricService = require('./store/storeMetricService');
const { includes, sort } = require('../store/adminPerm');
const { parse } = require('dotenv');

const MAX_ITEM_PER_PAGE = 40;

const publicDataService = {


    getStoreList: async (filter) => {
        try {
            // supported filter: latitude, longitude, maxAllowedDistance, isOpenSoon = false (currHour < opening_time || currHour > closing_time), search (name, phone, email)
            // idk 
            // default filter (can not be changed): is_active = true, isTempClosed = false

            let {
                latitude,
                longitude,
                currentTime,
                search,
                maxAllowedDistance = 10,
                page = 1
            } = filter;

            page = parseInt(page);
            limit = MAX_ITEM_PER_PAGE;
            maxAllowedDistance = parseFloat(maxAllowedDistance) * 1000;

            const filterByOpeningTime = !!currentTime;
            const hasCoordinates = latitude !== undefined && longitude !== undefined;
            const offset = (page - 1) * limit;

            const sql = `
                SELECT
                store_id,
                store_name,
                avatar_url,
                cover_image_url,
                address,
                phone,
                email,
                latitude,
                longitude,
                opening_time,
                closing_time,
                is_active,
                is_temp_closed
                ${hasCoordinates ? `,
                (6371000 * acos(
                    cos(radians(:lat)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:lng)) +
                    sin(radians(:lat)) *
                    sin(radians(latitude))
                )) AS distance` : ''}
                FROM stores
                WHERE is_active = TRUE
                AND is_temp_closed = FALSE
                ${filterByOpeningTime ? `AND opening_time <= :currentTime AND :currentTime <= closing_time` : ''}
                ${search ? 'AND (store_name LIKE :search OR phone LIKE :search OR email LIKE :search)' : ''}
                ${hasCoordinates ? `AND (6371000 * acos(
                    cos(radians(:lat)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(:lng)) +
                    sin(radians(:lat)) *
                    sin(radians(latitude))
                )) <= :radius` : ''}
                ${hasCoordinates ? 'ORDER BY distance' : 'ORDER BY store_id'}
                LIMIT :limit OFFSET :offset;
                `;

            const replacements = {
                limit,
                offset,
                ...(filterByOpeningTime && { currentTime }),
                ...(search && { search: `%${search}%` }),
                ...(hasCoordinates && {
                    lat: latitude,
                    lng: longitude,
                    radius: maxAllowedDistance
                })
            };

            const stores = await sequelize.query(sql, {
                replacements,
                type: Sequelize.QueryTypes.SELECT
            });

            return {
                success: true,
                status: 200,
                data: stores
            };
        } catch (error) {
            consola.error('Get nearby store service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get nearby stores',
                error: error.message
            };
        }
    },

    getStoreInfo: async (storeId) => {
        try {
            const store = await Store.findByPk(storeId);
            if (!store) {
                return {
                    success: false,
                    status: 404,
                    message: 'Store not found'
                };
            }

            return {
                success: true,
                status: 200,
                data: store
            };
        } catch (error) {
            consola.error('Get store info service error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get store information',
                error: error.message
            };
        }
    },

    getFoodById: async (foodId) => {
        try {
            // await storeMetricService.updateMetricService({ foodId });
            const food = await Food.findByPk(foodId, {
                include: [
                    {
                        model: Store,
                        as: 'store',
                        attributes: [
                            'id', 'name', 'description', 'avatar_url', 'cover_image_url', 'address',
                            'latitude', 'longitude', 'phone', 'email', 'opening_time', 'closing_time',
                            'status', 'is_active', 'isTempClosed', 'rating', 'total_reviews'
                        ],
                        required: true
                    },
                    {
                        model: sequelize.models.FoodMetrics,
                        as: 'metrics',
                        attributes: [
                            'food_id', 'number_of_ratings', 'number_of_orders',
                            'number_of_people_ordered', 'number_of_favorites', 'average_rating'
                        ],
                        required: false
                    }
                ]
            });
            if (!food) {
                return { success: false, status: 404, message: 'Food not found' };
            }

            const [storeSettings, groups, orderItems] = await Promise.all([
                StoreSettings.findOne({ where: { store_id: food.store_id } }),
                CustomizationGroup.findAll({
                    where: { food_id: foodId },
                    order: [['sort_order', 'ASC']]
                }),
                OrderItem.findAll({
                    where: { food_id: foodId },
                    include: [{
                        model: Order,
                        as: 'order',
                        where: { is_completed: true },
                        attributes: ['customer_id']
                    }]
                })
            ]);

            food.dataValues.storeSettings = storeSettings;

            const uniqueCustomerIds = new Set(orderItems.map(item => item.order.customer_id));
            food.dataValues.orderedPeople = [...uniqueCustomerIds];

            await Promise.all(groups.map(async group => {
                try {
                    group.dataValues.groupOptions = await CustomizationOption.findAll({
                        where: { group_id: group.group_id },
                        order: [['sort_order', 'ASC']]
                    });
                } catch {
                    group.dataValues.groupOptions = [];
                }
            }));

            food.dataValues.foodGroups = groups;

            return {
                success: true,
                status: 200,
                data: food
            };
        } catch (error) {
            consola.error('Get food by id error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get food by id',
                error: error.message
            };
        }
    },
    getCartItem: async (dataList) => {
        try {
            let res = await calculateOrderPricing(dataList);
            return {
                success: true,
                status: 200,
                data: res
            };
        }
        catch (error) {
            consola.error('Get cart item error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get cart item',
                error: error.message
            };
        }
    },

    getStorePromotions: async (storeId) => {
        try {
            const promotions = await Discount.findAll({
                where: {
                    store_id: storeId,
                    is_active: true,
                    is_hidden: false,
                    valid_from: { [Op.lte]: new Date() },
                    valid_to: { [Op.gte]: new Date() }
                },
                include: [
                    {
                        model: Store,
                        as: 'store',
                        where: { is_active: true, is_temp_closed: false }
                    }
                ],
                order: [['created_at', 'DESC']]
            });

            return {
                success: true,
                status: 200,
                data: promotions || [],
            };
        } catch (error) {
            consola.error('Get store promotions error:', error);
            return {
                success: false,
                status: 500,
                message: 'Failed to get store promotions',
                error: error.message
            };
        }
    },

    getFeatureFood: async (storeId) => {
        try {
            const checkStore = await Store.findByPk(storeId);
            if (!checkStore) {
                return {
                    status: 404,
                    success: false,
                    message: 'Can not find the store'
                }
            }
            const data = await storeFeatureItems.findAll({
                where: { store_id: storeId },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'category_name', 'description'],
                        include: {
                            model: Food,
                            as: 'foods'
                        }
                    },
                    {
                        model: Store,
                        as: 'store',
                    }
                ],
                order: [['position', 'ASC']]
            });
            return {
                status: 200,
                success: true,
                data: data
            }
        }
        catch (error) {
            console.log(error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
};

const getFoods = async (query = {}) => {
    /** Duong Nguyen
     * food filter:


     */
    try {
        let {
            sortBy = 'food_name',
            latitude,
            longitude,
            search,
            priceStart,
            priceEnd,
            exceptionIds = [],
            minPrepareTime,
            maxPrepareTime,
            storeId,
            currentTime,
            page = 1,
            limit = MAX_ITEM_PER_PAGE
        } = query;

        page = parseInt(page);
        limit = parseInt(limit);

        console.log('Get foods service:', query)

        /// ----------------------------------------------------------------
        // Store ID:
        if (!latitude && !longitude) {

            let foods = await Food.findAll({
                where: {
                    ...(storeId ? { store_id: storeId } : {}),
                    is_available: true,
                    ...(search && { food_name: { [Op.like]: `%${search}%` } }),
                    // ...(priceStart !== undefined ? { base_price: { [Op.gte]: priceStart } } : {}),
                    // ...(priceEnd !== undefined ? { base_price: { [Op.lte]: priceEnd } } : {}),
                    ...(exceptionIds.length > 0 ? { id: { [Op.notIn]: exceptionIds } } : {}),
                    // ...(minPrepareTime !== undefined ? { preparation_time: { [Op.gte]: minPrepareTime } } : {}),
                    // ...(maxPrepareTime !== undefined ? { preparation_time: { [Op.lte]: maxPrepareTime } } : {})
                },
                limit,
                offset: (page - 1) * limit,
                include: [
                    {
                        model: Store,
                        as: 'store',
                        where: { is_active: true, is_temp_closed: false },
                        required: true
                    },
                    {
                        model: sequelize.models.FoodMetrics,
                        as: 'metrics',
                        required: false

                    }
                ],
            });

            if (priceStart || priceEnd) {
                priceStart = parseFloat(priceStart);
                priceEnd = parseFloat(priceEnd);
                if (isNaN(priceStart)) priceStart = undefined;
                if (isNaN(priceEnd)) priceEnd = undefined;

                foods = foods.filter(f => {
                    const price = f.is_on_sale ? parseFloat(f.sale_price) : parseFloat(f.base_price);
                    return (priceStart === undefined || price >= priceStart) &&
                        (priceEnd === undefined || price <= priceEnd);
                }
                );
            }

            if (minPrepareTime !== undefined || maxPrepareTime !== undefined) {
                minPrepareTime = parseInt(minPrepareTime);
                maxPrepareTime = parseInt(maxPrepareTime);
                if (isNaN(minPrepareTime)) minPrepareTime = undefined;
                if (isNaN(maxPrepareTime)) maxPrepareTime = undefined;
                foods = foods.filter(f => {
                    const prepTime = parseInt(f.preparation_time);
                    return (minPrepareTime === undefined || prepTime >= minPrepareTime) &&
                        (maxPrepareTime === undefined || prepTime <= maxPrepareTime);
                });
            }

            return {
                success: true,
                status: 200,
                data: foods
            };
        } else {
            ///----------------------------------------------------------------
            // 1. Search follow latitude/longtitude mode (Location)
            // 2. storeId only
            // 3. Discover

            let store = {}

            if (latitude && longitude) {
                store = await publicDataService.getStoreList({
                    latitude,
                    longitude,
                    currentTime,
                    isOpenSoon: false,
                    maxAllowedDistance: 10,
                    search: search ? `%${search}%` : undefined,
                });

                console.log('Store list:', store);

                swd = store.data.map(s => {
                    return {
                        store_id: s.store_id,
                        distance: s.distance,
                    }
                });

                let supportedSortBy = ['food_name', 'metrics.average_rating', 'metrics.number_of_orders'];

                let foods = await Food.findAll({
                    where: {
                        store_id: swd.map(s => s.store_id),
                        is_available: true,
                        ...(search && { food_name: { [Op.like]: `%${search}%` } }),
                        ...(exceptionIds.length > 0 ? { id: { [Op.notIn]: exceptionIds } } : {}),
                        // ...(minPrepareTime !== undefined ? { preparation_time: { [Op.gte]: minPrepareTime } } : {}),
                        // ...(maxPrepareTime !== undefined ? { preparation_time: { [Op.lte]: maxPrepareTime } } : {})
                    },
                    limit,
                    offset: (page - 1) * limit,
                    // order: supportedSortBy.includes(sortBy) ? [[sortBy, 'ASC']] : [['food_name', 'ASC']],
                    include: [
                        {
                            model: Store,
                            as: 'store',
                            where: { is_active: true, is_temp_closed: false },
                            required: true
                        },
                        {
                            model: sequelize.models.FoodMetrics,
                            as: 'metrics',
                            required: false
                        }
                    ],
                });
                foods = foods.map(food => {
                    const swp = swd.find(s => s.store_id === food.store_id);
                    if (swp) {
                        food.dataValues.distance = swp.distance;
                    }
                    return food;
                });

                if (priceStart || priceEnd) {
                    priceStart = parseFloat(priceStart);
                    priceEnd = parseFloat(priceEnd);
                    if (isNaN(priceStart)) priceStart = undefined;
                    if (isNaN(priceEnd)) priceEnd = undefined;

                    foods = foods.filter(f => {
                        const price = f.is_on_sale ? parseFloat(f.sale_price) : parseFloat(f.base_price);
                        return (priceStart === undefined || price >= priceStart) &&
                            (priceEnd === undefined || price <= priceEnd);
                    }
                    );
                }

                if (minPrepareTime !== undefined || maxPrepareTime !== undefined) {
                    minPrepareTime = parseInt(minPrepareTime);
                    maxPrepareTime = parseInt(maxPrepareTime);
                    if (isNaN(minPrepareTime)) minPrepareTime = undefined;
                    if (isNaN(maxPrepareTime)) maxPrepareTime = undefined;
                    foods = foods.filter(f => {
                        const prepTime = parseInt(f.preparation_time);
                        return (minPrepareTime === undefined || prepTime >= minPrepareTime) &&
                            (maxPrepareTime === undefined || prepTime <= maxPrepareTime);
                    });
                }


                // if (sortBy === 'distance') {
                //     foods.sort((a, b) => a.dataValues.distance - b.dataValues.distance);
                // }

                // if (sortBy === "price") {
                //     foods.sort((a, b) => {
                //         const priceA = a.is_on_sale ? a.sale_price : a.base_price;
                //         const priceB = b.is_on_sale ? b.sale_price : b.base_price;
                //         return priceA - priceB;
                //     }
                //     );
                // }

                return {
                    success: true,
                    status: 200,
                    data: foods
                };

            }
        }
    }
    catch (error) {
        consola.error('Get foods error:', error);
        return {
            success: false,
            status: 500,
            message: 'Failed to get foods',
            error: error.message
        };

    }
}

module.exports = {
    getFoods,
    ...publicDataService
};
