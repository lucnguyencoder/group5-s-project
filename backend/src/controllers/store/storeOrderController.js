const commonOrderService = require("../../services/common/commonOrderService");
const { getCurrentStore } = require("../../services/store/StoreAuthService");
const StoreOrderService = require("../../services/store/StoreOrderService")

const storeOrderController = {
    getOrderList: async (req, res) => {
        try {
            // console.log('Current id: ' + req.user.id);
            const curr_store = await getCurrentStore(req);

            // console.log('Current store:', curr_store);

            const storeId = curr_store?.data.store?.id;

            if (!storeId) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            const par = req.query || {};
            const filter = {
                ...par,
                store_id: storeId,
            };
            delete filter?.limit;
            delete filter?.page;
            delete filter?.sortBy;


            let pagination = {};
            if (par.pagination) {
                pagination = {
                    limit: parseInt(par?.pagination?.limit),
                    page: parseInt(par?.pagination?.page)
                };
            }

            let sortBy = {};
            if (par.sortBy) {
                sortBy = {
                    field: par?.sortBy?.field,
                    direction: par?.sortBy?.direction
                }
            }

            let current_group = curr_store?.data?.staffInfo?.group?.name || null;

            const response = await StoreOrderService.getOrderList(filter, pagination, sortBy, current_group);
            // console.log('Response from StoreOrderService.getOrderList:', response);
            if (response.success) {
                return res.status(response.status).json({
                    success: true,
                    data: response.data,
                    curr: curr_store.data
                })
            }
            return res.status(response.status).json({
                success: false,
                message: response.message
            })
        }
        catch (error) {
            console.error('Error in getOrderList:', error);
            return res.status(500).json({
                success: false,
                message: 'Unexpected Error'
            })
        }
    },
    updateOrder: async (req, res) => {
        /**
         * type: add-state, edit-courier, change-paid, cancelled

            add-state: => value: {new_state} in 'preparing', 'delivering', 'ready_to_pickup', 'completed', 'refunded'

            edit-courier => value: courier_id (or null to unassign)
            |=> assigned_courier_id = null => add state courier_assigned + fill assigned_courier_id + snapshot_assigned_courier_name + snapshot_assigned_courier_phone_number
            |=> assigned_courier_id != null => add state courier_unassigned + fill ...

            change-paid => value: none |=> add state payment_completed, change is_paid to true

            cancelled => value: reason (string) |=> add state cancelled with event_reason

            ALLOWED ACTION RETURN:
            "allowAddPreparingEvent": true,
            "allowAddDeliveringEvent": false,
            "allowAddReadyToPickupEvent": false,
            "allowAddCompletedEvent": false,
            "allowAddCancelledEvent": true,
            "allowAddRefundEvent": false,
            "allowSetIsPaid": true,
            "allowAssignCourier": true,
            "allowUnassignCourier": false
         */
        try {
            const curr_store = await getCurrentStore(req);
            const storeId = curr_store?.data.store?.id;
            const orderId = req?.params?.id;

            const update_type = req?.body?.update_type;
            const update_value = req?.body?.update_value;

            if (!storeId || !orderId || !update_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing values'
                });
            }

            const allow_to_edit = await StoreOrderService.checkSameInformation(orderId, {
                store_id: parseInt(storeId),
                order_id: parseInt(orderId),
            });

            if (!allow_to_edit) {
                return res.status(400).json({
                    success: false,
                    message: 'Access denied due to mismatched information'
                });
            }

            let response;

            if (update_type === 'add-state') {
                if (!update_value) {
                    return res.status(400).json({
                        success: false,
                        message: 'Missing update value for add-state'
                    });
                }
                response = await StoreOrderService.updateOrderEventStatus(
                    orderId,
                    curr_store.data.staffInfo.group.name,
                    update_value,
                    curr_store.data.staffInfo
                );
            }
            else if (update_type === 'edit-courier') {
                response = await StoreOrderService.updateOrderEventDelivery(
                    orderId,
                    {
                        ...curr_store.data.staffInfo,
                        group: curr_store.data.staffInfo.group
                    },
                    update_value || null
                );
            }
            else if (update_type === 'change-paid') {
                response = await StoreOrderService.updateOrderEventIsPaid(
                    orderId,
                    curr_store.data.staffInfo,
                    curr_store.data.staffInfo.group.name
                );
            }
            else if (update_type === 'cancelled') {
                response = await StoreOrderService.updateOrderEventCancelled(
                    orderId,
                    curr_store.data.staffInfo,
                    curr_store.data.staffInfo.group.name,
                    update_value || ''
                );
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid update type'
                });
            }

            if (!response.success) {
                return res.status(response.status).json({
                    success: false,
                    message: response.message
                });
            }
            
            completionCheck = await StoreOrderService.checkAndUpdateOrderCompletion(orderId);

            return res.status(response.status).json({
                success: true,
                data: response.data,
                completion_updated: completionCheck.wasUpdated || false
            });

        }
        catch (error) {
            console.error('Error in updateOrder:', error);
            return res.status(500).json({
                success: false,
                message: 'Unexpected Error'
            });
        }
    },
    getCourierList: async (req, res) => {
        try {
            const curr_store = await getCurrentStore(req);
            const storeId = curr_store?.data.store?.id;

            if (!storeId) {
                return res.status(404).json({
                    success: false,
                    message: 'Store not found'
                });
            }

            const couriers = await StoreOrderService.getCourierList(storeId);

            if (!couriers || couriers.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No couriers found'
                });
            }

            return res.status(200).json({
                success: true,
                data: couriers
            });
        } catch (error) {
            console.error('Error in getCourierList:', error);
            return res.status(500).json({
                success: false,
                message: 'Unexpected Error'
            });
        }
    }
}

module.exports = storeOrderController;