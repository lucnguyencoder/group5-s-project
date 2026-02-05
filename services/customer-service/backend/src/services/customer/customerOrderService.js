//done
const { User, OrderItem, UserDiscountUsage, Order, OrderEvent, sequelize } = require('../../models');
const { calculateOrderPricing } = require('../common/pricingCalculationService');
const commonOrderService = require('../common/commonOrderService');

const customerOrderService = {
    createOrder: async (orderDataList, userId) => {
        // Initialize transaction
        const transaction = await sequelize.transaction();
        orderDataList.userId = userId;
        // console.log("orderDataList: ", orderDataList);
        let res = {}

        try {
            let receipt_data = await calculateOrderPricing(orderDataList);
            // console.log("receipt data: ", receipt_data);

            let user_special_instruction = orderDataList.customInstruction || "";
            let paymentOption = orderDataList.paymentOption || "cash";

            /**
             * sample response structure:
             * {
    "success": true,
    "status": 200,
    "data": {
        "store": {
            "id": 1,
            "name": "Gordon Ramsay Restaurant",
            "description": "",
            "avatar_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEYdCw4UTaX_otBCctPusJYHee4Vf7z-cd4Q&s",
            "cover_image_url": "https://media.timeout.com/images/105854659/image.jpg",
            "address": "Son Tay",
            "latitude": "21.01390380",
            "longitude": "105.51939530",
            "phone": "0334333444",
            "email": "tch@tami.com",
            "opening_time": "09:00:00",
            "closing_time": "22:00:00",
            "status": "active",
            "isActive": true,
            "isTempClosed": false,
            "rating": "3.20",
            "total_reviews": 100,
            "created_at": "2025-06-27 01:16:08",
            "updated_at": "2025-07-14 23:39:58"
        },
        "items": [
            {
                "food": {
                    "food_id": 12,
                    "store_id": 1,
                    "category_id": 1,
                    "food_name": "Golden Beef Steak",
                    "description": "Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold Beef Steak Gold ",
                    "base_price": "15000000.00",
                    "is_on_sale": true,
                    "sale_price": "14000000.00",
                    "image_url": "https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/food-images/store-1/c0e2593a209036fd92e7091bcf6d0e0e.jpg",
                    "is_available": true,
                    "preparation_time": 30,
                    "max_allowed_quantity": 10,
                    "created_at": "2025-07-02 11:40:08",
                    "updated_at": "2025-07-02 11:42:28"
                },
                "customizationGroups": [
                    {
                        "group_id": 9,
                        "food_id": 12,
                        "group_name": "Gold",
                        "description": "",
                        "is_required": true,
                        "min_selections": 1,
                        "max_selections": 1,
                        "sort_order": 1,
                        "created_at": "2025-07-02 11:42:28"
                    }
                ],
                "customizationOptions": [
                    {
                        "option_id": 24,
                        "group_id": 9,
                        "option_name": "1 plate",
                        "description": "",
                        "additional_price": "0.00",
                        "is_default": false,
                        "sort_order": 1,
                        "created_at": "2025-07-02 11:42:28"
                    }
                ],
                "quantity": 10,
                "price": 150000000,
                "salePrice": 140000000
            },
            {
                "food": {
                    "food_id": 11,
                    "store_id": 1,
                    "category_id": 1,
                    "food_name": "Lemon Tea",
                    "description": "trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh trà chanh ",
                    "base_price": "100000.00",
                    "is_on_sale": false,
                    "sale_price": null,
                    "image_url": "https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/food-images/store-1/9728e3a9631713d9677480af2a054bb8.jpg",
                    "is_available": true,
                    "preparation_time": 5,
                    "max_allowed_quantity": 1000,
                    "created_at": "2025-07-02 09:48:08",
                    "updated_at": "2025-07-02 09:48:08"
                },
                "customizationGroups": [
                    {
                        "group_id": 5,
                        "food_id": 11,
                        "group_name": "Đá",
                        "description": "",
                        "is_required": true,
                        "min_selections": 1,
                        "max_selections": 1,
                        "sort_order": 1,
                        "created_at": "2025-07-02 09:48:08"
                    }
                ],
                "customizationOptions": [
                    {
                        "option_id": 17,
                        "group_id": 5,
                        "option_name": "Nhiều",
                        "description": "",
                        "additional_price": "100000.00",
                        "is_default": false,
                        "sort_order": 3,
                        "created_at": "2025-07-02 09:48:08"
                    }
                ],
                "quantity": 28,
                "price": 2900000,
                "salePrice": 2900000
            },
            {
                "food": {
                    "food_id": 10,
                    "store_id": 1,
                    "category_id": 1,
                    "food_name": "Fork Noodles",
                    "description": "bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế bún bò huế ",
                    "base_price": "450000.00",
                    "is_on_sale": false,
                    "sale_price": null,
                    "image_url": "https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/food-images/store-1/5b181b32c645835ea3b7f4c77415babd.jpg",
                    "is_available": true,
                    "preparation_time": 10,
                    "max_allowed_quantity": 10,
                    "created_at": "2025-07-02 09:47:04",
                    "updated_at": "2025-07-02 09:47:04"
                },
                "customizationGroups": [],
                "customizationOptions": [],
                "quantity": 10,
                "price": 4600000,
                "salePrice": 4600000
            },
            {
                "food": {
                    "food_id": 9,
                    "store_id": 1,
                    "category_id": 1,
                    "food_name": "Meat Noodles",
                    "description": "About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha About bun cha ",
                    "base_price": "400000.00",
                    "is_on_sale": true,
                    "sale_price": "375000.00",
                    "image_url": "https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/food-images/store-1/fe5be311712c11a4b6d420b1c2e401d8.jpg",
                    "is_available": true,
                    "preparation_time": 10,
                    "max_allowed_quantity": 50,
                    "created_at": "2025-07-02 09:46:07",
                    "updated_at": "2025-07-02 09:46:07"
                },
                "customizationGroups": [
                    {
                        "group_id": 4,
                        "food_id": 9,
                        "group_name": "Cay",
                        "description": "",
                        "is_required": false,
                        "min_selections": 1,
                        "max_selections": 1,
                        "sort_order": 1,
                        "created_at": "2025-07-02 09:46:07"
                    }
                ],
                "customizationOptions": [
                    {
                        "option_id": 14,
                        "group_id": 4,
                        "option_name": "Không",
                        "description": "",
                        "additional_price": "0.00",
                        "is_default": true,
                        "sort_order": 2,
                        "created_at": "2025-07-02 09:46:07"
                    }
                ],
                "quantity": 3,
                "price": 1300000,
                "salePrice": 1225000
            }
        ],
        "basePrice": 158800000,
        "salePrice": 148725000,
        "finalPrice": 148760000,
        "courier": {
            "distance": 3713,
            "fee": 35000
        },
        "discount": {
            "enabled": false,
            "data": null,
            "accepted": false,
            "discountedPrice": 0,
            "applyTo": null,
            "decline_reason": null
        },
        "pickup": false,
        "accept": true,
        "decline_reason": null,
        "storeSettings": {
            "store_id": 1,
            "allow_pick_up": true,
            "shipping_per_km_fee": 10000,
            "minimum_shipping_fee": 5000,
            "shipping_distance_limit": 5,
            "shipping_distance_to_calculate_fee": 1,
            "minimum_order_price": 1000000,
            "bank": "Techcombank",
            "bank_number": "19037648903016",
            "created_at": "2025-07-14 15:25:11",
            "updated_at": "2025-07-14 15:25:11"
        }
    }
}
             */
            /**order db:
             * int order_id PK
                    string order_code UK 
                    int customer_id FK
                    int store_id FK
                    enum order_type "pickup, delivery"
                    enum payment_option "cash, qr"
                    decimal base_price_subtotal
                    decimal sale_price_subtotal
                    decimal promote_discount_price
                    decimal delivery_fee
                    decimal final_price
                    boolean is_completed
                    string snapshot_delivery_address_line
                    string snapshot_recipient_name
                    string snapshot_recipient_phone
                    string snapshot_recipient_latitude
                    string snapshot_recipient_longitude
                    string customer_special_instruction
                    boolean is_paid
                    datetime payment_completed_at
                    int assigned_courier_id FK "nullable"
                    string snapshot_assigned_courier_name 
                    string snapshot_assigned_courier_phone
                    datetime created_at
                    datetime updated_at
             */

            const generateOrderCode = () => {
                // unique 6 letters and numbers ONLY
                const randomPart = Math.random().toString(36).substring(2, 8);
                // uppercase all
                return `${randomPart.toUpperCase()}`;
            }


            let orderInsertionData = {
                order_code: generateOrderCode(),
                customer_id: userId,
                store_id: receipt_data.store.id,
                order_type: receipt_data.pickup ? 'pickup' : 'delivery',
                payment_option: paymentOption,
                base_price_subtotal: receipt_data.basePrice,
                sale_price_subtotal: receipt_data.salePrice,
                promote_discount_price: receipt_data.discount && receipt_data.discount.enabled && receipt_data.discount.accepted ? receipt_data.discount.discountedPrice : 0,
                delivery_fee: receipt_data.courier.fee || 0,
                final_price: receipt_data.finalPrice,
                is_completed: false,
                snapshot_delivery_address_line: orderDataList.location.address_line || null,
                snapshot_recipient_name: orderDataList.location.recipient_name || null,
                snapshot_recipient_phone: orderDataList.location.recipient_phone || null,
                snapshot_recipient_latitude: orderDataList.location.latitude || null,
                snapshot_recipient_longitude: orderDataList.location.longitude || null,
                customer_special_instruction: user_special_instruction,
                is_paid: false,
            }

            /**
             * OrderEvent {
        int event_id PK
        int order_id FK
        enum event_type "new, courier_assigned, preparing, delivering, ready_to_pickup, completed, cancelled, payment_completed, courier_unassigned"
        int triggered_by_user_id FK "nullable"
        string snapshot_triggered_by_name 
        string event_reason "cancellation reason, failure reason, etc"
        string event_notes "additional details"
        json event_metadata "flexible data for different event types"
        datetime event_timestamp
    }
             */

            const userData = await User.findByPk(userId, {
                attributes: ['id', 'email'],
                transaction
            });

            const newOrder = await Order.create(orderInsertionData, { transaction });

            const orderInitEventData = {
                order_id: newOrder.order_id,
                event_type: 'new',
                triggered_by_user_id: userId,
                snapshot_triggered_by_name: userData.email || null,
                event_reason: null,
                event_notes: null,
                event_metadata: {
                    order_code: newOrder.order_code,
                    payment_option: paymentOption,
                    is_pickup: receipt_data.pickup
                },
                event_timestamp: new Date()
            }

            const orderEventInit = await OrderEvent.create(orderInitEventData, { transaction });

            const orderItemPromises = [];

            if (receipt_data.items && receipt_data.items.length > 0) {
                for (const item of receipt_data.items) {
                    /**
                     * OrderItem {
                        int item_id PK
                        int order_id FK
                        int food_id FK
                        int quantity
                        decimal base_price
                        decimal sale_price
                        string customization
                        string snapshot_food_image
                        string snapshot_food_name
                        datetime created_at
                    }
                     */

                    let customizationList = [];

                    if (item.customizationOptions && item.customizationOptions.length > 0) {
                        item.customizationOptions.forEach(option => {
                            customizationList.push(option.option_name);
                        });
                    }

                    const orderItemData = {
                        order_id: newOrder.order_id,
                        food_id: item.food.food_id,
                        quantity: item.quantity,
                        base_price: item.price,
                        sale_price: item.salePrice,
                        customization: customizationList.join(', ') || null,
                        snapshot_food_image: item.food.image_url || null,
                        snapshot_food_name: item.food.food_name || null,
                        created_at: new Date()
                    }

                    const orderItemPromise = OrderItem.create(orderItemData, { transaction });
                    orderItemPromises.push(orderItemPromise);
                }
            }

            const orderItems = await Promise.all(orderItemPromises);

            let discountUsageData = null;

            if (receipt_data.discount && receipt_data.discount.enabled && receipt_data.discount.accepted) {
                const userDiscountUsageData = {
                    user_id: userId,
                    discount_id: receipt_data.discount.data.discount_id,
                    order_id: newOrder.order_id,
                    snapshot_discount_code: receipt_data.discount.data.code,
                    snapshot_discount_name: receipt_data.discount.data.discount_name,
                    snapshot_discount_type: receipt_data.discount.data.discount_type,
                    snapshot_discount_sale_type: receipt_data.discount.data.discount_sale_type,
                    snapshot_discount_value: receipt_data.discount.data.discount_value,
                    snapshot_discount_amount: receipt_data.discount.data.max_discount_amount,
                    real_discount_amount: receipt_data.discount.discountedPrice,
                    used_at: new Date()
                }

                discountUsageData = await UserDiscountUsage.create(userDiscountUsageData, { transaction });
            }

            const resultData = {
                order: newOrder,
                orderEvent: orderEventInit,
                orderItems: orderItems,
                discount: discountUsageData
            }

            /**
             * OrderEvent {
        int event_id PK
        int order_id FK
        enum event_type "new, courier_assigned, preparing, delivering, ready_to_pickup, completed, cancelled, payment_completed, courier_unassigned"
        int triggered_by_user_id FK "nullable"
        string snapshot_triggered_by_name 
        string event_reason "cancellation reason, failure reason, etc"
        string event_notes "additional details"
        json event_metadata "flexible data for different event types"
        datetime event_timestamp
    }
    OrderItem {
        int item_id PK
        int order_id FK
        int food_id FK
        int quantity
        decimal base_price
        decimal sale_price
        string customization
        string snapshot_food_image
        string snapshot_food_name
        datetime created_at
    }
    UserDiscountUsage {
        int usage_id PK
        int user_id FK
        int discount_id FK
        int order_id FK
        string snapshot_discount_code
        string snapshot_discount_name
        string snapshot_discount_type
        string snapshot_discount_sale_type
        string snapshot_discount_value
        string snapshot_discount_amount
        decimal real_discount_amount
        datetime used_at
    }
             */

            await transaction.commit();

            return {
                success: true,
                status: 200,
                data: resultData
            }
        } catch (error) {
            await transaction.rollback();

            console.log(error);
            return {
                success: false,
                status: 500,
                message: 'Server Error: ' + error.message
            };
        }
    },
    getAllOrders: async (userId, filter) => {
        try {
            // console.log("userId: ", userId);
            const result = await commonOrderService.getAllOrders({ ...filter, customer_id: userId });
            // console.log("result: ", result);
            return {
                success: true,
                status: 200,
                data: result
            };
        }
        catch (error) {
            return {
                success: false,
                status: 500,
                message: 'Server error processing request'
            };
        }
    }
}
module.exports = customerOrderService;