
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
        case "refunded":
            return "Your order has been refunded";
        default:
            return "Unknown event type";
    }
};


export const orderOfflineService = {
    getEventInfo,
    eventMessage,
};