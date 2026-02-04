import SetTitle from "@/components/common/SetTitle"
import { OrderHistory } from "@/components/order/OrderHistory"

export const YourOrderPage = () => {
    return (
        <div className="container mx-auto p-4">
            <SetTitle title="Your Orders" />
            <h1 className="text-2xl font-bold px-4">My Orders</h1>
            <OrderHistory />
        </div>
    )
}