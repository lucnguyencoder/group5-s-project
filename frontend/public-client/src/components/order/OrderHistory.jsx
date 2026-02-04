import { getOrdersList } from "@/services/orderService";
import { useEffect, useState } from "react";
import { orderOfflineService } from "@/services/offline/orderOfflineService";
import { Button } from "@/components/ui/button";
import { TableBody, Table, TableCell, TableRow } from "../ui/table";
import TabStyleSelection from "../common/TabStyleSelection";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice, formatTimeAgo } from "@/utils/formatter";
import { Store } from "lucide-react";

export const OrderHistory = () => {
  const [orderData, setOrderData] = useState([]);
  const [filter, setFilter] = useState("new");
  const navigate = useNavigate();
  const fetchOrderData = async () => {
    try {
      const result = await getOrdersList();
      if (result.success) {
        setOrderData(
          result.data.data.filter(
            (o) =>
              orderOfflineService.getEventInfo(
                o.orderEvents,
                o.order_type === "pickup"
              ).currentMainStatus === filter
          )
        );
      } else {
        setOrderData([]);
        toast.error("Failed to fetch order history. Please try again later.");
      }
    } catch (error) {
      toast.error("Failed to getting order history. Please try again later.");
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [filter]);

  const tabOptions = [
    { value: "new", label: "New" },
    { value: "preparing", label: "Preparing" },
    { value: "delivering", label: "Delivering" },
    { value: "ready_to_pickup", label: "Ready To Pick Up" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="container mx-auto p-4">
      <TabStyleSelection
        options={tabOptions}
        value={filter}
        setValue={setFilter}
        big={true}
      />
      <div className="flex flex-col mt-3 gap-5">
        {(orderData.length === 0 || orderData === null) && (
          <div className="text-center text-muted-foreground flex items-center justify-center h-64 text-lg">
            No orders found.
          </div>
        )}
        {orderData?.map((order) => {
          return (
            <div className="bg-card p-4 border rounded-md">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-xl font-bold m-0">#{order.order_code}</h1>
                  {order.order_type === "pickup" ? (
                    <p className="text-sm text-muted-foreground">
                      Pick Up Order
                    </p>
                  ) : (
                    order.courier && (
                      <p className="text-sm text-muted-foreground">
                        Deliver By: {order.courier.storeProfile.full_name} (
                        {order.courier.storeProfile.phone})
                      </p>
                    )
                  )}
                </div>
                {filter === "new" ? (
                  <>
                    <p>Created {formatTimeAgo(order.created_at)}</p>
                  </>
                ) : (
                  <p>
                    Updated{" "}
                    {formatTimeAgo(order.orderEvents[0].event_timestamp)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {order?.orderItems.map((item) => (
                  <Link to={`/order/${order.order_id}`}>
                    <div className="flex flex-row items-center my-2">
                      <div className="flex flex-row gap-3 flex-1">
                        <img
                          src={item.snapshot_food_image}
                          alt={item.snapshot_food_name}
                          // cover
                          className="w-32 h-18 object-cover rounded-sm"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-lg">
                            {item.snapshot_food_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.customization}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-right text-sm text-muted-foreground">
                          x{item.quantity}
                        </p>
                        <p className="ml-4 text-right font-semibold">
                          {formatPrice(item.base_price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <hr className="mt-3 mb-2" />
              <div className="flex justify-end">
                <p>Total to pay: {formatPrice(order.final_price)}</p>
              </div>
              <div className="flex justify-end gap-2">
                {filter === "cancelled" &&
                  (() => {
                    const cancelEvent = order.orderEvents.find(
                      (e) => e.event_type === "cancelled"
                    );
                    const reason =
                      cancelEvent?.reason ||
                      cancelEvent?.note ||
                      cancelEvent?.description ||
                      cancelEvent?.event_reason;
                    if (reason) {
                      return (
                        <Button
                          disabled
                          variant={"ghost"}
                          className="font-semibold mb-2 mt-3"
                        >
                          Cancel reason: {reason}
                        </Button>
                      );
                    }
                    return null;
                  })}
                <div className="flex gap-2">
                  <Button
                    variant={"default"}
                    className={"mt-3"}
                    onClick={() => navigate(`/store/${order.store.id}`)}
                  >
                    <Store />
                    Visit the store
                  </Button>
                  <Button
                    variant={"outline"}
                    className={"mt-3"}
                    onClick={() => navigate(`/order/${order.order_id}`)}
                  >
                    View Detail
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
