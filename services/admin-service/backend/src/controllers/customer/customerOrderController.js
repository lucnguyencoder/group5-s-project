//done
const { getOrderById } = require("../../services/common/commonOrderService");
const customerOrderService = require("../../services/customer/customerOrderService");

const customerOrderController = {
    createOrder: async (req, res) => {
        try {
            const userId = req.user.id;
            const body = req.body;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }
            const result = await customerOrderService.createOrder(body, userId);

            if (!result.success) {
                return result
            }

            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },
    getAllOrders: async (req, res) => {
        try {
            const userId = req.user.id;
            const filter = req.query || {};
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }
            // console.log(userId, filter, status);

            const orders = await customerOrderService.getAllOrders(userId, filter);

            // console.log('Orders fetched:', orders);

            if (!orders || orders.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found'
                });
            }

            return res.status(200).json({
                success: true,
                data: orders
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    },
    getOrderById: async (req, res) => {
        try {
            const userId = req.user.id;
            const orderId = req.params.id;
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
            }
            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: 'Order ID is required'
                });
            }

            const order = await getOrderById(orderId);

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (order.customer_id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to view this order'
                });
            }

            return res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Server error processing request'
            });
        }
    }
}

module.exports = customerOrderController;