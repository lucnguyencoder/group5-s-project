const { Food, Store, StoreSettings, Discount, UserDiscountUsage } = require("../../models");
const CustomizationGroup = require("../../models/customizationGroup");
const CustomizationOption = require("../../models/customizationOption");
const { calculateDistance, calculateShippingFee } = require("./locationService");

const getItem = async (data) => {
    let res = {}
    let price = 0;
    const food = await Food.findByPk(data.foodId);
    if (!food) {
        return {
            success: false,
            status: 404,
            message: 'Food item not found'
        };
    }
    if (!food) {
        return {
            success: false,
            status: 404,
            message: 'Food item not found'
        };
    }

    res.food = food;
    const customizationGroups = await CustomizationGroup.findAll({
        where: { food_id: data.foodId }
    });

    const customizationOptions = await CustomizationOption.findAll({
        where: {
            group_id: customizationGroups.map(group => group.group_id),
            option_id: data.selectedOptions
        }
    });

    res.customizationGroups = customizationGroups;
    res.customizationOptions = customizationOptions;
    res.quantity = data.quantity || 1;

    if (customizationOptions.length > 0) {
        customizationOptions.forEach(option => {
            price += parseFloat(option.additional_price) || 0;
        });
    }
    if (!data?.quantity || data?.quantity === undefined || data?.quantity === null || data?.quantity <= 0 || isNaN(data?.quantity) || data?.quantity === '' || data?.quantity === '0' || data?.quantity === 'NaN' || typeof data?.quantity !== 'number') {
        data.quantity = 0;
        console.log('Invalid quantity, setting to 0');
    }

    res.price = (parseFloat(food.base_price) + price) * data?.quantity;
    if (food.is_on_sale) {
        res.salePrice = (parseFloat(food.sale_price) + price) * data?.quantity;
    } else {
        res.salePrice = res.price;
    }
    return res;
};

const calculateOrderPricing = async (dataList) => {
    if (!dataList.storeId || !dataList.cartItems || !dataList.location) {
        return {
            success: false,
            status: 400,
            message: 'Missing data, please provide follow requirement.'
        };
    }
    let res = {
        store: null,
        items: [],
        basePrice: 0,
        salePrice: 0,
        finalPrice: 0,
        courier: {
            distance: null,
            fee: 0
        },
        discount: {
            enabled: dataList.discountCode ? true : false,
            data: null,
            accepted: dataList.discountCode ? true : false,
            discountedPrice: 0,
            applyTo: null,
            decline_reason: null
        },
        pickup: dataList.pickup || false,
        accept: true,
        decline_reason: null,
        storeSettings: null
    };

    const cItems = dataList.cartItems || [];
    for (const item of cItems) {
        const itemData = await getItem(item);
        res.items.push(itemData);
        res.salePrice = (res.salePrice || 0) + itemData.salePrice || 0;
        res.basePrice = (res.basePrice || 0) + itemData.price || 0;
    }

    const store = await Store.findByPk(parseInt(dataList.storeId));

    if (!store) {
        return {
            success: false,
            status: 404,
            message: 'Store not found'
        };
    } else {
        res.store = store;
    }


    let storeSettings = await StoreSettings.findOne({
        where: { store_id: dataList.storeId }
    });

    res.storeSettings = storeSettings;
    if (!storeSettings) {
        storeSettings = {
            allow_pick_up: true,
            shipping_per_km_fee: 10000,
            minimum_shipping_fee: 20000,
            shipping_distance_limit: 10,
            shipping_distance_to_calculate_fee: 3,
            minimum_order_price: 0
        }
    }


    if (
        !storeSettings.allow_pick_up &&
        (!storeSettings.bank || storeSettings.bank.trim() === '') &&
        (!storeSettings.bank_number || storeSettings.bank_number.trim() === '')
    ) {
        res.accept = false;
        res.decline_reason = 'Store is preparing to accept orders, please try again later.';
    }



    if (!storeSettings.allow_pick_up && (!storeSettings.bank || storeSettings.bank.trim() === "") && (!storeSettings.bank_number || storeSettings.bank_number.trim() === "")) {
        res.accept = false;
        res.decline_reason = 'Store are preparing to accept orders, please try again later.';
    }

    if (res.salePrice < storeSettings?.minimum_order_price) {
        res.accept = false;
        res.decline_reason = 'Minimum order price not met';
        console.log('Minimum order price not met:', storeSettings?.minimum_order_price);
    }

    if (dataList.pickup) {
        if (storeSettings.allow_pick_up) {
            res.courier.distance = 0;
            res.courier.fee = 0;
            // Keep res.accept as true if minimum order is met
            // console.log('Pickup accepted:', res);
        }
        else {
            res.accept = false;
            res.decline_reason = 'Store does not allow pickup';
            // console.log('Store does not allow pickup:', storeSettings.allow_pick_up);
        }

    } else {

        if (!dataList.location || !dataList.location.latitude || !dataList.location.longitude) {
            res.accept = false;
            res.decline_reason = 'Please provide your detail position for calculating delivery fee.';
        }
        else if (!res.store.latitude || !res.store.longitude) {
            res.accept = false;
            res.decline_reason = 'Store location is not available for delivery';
        }

        else {
            console.log('Calculating distance for delivery...', dataList.location.latitude, dataList.location.longitude);
            const distance = calculateDistance(
                dataList.location.latitude,
                dataList.location.longitude,
                res.store.latitude,
                res.store.longitude
            );
            res.courier.distance = distance;

            const cost = calculateShippingFee(
                distance,
                storeSettings
            );
            if (cost > 0) {
                res.courier.fee = cost;
            }

            if (storeSettings.shipping_distance_limit < distance / 1000) {
                res.accept = false;
                res.decline_reason = `Your location is out of delivery range (${storeSettings.shipping_distance_limit} km)`;
            }
        }
    }

    if (dataList.discountCode) {
        const discount = await Discount.findOne({ where: { code: dataList.discountCode } });
        if (discount) {
            res.discount.data = discount;
        }
        else {
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = 'Please check your discount';
            res.discount.decline_reason = "Discount code not found";
        }

        if (discount && discount.discount_sale_type === 'delivery' && dataList.pickup) {
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = 'Please check your discount';
            res.discount.decline_reason = 'Delivery discount cannot be applied to pickup orders';
            console.log('Delivery discount cannot be applied to pickup orders');
        }

        const currentDate = new Date();
        const validFrom = new Date(discount.valid_from);
        const validTo = new Date(discount.valid_to);

        if (discount.store_id && parseInt(discount.store_id) !== parseInt(dataList.storeId)) {
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = 'Please check your discount';
            res.discount.decline_reason = 'Discount code is not valid for this store';
            console.log('Discount code is not valid for this store:', discount.store_id, dataList.storeId);
        }

        if (discount.discount_sale_type === 'delivery' && dataList.pickup) {
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = 'Please check your discount';
            res.discount.decline_reason = 'Delivery discount cannot be applied to pickup orders';
        }

        if (currentDate < validFrom || currentDate > validTo) {
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = "Please check your discount";
            res.discount.decline_reason = 'Discount code is not valid at this time';
            console.log('Discount code is not valid at this time:', currentDate, validFrom, validTo);
        }

        if (!discount.is_active) {
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = 'Please check your discount';
            res.discount.decline_reason = 'Discount is not available or not active';
            console.log('Discount is not available or not active:', discount.is_active);
        }

        if (discount.is_price_condition && res.salePrice < discount.min_price_condition) {
            res.discount.enabled = false;
            res.discount.accepted = false;
            res.discount.discountedPrice = 0;
            res.accept = false;
            res.decline_reason = 'Please check your discount';
            res.discount.decline_reason = 'Your order is not enough to apply this discount.' + (discount.min_price_condition - res.salePrice) + 'đ more to apply this discount.';
            console.log('Your order is not enough to apply this discount:', discount.min_price_condition, res.salePrice);
        }

        if (discount.max_discount_amount) {
            const number_of_time_used = await UserDiscountUsage.count(
                {
                    where: {
                        discount_id: discount.discount_id
                    }
                }
            )
            if (discount.usage_limit && number_of_time_used >= discount.usage_limit) {
                res.discount.accepted = false;
                res.discount.discountedPrice = 0;
                res.accept = false;
                res.decline_reason = 'Please check your discount';
                res.discount.decline_reason = 'Discount code has reached its usage limit';
                console.log('Discount code has reached its usage limit:', number_of_time_used, discount.discount_id);
            }
        }

        if (discount.is_limit_usage_per_user && dataList.userId) {

            const number_of_time_user_used = await UserDiscountUsage.count({
                where: {
                    discount_id: discount.discount_id,
                    user_id: dataList.userId
                }
            });

            if (number_of_time_user_used >= discount.allow_usage_per_user) {
                res.discount.accepted = false;
                res.discount.discountedPrice = 0;
                res.accept = false;
                res.decline_reason = 'Please check your discount';
                res.discount.decline_reason = 'You have reached the limit of usage for this discount code';
                console.log('You have reached the limit: ', number_of_time_user_used, discount.discount_id, dataList.userId);
            }

        } else {
            console.log("Skip >>>>>>>>>>>");
        }

        if (discount.discount_type === 'percentage') {
            let baseAmount = 0;
            if (discount.discount_sale_type === 'items') {
                baseAmount = res.salePrice;
            } else {
                console.log("delivery + ", res.courier.fee);
                baseAmount = res.courier.fee;
            }

            const down = Math.ceil((baseAmount * discount.discount_value) / 100);
            let fsdown = 0;
            if (down < discount.max_discount_amount) {
                fsdown = down;
            } else {
                fsdown = discount.max_discount_amount;
            }
            console.log("Down", down);
            res.discount.discountedPrice = fsdown;
            console.log('Discount type is percentage, discounted price:', res.discount.discountedPrice);
        } else if (discount.discount_type === 'fixed_amount') {
            res.discount.discountedPrice = discount.discount_value;
            console.log('Discount type is fixed_amount, discounted price:', res.discount.discountedPrice);
        }
        res.discount.applyTo = discount.discount_sale_type;
        console.log('Discount apply to:', res.discount.applyTo);
        if (res.discount.accepted) {
            if (res.discount.applyTo === "items") {
                res.finalPrice = (res.salePrice - res.discount.discountedPrice) + res.courier.fee;
                if (res.finalPrice < 0) {
                    res.finalPrice = 0;
                }
            } else if (res.discount.applyTo === "delivery") {
                if (res.courier.fee < res.discount.discountedPrice) {
                    res.finalPrice = res.salePrice;
                    console.log("delivery", res.courier.fee, "= ", res.discount.discountedPrice);
                    res.discount.discountedPrice = res.courier.fee;
                } else {
                    console.log("delivery + ", res.courier.fee, " - ", res.discount.discountedPrice);
                    res.finalPrice = res.salePrice + res.courier.fee - res.discount.discountedPrice;
                }
            } else {
                res.finalPrice = res.salePrice + res.courier.fee;
            }
            console.log('Discount accepted, final price:', res.finalPrice);
        } else {
            res.finalPrice = res.salePrice + res.courier.fee;
            res.discount.accepted = false;
            console.log('Discount not accepted, final price:', res.finalPrice);
        }
    } else {
        res.finalPrice = res.salePrice + res.courier.fee;
    }

    if (store.opening_time && store.closing_time && dataList.currentTime) {
        const [currentHour, currentMinute, currentSecond] = dataList.currentTime.split(':').map(Number);
        const currentTotalSeconds = currentHour * 3600 + currentMinute * 60 + currentSecond;

        const [openHour, openMinute, openSecond] = store.opening_time.split(':').map(Number);
        const [closeHour, closeMinute, closeSecond] = store.closing_time.split(':').map(Number);

        const openTotalSeconds = openHour * 3600 + openMinute * 60 + openSecond;
        const closeTotalSeconds = closeHour * 3600 + closeMinute * 60 + closeSecond;

        if (currentTotalSeconds < openTotalSeconds || currentTotalSeconds > closeTotalSeconds) {
            res.accept = false;
            res.decline_reason = `Store is currently closed.`;
        }

    }

    if (store?.is_temp_closed) {
        res.accept = false;
        res.decline_reason = 'Store is temporarily closed, please come back later.';
    }

    if (!store?.isActive) {
        res.accept = false;
        res.decline_reason = 'Store is currently disabled by Yami, please contact us for more information.';
    }

    /**
     * {
            "store_id": 1,
            "allow_pick_up": false,
            "shipping_per_km_fee": 10000,
            "minimum_shipping_fee": 20000,
            "shipping_distance_limit": 10,
            "shipping_distance_to_calculate_fee": 3,
            "minimum_order_price": 10000000,
        }
     */

    return res;
}

module.exports = {
    calculateOrderPricing
}