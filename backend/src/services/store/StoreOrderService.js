const { User, OrderItem, Food, StoreProfile, sequelize } = require("../../models");
const Order = require("../../models/order");
const OrderEvent = require("../../models/orderEvent");
const commonOrderService = require("../common/commonOrderService");
const { orderOfflineService } = require("../common/offline/orderOfflineService");

const ALLOWED_UPDATE_VALUE = ['preparing', 'delivering', 'ready_to_pickup', 'completed', 'refunded'];
const COURIER_GROUP_ID = 5;

const StoreOrderService = {
    getOrderList: async (filter, pagination, sortBy, currentGroup) => {
        try {

            let data = await commonOrderService.getAllOrders(filter, pagination, sortBy);

            if (!currentGroup) {
                return {
                    status: 200,
                    success: true,
                    data: data
                }
            }

            try {
                data = data.map(order => {
                    const orderEvents = order.orderEvents || [];
                    let eventsAnalyzed = orderOfflineService.getEventInfo(orderEvents, order.order_type !== 'delivery');
                    order.dataValues.displayEventInformation = eventsAnalyzed;
                    return order;
                });
            }
            catch (error) {
                console.error('Error processing allowed actions:', error);
            }

            try {
                data = data.map(order => {
                    const orderEvents = order.orderEvents || [];
                    let allowedAction = orderOfflineService.getAllowedOrderActivity(orderEvents, order?.is_paid, order?.is_completed, order?.order_type, order?.payment_option, currentGroup);
                    order.dataValues.allowedActivity = allowedAction;
                    return order;
                });
            }
            catch (error) {
                console.error('Error processing allowed actions:', error);
            }

            return {
                status: 200,
                success: true,
                data: data
            }

        }
        catch (error) {
            console.log(error)
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
    checkSameInformation: async (orderId, validateData) => {
        try {
            const order = await Order.findOne({
                where: { order_id: orderId },
                attributes: ['order_id', 'customer_id', 'store_id', 'assigned_courier_id', 'is_paid', 'is_completed'],
                include: [
                    {
                        model: User,
                        as: 'customer',
                        attributes: ['id', 'email']
                    },
                    {
                        model: User,
                        as: 'courier',
                        attributes: ['id', 'email']
                    }
                ]
            })
            if (!order) {
                return false;
            }

            console.log('Order data:', order.toJSON());
            console.log('Validate data:', validateData);

            return Object.keys(validateData).every(key => order[key] === validateData[key]);

        }
        catch (error) {
            console.error('Error checking same information:', error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
    updateOrderEventStatus: async (orderId, currentGroup, updatedStatusValue, storeProfile) => {
        try {

            if (!ALLOWED_UPDATE_VALUE.includes(updatedStatusValue)) {
                return {
                    status: 400,
                    success: false,
                    message: 'Invalid status value'
                }
            }

            const order = await Order.findOne({
                where: { order_id: orderId },
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents'
                    }
                ]
            });

            const orderEvents = order.orderEvents || [];
            const allowedAction = orderOfflineService.getAllowedOrderActivity(orderEvents, order?.is_paid, order?.is_completed, order?.order_type, order?.payment_option, currentGroup);
            /**
             * ALLOWED ACTION RETURN:
                "allowAddPreparingEvent": true,
                "allowAddDeliveringEvent": false,
                "allowAddReadyToPickupEvent": false,
                "allowAddCompletedEvent": false,
                "allowAddCancelledEvent": true,
                "allowAddRefundEvent": false,
             */
            const convertToEventName = {
                'preparing': 'Preparing',
                'delivering': 'Delivering',
                'ready_to_pickup': 'ReadyToPickup',
                'completed': 'Completed',
                'cancelled': 'Cancelled',
                'refunded': 'Refund'
            }

            if (!allowedAction[`allowAdd${convertToEventName[updatedStatusValue]}Event`]) {
                return {
                    status: 403,
                    success: false,
                    message: `You do not have permission to update this order to ${updatedStatusValue}`
                }
            } else {
                const newEvent = {
                    order_id: orderId,
                    event_type: updatedStatusValue,
                    triggered_by_user_id: storeProfile.user_id,
                    snapshot_triggered_by_name: storeProfile.full_name,
                    event_timestamp: new Date(),
                };
                await OrderEvent.create(newEvent);
                return {
                    status: 200,
                    success: true,
                    data: newEvent
                }
            }
        }
        catch (error) {
            console.error('Error updating order event status:', error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
    updateOrderEventDelivery: async (orderId, storeProfile, courierId) => {
        try {
            const order = await Order.findOne({
                where: { order_id: orderId },
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents'
                    },
                    {
                        model: User,
                        as: 'courier',
                        attributes: ['id', 'email']
                    }
                ]
            });

            if (!order) {
                return {
                    status: 404,
                    success: false,
                    message: 'Order not found'
                }
            }

            const orderEvents = order.orderEvents || [];
            const allowedAction = orderOfflineService.getAllowedOrderActivity(
                orderEvents,
                order?.is_paid,
                order?.is_completed,
                order?.order_type,
                order?.payment_option,
                storeProfile.group?.name
            );

            const isCurrentlyAssigned = order.assigned_courier_id !== null;

            if (courierId && !allowedAction.allowAssignCourier && !allowedAction.allowUnassignCourier) {
                return {
                    status: 403,
                    success: false,
                    message: 'You do not have permission to assign courier to this order'
                }
            }

            if (!courierId && !allowedAction.allowUnassignCourier) {
                return {
                    status: 403,
                    success: false,
                    message: 'You do not have permission to unassign courier from this order'
                }
            }

            let courierInfo = null;
            if (courierId) {
                courierInfo = await User.findOne({
                    where: { id: courierId },
                    include: [{
                        model: StoreProfile,
                        as: 'storeProfile',
                        where: { store_id: order.store_id }
                    }]
                });

                if (!courierInfo) {
                    return {
                        status: 404,
                        success: false,
                        message: 'Courier not found or not associated with this store'
                    }
                }
            }

            const t = await sequelize.transaction();

            try {
                if (courierId) {
                    await Order.update({
                        assigned_courier_id: courierId,
                        snapshot_assigned_courier_name: courierInfo.storeProfile.full_name,
                        snapshot_assigned_courier_phone: courierInfo.storeProfile.phone
                    }, {
                        where: { order_id: orderId },
                        transaction: t
                    });

                    const newEvent = {
                        order_id: orderId,
                        event_type: 'courier_assigned',
                        triggered_by_user_id: storeProfile.user_id,
                        snapshot_triggered_by_name: storeProfile.full_name,
                        event_timestamp: new Date(),
                    };

                    await OrderEvent.create(newEvent, { transaction: t });
                    await t.commit();

                    return {
                        status: 200,
                        success: true,
                        data: newEvent
                    }
                } else {
                    await Order.update({
                        assigned_courier_id: null,
                        snapshot_assigned_courier_name: null,
                        snapshot_assigned_courier_phone: null
                    }, {
                        where: { order_id: orderId },
                        transaction: t
                    });

                    const newEvent = {
                        order_id: orderId,
                        event_type: 'courier_unassigned',
                        triggered_by_user_id: storeProfile.user_id,
                        snapshot_triggered_by_name: storeProfile.full_name,
                        event_timestamp: new Date(),
                    };

                    await OrderEvent.create(newEvent, { transaction: t });
                    await t.commit();

                    return {
                        status: 200,
                        success: true,
                        data: newEvent
                    }
                }
            } catch (error) {
                await t.rollback();
                throw error;
            }

        } catch (error) {
            console.error('Error updating courier assignment:', error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
    updateOrderEventIsPaid: async (orderId, storeProfile, currentGroup) => {
        try {
            const order = await Order.findOne({
                where: { order_id: orderId },
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents'
                    }
                ]
            });

            if (!order) {
                return {
                    status: 404,
                    success: false,
                    message: 'Order not found'
                }
            }

            if (order.is_paid) {
                return {
                    status: 400,
                    success: false,
                    message: 'Order is already paid'
                }
            }

            const orderEvents = order.orderEvents || [];
            const allowedAction = orderOfflineService.getAllowedOrderActivity(
                orderEvents,
                order?.is_paid,
                order?.is_completed,
                order?.order_type,
                order?.payment_option,
                currentGroup
            );

            if (!allowedAction.allowSetIsPaid) {
                return {
                    status: 403,
                    success: false,
                    message: 'You do not have permission to update payment status for this order'
                }
            }

            const t = await sequelize.transaction();

            try {
                await Order.update({
                    is_paid: true,
                    payment_completed_at: new Date()
                }, {
                    where: { order_id: orderId },
                    transaction: t
                });

                const newEvent = {
                    order_id: orderId,
                    event_type: 'payment_completed',
                    triggered_by_user_id: storeProfile.user_id,
                    snapshot_triggered_by_name: storeProfile.full_name,
                    event_timestamp: new Date(),
                };

                await OrderEvent.create(newEvent, { transaction: t });
                await t.commit();

                return {
                    status: 200,
                    success: true,
                    data: newEvent
                }
            } catch (error) {
                await t.rollback();
                throw error;
            }

        } catch (error) {
            console.error('Error updating payment status:', error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
    checkAndUpdateOrderCompletion: async (orderId) => {
        try {
            const order = await Order.findOne({
                where: { order_id: orderId },
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents'
                    }
                ]
            });

            if (!order) {
                return { shouldUpdate: false };
            }

            const orderEvents = order.orderEvents || [];
            const isPickup = order.order_type === 'pickup';
            const { isCompleted } = orderOfflineService.getEventInfo(orderEvents, isPickup);

            if (isCompleted && !order.is_completed) {
                await Order.update({
                    is_completed: true
                }, {
                    where: { order_id: orderId }
                });
                return { shouldUpdate: true, wasUpdated: true };
            }

            return { shouldUpdate: isCompleted, wasUpdated: false };
        } catch (error) {
            console.error('Error checking order completion:', error);
            return { shouldUpdate: false, error: error.message };
        }
    },
    updateOrderEventCancelled: async (orderId, storeProfile, currentGroup, reason) => {
        try {
            const order = await Order.findOne({
                where: { order_id: orderId },
                include: [
                    {
                        model: OrderEvent,
                        as: 'orderEvents'
                    }
                ]
            });

            if (!order) {
                return {
                    status: 404,
                    success: false,
                    message: 'Order not found'
                }
            }

            const orderEvents = order.orderEvents || [];
            const allowedAction = orderOfflineService.getAllowedOrderActivity(
                orderEvents,
                order?.is_paid,
                order?.is_completed,
                order?.order_type,
                order?.payment_option,
                currentGroup
            );

            if (!allowedAction.allowAddCancelledEvent) {
                return {
                    status: 403,
                    success: false,
                    message: 'You do not have permission to cancel this order'
                }
            }

            const newEvent = {
                order_id: orderId,
                event_type: 'cancelled',
                triggered_by_user_id: storeProfile.user_id,
                snapshot_triggered_by_name: storeProfile.full_name,
                event_reason: reason || null,
                event_timestamp: new Date(),
            };

            await OrderEvent.create(newEvent);

            return {
                status: 200,
                success: true,
                data: newEvent
            }

        } catch (error) {
            console.error('Error cancelling order:', error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error
            }
        }
    },
    getCourierList: async (storeId) => {
        try {
            let couriers = await User.findAll({
                where: { is_active: true, group_id: COURIER_GROUP_ID },
                include: [
                    {
                        model: StoreProfile,
                        as: 'storeProfile',
                        where: { store_id: storeId, is_courier_active: true },
                        attributes: ['full_name', 'phone']
                    }
                ],
                attributes: ['id', 'email']
            });

            couriers = await Promise.all(couriers.map(async (courier) => {
                const assignedOrders = await Order.findAll({
                    where: { assigned_courier_id: courier.id, store_id: storeId, is_completed: false },
                    attributes: ['order_id', 'is_completed', 'is_paid']
                });
                return {
                    ...courier.toJSON(),
                    assignedOrders: assignedOrders.map(order => ({
                        orderId: order.order_id,
                        isCompleted: order.is_completed,
                        isPaid: order.is_paid
                    }))
                };
            }));

            couriers.sort((a, b) => b.assignedOrders.length - a.assignedOrders.length);

            couriers.reverse();


            if (!couriers || couriers.length === 0) {
                return {
                    status: 404,
                    success: false,
                    message: 'No couriers found for this store'
                };
            }

            return {
                status: 200,
                success: true,
                data: couriers
            };
        } catch (error) {
            console.error('Error fetching courier list:', error);
            return {
                status: 500,
                success: false,
                message: 'Server Error: ' + error.message
            };
        }
    },
}

module.exports = StoreOrderService;