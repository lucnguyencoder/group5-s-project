const { Order, OrderEvent, User, Store, OrderItem, sequelize, StoreSettings, UserGroup, StoreProfile } = require("../../models");
const { orderOfflineService } = require("./offline/orderOfflineService");

const commonOrderService = {
    getOrderById: async (orderId) => {
        try {
            const order = await Order.findByPk(orderId, {
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents',
                        required: true,

                    },
                    {
                        model: User,
                        as: 'customer',
                        attributes: ['id', 'email']
                    },
                    {
                        model: Store,
                        as: 'store',
                        include: [
                            {
                                model: StoreSettings,
                                as: 'settings',
                                attributes: ['bank', 'bank_number']
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'courier',
                        attributes: ['id', 'email'],
                        required: false
                    },
                    {
                        model: OrderItem,
                        as: 'orderItems',
                        required: false,
                        attributes: ['item_id', 'food_id', 'quantity', 'base_price', 'sale_price', 'customization', 'snapshot_food_name'],
                    }
                ]
            });
            return order;
        } catch (error) {
            throw new Error('Error fetching order');
        }
    },
    // new getOrderList replace all getOrderByFilter and getOrderByStatusFilter
    getAllOrders: async (filter = {}, pagination = {}, sortBy = {}) => {
        /**
         * pagination = {} => not used yet
         * pagination = { limit: 10, page: 1 }
         *
        */

        // sortby chỉ hỗ trợ sort cột ở field th
        // sortBy = {} hoặc { field: 'id', direction: 'DESC' }

        // Get valid attributes from Order model
        const validOrderAttributes = Object.keys(Order.rawAttributes);

        let orderFilter = null;
        let orderEventFilter = null;

        const { status: orderStatusFilter, ...rest } = filter || {};

        orderFilter = Object.fromEntries(
            Object.entries(rest).filter(([key]) => validOrderAttributes.includes(key))
        );
        orderEventFilter = orderStatusFilter || null;

        console.log(filter)

        try {

            const query = {
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents',
                        required: true,
                    },
                    {
                        model: User,
                        as: 'customer',
                        attributes: ['id', 'email']
                    },
                    {
                        model: Store,
                        as: 'store',
                        include: [
                            {
                                model: StoreSettings,
                                as: 'settings',
                                attributes: ['bank', 'bank_number']
                            }
                        ]
                    },
                    {
                        model: User,
                        as: 'courier',
                        attributes: ['id', 'email'],
                        required: false,
                        include: {
                            model: StoreProfile,
                            as: 'storeProfile',
                            required: true,
                        }
                    },
                    {
                        model: OrderItem,
                        as: 'orderItems',
                        required: false,
                        attributes: ['item_id', 'food_id', 'quantity', 'base_price', 'sale_price', 'customization', 'snapshot_food_name', 'snapshot_food_image'],
                    }
                ],
                order: [
                    ['created_at', 'DESC']
                ]
            };

            // pagination
            if (pagination.limit && pagination.page) {
                query.limit = pagination.limit;
                query.offset = (pagination.page - 1) * pagination.limit;
            }

            if (orderFilter) {
                query.where = orderFilter;
            }

            if (sortBy && sortBy.field) {
                query.order = [[sortBy.field, sortBy.direction || 'ASC']];
            }

            const orders = await Order.findAll(query);
            orders.forEach(order => {
                order.orderEvents = order.orderEvents.sort(
                    (a, b) => new Date(b.event_timestamp) - new Date(a.event_timestamp)
                );
            });
            if (orderEventFilter) {
                const filteredOrders = orders.filter(order => {
                    const events = order.orderEvents || [];
                    const pickUp = order.order_type === 'pickup';
                    const { currentMainStatus } = orderOfflineService.getEventInfo(events, pickUp);
                    return currentMainStatus === orderEventFilter;
                });
                return filteredOrders;
            }

            return orders;
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            throw new Error('Error fetching orders');
        }
    },

    updateOrderStatusToPreparing: async (newEvent, validateInformation) => {
        const t = await sequelize.transaction();
        try {
            const checkGroup = await User.findByPk(validateInformation.staffId, {
                include: [
                    {
                        model: UserGroup,
                        as: 'group',
                        required: true
                    }
                ]
            });
            const groupName = checkGroup.dataValues.group.dataValues.name;
            if (groupName !== 'sale_agent') {
                await t.rollback();
                return {
                    status: 403,
                    success: false,
                    message: "You do not have permission to update this order"
                }
            }
            const checkStaff = await StoreProfile.findOne({
                where: { store_id: validateInformation.storeId, user_id: validateInformation.staffId }
            });
            if (!checkStaff) {
                await t.rollback();
                return {
                    status: 403,
                    success: false,
                    message: "You do not have permission to update this order"
                }
            }
            const checkOrder = await Order.findOne({ where: { order_id: validateInformation.orderId, store_id: validateInformation.storeId } });
            if (!checkOrder) {
                await t.rollback();
                return {
                    status: 404,
                    success: false,
                    message: "Order not found"
                }
            }
            await Order.update({ is_paid: true },
                {
                    where: { order_id: validateInformation.orderId },
                    transaction: t
                });
            const updatedEvent = await OrderEvent.create(newEvent, { transaction: t });
            if (!updatedEvent) {
                await t.rollback();
                return {
                    status: 400,
                    success: false,
                    message: "Failed to create order event"
                }
            }
            await t.commit();
            return {
                status: 201,
                success: true,
                data: updatedEvent
            };
        }
        catch (error) {
            await t.rollback();
            console.log(error)
            return {
                status: 500,
                success: false,
                message: "Server error: " + error.message
            };
        }
    },
}
module.exports = commonOrderService;
