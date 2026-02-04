import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import orderService from "@/services/orderService";
import {
  Ban,
  BanknoteX,
  CheckCircle,
  CircleDollarSign,
  ClipboardPlus,
  Clock,
  Clock2,
  CookingPot,
  HandCoins,
  Package,
  ReceiptText,
  ScanQrCode,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import OrderCard from "./OrderCard";
import TabStyleSelection from "@/components/common/TabStyleSelection";

function OrderListLayout() {
  const { user } = useUser();
  const current_group = user?.group?.name || "";
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrdersList(current_group === "courier" && {
        assigned_courier_id: user?.id,
      });
      if (response.success) {
        setOrders(response.data);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // fetch order between 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 15000); 
    return () => clearInterval(interval);
  }, []);

  const tabListData = [
    {
      status: ["new"],
      allow_group: ["manager", "sale_agent"],
      title: "New",
      icon: <ClipboardPlus />,
    },
    {
      status: ["preparing"],
      allow_group: ["manager", "sale_agent"],
      title: "Preparing",
      icon: <CookingPot />,
    },
    {
      status: ["delivering"],
      allow_group: ["manager", "sale_agent"],
      title: "Delivering",
      icon: <Truck />,
    },
    {
      status: ["ready_to_pickup"],
      allow_group: ["manager", "sale_agent"],
      title: "Ready to Pickup",
      icon: <Package />,
    },
    {
      status: ["completed"],
      allow_group: ["manager", "sale_agent"],
      title: "Completed",
      icon: <CheckCircle />,
    },
    {
      status: ["new", "preparing"],
      allow_group: ["courier"],
      title: "Prepare to Delivery",
      icon: <Clock2 />,
    },
    {
      status: ["delivering"],
      allow_group: ["courier"],
      title: "Ready to Delivery",
      icon: <ReceiptText />,
    },
    {
      status: ["cancelled"],
      allow_group: ["manager", "sale_agent", "courier"],
      title: "Cancelled",
      icon: <Ban />,
    },
  ];

  const allowedTabs = tabListData.filter((tab) =>
    tab.allow_group.includes(current_group)
  );
  const [selectedState, setSelectedState] = React.useState(["new"]);
  const [sortBy, setSortBy] = React.useState("newest");
  const [filterOrderType, setFilterOrderType] = React.useState("all");
  const [filterPaymentOption, setFilterPaymentOption] = React.useState("all");
  const [filterIsPaid, setFilterIsPaid] = React.useState("all");

  const getFilteredOrders = () => {
    return orders
      .filter((order) => {
        if (order.displayEventInformation?.isCancelled) {
          return selectedState.includes("cancelled");
        }

        if (
          selectedState.length > 0 &&
          !selectedState.includes(
            order.displayEventInformation?.currentMainStatus
          )
        ) {
          return false;
        }

        if (filterOrderType !== "all" && order.order_type !== filterOrderType) {
          return false;
        }

        if (
          filterPaymentOption !== "all" &&
          order.payment_option !== filterPaymentOption
        ) {
          return false;
        }

        if (filterIsPaid === "paid" && !order.is_paid) {
          return false;
        }
        if (filterIsPaid === "unpaid" && order.is_paid) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at) - new Date(a.created_at);
        } else {
          return new Date(a.created_at) - new Date(b.created_at);
        }
      });
  };

  const filteredOrders = getFilteredOrders();

  const StatusTabItem = ({ icon, title, onClick, isActive }) => {
    return (
      <div
        className={`w-full flex-1 flex items-center justify-center py-4 gap-2 border-b-2  ${
          isActive
            ? "border-b-primary bg-primary/10"
            : "border-b hover:bg-primary/5 "
        } cursor-pointer`}
        onClick={onClick}
      >
        <div
          className={`flex items-center justify-center w-5 h-5 ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {icon}
        </div>
        <h2
          className={`text-sm ${
            isActive ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {title}
        </h2>
      </div>
    );
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="min-h-[600px]">
        <ResizablePanel
          defaultSize={65}
          minSize={40}
          className="flex flex-col w-100"
        >
          <div className="flex w-full">
            {allowedTabs.map((tab) => (
              <StatusTabItem
                key={tab.title}
                icon={tab.icon}
                title={tab.title}
                isActive={
                  JSON.stringify(selectedState) === JSON.stringify(tab.status)
                }
                onClick={() => setSelectedState(tab.status)}
              />
            ))}
          </div>
          <div className="flex flex-wrap p-2 gap-1 border-b border-border/30">
            <TabStyleSelection
              options={[
                {
                  value: "all",
                  label: "All Order Types",
                },
                {
                  value: "pickup",
                  label: "Pick Up",
                  icon: <Truck />,
                },
                {
                  value: "delivery",
                  label: "Delivery",
                  icon: <Package />,
                },
              ]}
              value={filterOrderType}
              setValue={setFilterOrderType}
            />
            <TabStyleSelection
              options={[
                {
                  value: "all",
                  label: "All Payment Methods",
                },
                {
                  value: "qr",
                  label: "QR Code",
                  icon: <ScanQrCode />,
                },
                {
                  value: "cash",
                  label: "Cash",
                  icon: <HandCoins />,
                },
              ]}
              value={filterPaymentOption}
              setValue={setFilterPaymentOption}
            />
            <TabStyleSelection
              options={[
                {
                  value: "all",
                  label: "All Payment Status",
                },
                {
                  value: "paid",
                  label: "Paid",
                  icon: <CircleDollarSign />,
                },
                {
                  value: "unpaid",
                  label: "Unpaid",

                  icon: <BanknoteX />,
                },
              ]}
              value={filterIsPaid}
              setValue={setFilterIsPaid}
            />
            <TabStyleSelection
              options={[
                {
                  value: "newest",
                  label: "Newest",
                  icon: <Clock />,
                },
                {
                  value: "oldest",
                  label: "Oldest",
                  icon: <Clock2 />,
                },
              ]}
              value={sortBy}
              setValue={setSortBy}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order.order_id}
                  data={order}
                  fetchData={fetchOrders}
                  setViewDetail={setSelectedOrder}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>No orders match your filter criteria</p>
              </div>
            )}
          </div>
          {/* <div className="flex items-center justify-between px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => fetchOrders()}
            >
              Refresh
            </Button>
          </div> */}
        </ResizablePanel>

        {/* <ResizableHandle />

        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="flex flex-col h-full bg-blue">
            {selectedOrder ? (
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">Order Details</h2>
                <p>Order ID: {selectedOrder}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p>Select an order to view details</p>
              </div>
            )}
          </div>
        </ResizablePanel> */}
      </ResizablePanelGroup>
    </>
  );
}

export default OrderListLayout;
