const getEventInfo = (events, pickUp) => {
    const mainStatusList = pickUp
        ? ["new", "preparing", "ready_to_pickup", "completed"]
        : ["new", "preparing", "delivering", "completed"];
    const sortedEvents = [...events].sort(
        (a, b) => new Date(b.event_timestamp) - new Date(a.event_timestamp)
    );
    let currentMainStatus =
        sortedEvents.find((event) => mainStatusList.includes(event.event_type))
            ?.event_type || "unknown";

    const isCancelled = events.some(
        (event) => event.event_type === "cancelled"
    );

    const isHaveCompletedEvent = events.some((event) => event.event_type === "completed");
    const isHaveRefundedEvent = events.some((event) => event.event_type === "refunded");
    const isHavePaidEvent = events.some((event) => event.event_type === "payment_completed");
    const isCompleted = (
        isHaveCompletedEvent ||
        (isCancelled && (isHaveRefundedEvent || isHavePaidEvent)) ||
        (isCancelled && !isHavePaidEvent)
    );

    if (isCompleted) {
        currentMainStatus = "completed";
    }

    if (isCancelled && isCompleted) {
        currentMainStatus = "cancelled";
    }

    return { currentMainStatus, mainStatusList, isCancelled, isCompleted };
};

const eventMessage = (event_type) => {
    //'new', 'courier_assigned', 'preparing', 'delivering', 'ready_to_pickup', 'completed', 'cancelled', 'payment_completed', 'courier_unassigned'
    switch (event_type) {
        case "new":
            return "New order created";
        case "courier_assigned":
            return "Courier has been assigned to your order";
        case "preparing":
            return "Your order is being prepared";
        case "delivering":
            return "Your order is on the way";
        case "ready_to_pickup":
            return "Your order is ready for pickup";
        case "completed":
            return "Your order has been completed";
        case "cancelled":
            return "Your order has been cancelled";
        case "payment_completed":
            return "Payment for your order has been completed";
        case "courier_unassigned":
            return "Courier has been unassigned from your order";
        default:
            return "Unknown event type";
    }
};

const getAllowedOrderActivity = (eventList, is_paid, is_completed, order_type, payment_option, user_group) => {
    // all event type: 'new', 'courier_assigned', 'preparing', 'delivering', 'ready_to_pickup', 'completed', 'cancelled', 'payment_completed', 'courier_unassigned', 'refunded'

    /**
     * orderEvent example = [
            {
                "event_id": 2,
                "order_id": 2,
                "event_type": "new",
                "triggered_by_user_id": 1,
                "snapshot_triggered_by_name": "customer@mail.com",
                "event_reason": null,
                "event_notes": null,
                "event_metadata": {
                    "is_pickup": true,
                    "order_code": "M7EFIE",
                    "payment_option": "qr"
                },
                "event_timestamp": "2025-07-20 15:39:23"
            },
            {
                "event_id": 3,
                "order_id": 2,
                "event_type": "preparing",
                "triggered_by_user_id": 1,
                "snapshot_triggered_by_name": "customer@mail.com",
                "event_reason": "nothing",
                "event_notes": "notes",
                "event_metadata": {},
                "event_timestamp": "2025-07-20 15:41:23"
            }
        ]
     */

    // user_group: sale_agent, courier
    // is_paid: true / false
    // is_completed: true / false
    // order_type: 'delivery' / 'pickup'
    // payment_option: 'cash' / 'qr'

    // sale_agent only can update paid before delivering state in delivery order, before completed in pickup order
    // for pickup order, courier have no activity
    // for delivery order, courier can update to delivering state after preparing state, and can update paid only when order is cash payment
    // FOR QR PAYMENT DELIVERY ORDERS: courier can only change to delivering state AFTER payment is confirmed by sale agent
    // assigncourier can only be done by sale_agent in any state before completed, because courier can face issues and need to be unassigned
    // completed can only be done by sale_agent in delivery order, and by courier in pickup order, completed allow when current main status is ready_to_pickup or delivering
    // cancel only used for sale_agent and can be done in any state before completed
    // completed here means the event type 'completed', some case still completed without 'completed' event type, like when order is cancelled and refunded, or when order is paid and completed without courier assigned.

    const allowedActivity = {
        allowAddPreparingEvent: false,
        allowAddDeliveringEvent: false,
        allowAddReadyToPickupEvent: false,
        allowAddCompletedEvent: false,
        allowAddCancelledEvent: false,
        allowAddRefundEvent: false,
        allowSetIsPaid: false,
        allowAssignCourier: false,
        allowUnassignCourier: false,
    };

    const isPickup = order_type === 'pickup';
    const { currentMainStatus, isCancelled } = getEventInfo(eventList, isPickup);

    const isCourierAssigned = eventList.some(event => event.event_type === 'courier_assigned') &&
        !eventList.some(event => event.event_type === 'courier_unassigned');

    if (is_completed || isCancelled) {
        if (isCancelled && is_paid && !eventList.some(event => event.event_type === 'refunded') && user_group === 'sale_agent') {
            allowedActivity.allowAddRefundEvent = true;
        }
        return allowedActivity;
    }

    if (user_group === 'sale_agent') {
        if (currentMainStatus === 'new') {
            allowedActivity.allowAddPreparingEvent = true;
        }

        if (!is_completed && currentMainStatus !== 'delivering') {
            allowedActivity.allowAddCancelledEvent = true;
        }

        if (!isPickup && !is_completed) {
            allowedActivity.allowAssignCourier = !isCourierAssigned;
            allowedActivity.allowUnassignCourier = isCourierAssigned;
        }

        if (!is_paid) {
            if (isPickup) {
                if (payment_option === 'cash' && currentMainStatus === 'ready_to_pickup') {
                    allowedActivity.allowSetIsPaid = true;
                } else if (payment_option === 'qr' && currentMainStatus !== 'completed') {
                    allowedActivity.allowSetIsPaid = true;
                }
            } else if (!isPickup && payment_option === 'qr' && currentMainStatus !== 'delivering' && currentMainStatus !== 'completed') {
                allowedActivity.allowSetIsPaid = true;
            }
        }

        if (isPickup && currentMainStatus === 'preparing') {
            allowedActivity.allowAddReadyToPickupEvent = true;
        }

        if (isPickup && currentMainStatus === 'ready_to_pickup' && is_paid) {
            allowedActivity.allowAddCompletedEvent = true;
        }

        if (!isPickup && currentMainStatus === 'ready_to_pickup' && is_paid) {
            allowedActivity.allowAddCompletedEvent = true;
        }
    }

    if (user_group === 'courier') {

        if (!isPickup) {
            if (currentMainStatus === 'preparing' && isCourierAssigned) {
                if (payment_option === 'qr' && is_paid) {
                    allowedActivity.allowAddDeliveringEvent = true;
                } else if (payment_option === 'cash') {
                    allowedActivity.allowAddDeliveringEvent = true;
                }
            }

            if (!is_paid && payment_option === 'cash' &&
                (currentMainStatus === 'delivering' || currentMainStatus === 'ready_to_pickup')) {
                allowedActivity.allowSetIsPaid = true;
            }

            if ((currentMainStatus === 'delivering' || currentMainStatus === 'ready_to_pickup') &&
                is_paid && isCourierAssigned) {
                allowedActivity.allowAddCompletedEvent = true;
            }
        }
    }

    return allowedActivity;
}

export const orderOfflineService = {
    getEventInfo,
    eventMessage,
    getAllowedOrderActivity,
};