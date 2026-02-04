import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getOrderDetailById } from "@/services/orderService";
import {
  formatHours,
  formatPrice,
  formatString,
  formatTimeAgo,
} from "@/utils/formatter";
import Barcode from "react-barcode";
import {
  ArrowRight,
  Banknote,
  ChevronRight,
  ChevronUp,
  CookingPot,
  Copy,
  Download,
  Landmark,
  MapPin,
  MessageCircle,
  MessageCircleCode,
  MessageSquare,
  Package,
  Phone,
  Plus,
  RectangleEllipsis,
  Truck,
  User,
  Map,
  Utensils,
  ScanBarcode,
  ClipboardPlus,
  Store,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderOfflineService } from "@/services/offline/orderOfflineService";
import { Avatar } from "@/components/ui/avatar";
import SetTitle from "@/components/common/SetTitle";

function OrderDetailPage() {
  const { orderId } = useParams();
  const isRecentlyCreated =
    new URLSearchParams(window.location.search).get("isRecentlyCreated") ===
    "true";
  const [orderData, setOrderData] = useState(null);
  const [qrImageError, setQrImageError] = useState(false);
  const [eventInfo, setEventInfo] = useState({});
  const [pickUpViewCode, setPickUpViewCode] = useState("text");

  const EventMilestone = ({
    eventType,
    timestamp,
    isCompleted,
    isCancelled,
    isActive,
  }) => {
    const eventJson = {
      new: {
        label: "New",
        icon: <ClipboardPlus />,
      },
      preparing: {
        label: "Preparing",
        icon: <CookingPot />,
      },
      delivering: {
        label: "Delivering",
        icon: <Truck />,
      },
      completed: {
        label: "Completed",
        icon: <Utensils />,
      },
      ready_to_pickup: {
        label: "Ready for Pickup",
        icon: <Package />,
      },
    };
    return (
      <div className="flex flex-col items-center z-9">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-full ${isActive
              ? `${isCancelled ? "bg-red-400 " : "bg-primary"
              } text-primary-foreground`
              : "bg-card text-muted-foreground"
            }`}
        >
          {eventJson[eventType]?.icon || <Plus />}
        </div>
        <span className={`text-sm font-medium mt-3 capitalize`}>
          {eventJson[eventType]?.label || eventType}
        </span>
      </div>
    );
  };
  const fetchOrderData = async () => {
    try {
      const result = await getOrderDetailById(orderId);
      if (result.success) {
        setOrderData(result.data);
        setEventInfo(
          orderOfflineService.getEventInfo(
            result.data.orderEvents,
            result.data.order_type === "pickup"
          )
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrderData();
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, isRecentlyCreated, fetchOrderData]);

  const qrCard = () => {
    return (
      <div className="bg-primary/5 p-4 rounded-lg flex flex-col items-start border border-primary/30">
        <SetTitle title="Order Detail" />
        <div className="flex items-center justify-between w-full ">
          <h2 className="text-xl font-semibold">Payment</h2>
          <Badge variant="outline" className="text-xs">
            Unpaid
          </Badge>
        </div>
        <p className="mb-4 text-sm opacity-90">
          Please scan this QR code on your banking app
        </p>
        <img
          src={`https://qr.sepay.vn/img?acc=${orderData?.store?.settings?.bank_number
            }&template=qronly&bank=${orderData?.store?.settings?.bank}&des=${orderData?.order_code
            }&amount=${parseInt(orderData?.final_price).toFixed(0)}`}
          onError={() => setQrImageError(true)}
          onLoad={() => setQrImageError(false)}
          alt="QR Code"
          className="w-48 h-48 rounded-md mx-auto"
        />
        <div className="bg-muted/30 p-4 rounded-lg w-full mt-6">
          <p className="mb-2 text-sm">
            or get the bank details to pay manually:
          </p>
          <p className="flex gap-2 items-center">
            <Landmark className="inline-block mr-1 scale-90" />
            {orderData?.store?.settings?.bank}
          </p>
          <p className="flex gap-2 mt-1 items-center ">
            <RectangleEllipsis className="inline-block mr-1 scale-90" />
            {orderData?.store?.settings?.bank_number}
          </p>
          <p className="flex gap-2 mt-1 items-center">
            <Banknote className="inline-block mr-1 scale-90" />
            {formatPrice(parseInt(orderData?.final_price))}
          </p>
          <p className="flex gap-2 mt-1 items-center">
            <MessageCircle className="inline-block mr-1 scale-90" />
            {orderData?.order_code}
          </p>
          <p className="mt-2 text-sm italic opacity-70">
            This window will be automatically hidden when store's sale confirm
            that payment is successfully.
          </p>
        </div>

        <div className="flex mt-4 justify-center w-full gap-2">
          <Button
            variant="outline"
            className={"flex-1"}
            onClick={() =>
              navigator.clipboard.writeText(
                orderData?.store?.settings?.bank_number
              )
            }
          >
            <RectangleEllipsis /> Copy Bank Number
          </Button>
          <Button
            className={"flex-1"}
            variant={"outline"}
            onClick={() => navigator.clipboard.writeText(orderData?.order_code)}
          >
            <MessageCircle /> Copy Order Code
          </Button>
        </div>
        <Button
          className={"w-full mt-2"}
          onClick={() => {
            // NEW TAB
            const qrImageUrl = `https://qr.sepay.vn/img?acc=${orderData?.store?.settings?.bank_number
              }&template=qronly&bank=${orderData?.store?.settings?.bank}&des=${orderData?.order_code
              }&amount=${parseInt(orderData?.final_price).toFixed(
                0
              )}&download=true`;
            const newTab = window.open(qrImageUrl, "_blank");
            if (newTab) {
              newTab.focus();
            }
          }}
        >
          <Download /> Download QR Code
        </Button>
      </div>
    );
  };

  const formatEventTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const isToday = date.toDateString() === new Date().toDateString();
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) {
      return `Today at ${timeString}`;
    }
    return `${date.getDate()}/${date.getMonth() + 1} at ${timeString}`;
  };

  const billSection = () => {
    if (!orderData) return null;

    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold ">Items</h2>
        <p className="text-xs text-muted-foreground opacity-80 mb-4 mt-0">
          This is a snapshot of your order details at the time of creation. The
          prices and items may have changed since then.
        </p>
        <div className="mb-4 rounded-lg overflow-hidden">
          {orderData?.orderItems?.map((item, index) => (
            <>
              <div key={item.item_id} className="flex gap-3 bg-card p-3">
                {/* <img
                  src={item.snapshot_food_image}
                  alt={item.snapshot_food_name}
                  className="w-24 h-16 rounded-md object-cover"
                /> */}
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">
                      {item.snapshot_food_name}
                      {item.quantity > 0 && (
                        <span className="text-sm text-muted-foreground opacity-70">
                          {" "}
                          (x{item.quantity})
                        </span>
                      )}
                    </h3>
                    <span className="font-medium">
                      {item.sale_price !== item.base_price
                        ? formatPrice(parseFloat(item.sale_price))
                        : formatPrice(parseFloat(item.base_price))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    {item.customization && (
                      <p className="text-xs text-muted-foreground">
                        {item.customization}
                      </p>
                    )}
                    <span className="text-sm text-muted-foreground line-through">
                      {item.sale_price !== item.base_price &&
                        formatPrice(parseFloat(item.base_price))}
                    </span>
                  </div>
                </div>
              </div>
              {index < orderData.orderItems.length - 1 && <Separator />}
            </>
          ))}
        </div>

        {/* Price Summary */}
        <div className="space-y-3 px-3">
          <div className="flex justify-between text-sm items-center">
            <span className="font-semibold text-lg">Subtotal</span>
            <span className="text-md">
              {formatPrice(orderData?.base_price_subtotal)}
            </span>
          </div>
          {parseFloat(orderData?.delivery_fee) > 0 && (
            <div className="flex justify-between text-sm items-center">
              <span>Delivery fee</span>
              <span>{formatPrice(orderData?.delivery_fee)}</span>
            </div>
          )}
          {parseFloat(orderData?.base_price_subtotal) !==
            parseFloat(orderData?.sale_price_subtotal) && (
              <div className="flex justify-between text-sm items-center">
                <span>Discount</span>
                <span>
                  {formatPrice(
                    orderData?.base_price_subtotal -
                    orderData?.sale_price_subtotal
                  )}
                </span>
              </div>
            )}

          {parseFloat(orderData?.promote_discount_price) > 0 && (
            <div className="flex justify-between text-sm  items-center">
              <span>Coupon</span>
              <span>-{formatPrice(orderData?.promote_discount_price)}</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Total to pay</span>
            <span className="text-primary text-lg">
              {formatPrice(orderData?.final_price)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const eventSection = () => {
    const [expandAllEvents, setExpandAllEvents] = useState(false);

    return (
      <>
        <h2 className="text-lg font-semibold mb-2">Your order progress</h2>
        <div className="space-y-2">
          {/* <pre>
            <code>{JSON.stringify(eventInfo, null, 2)}</code>
          </pre>{" "} */}
          <div className={"z-1 px-4 mt-12"}>
            <Progress
              // the index of the current main status in the mainStatusList * 100
              value={
                (eventInfo?.mainStatusList?.indexOf(
                  eventInfo?.currentMainStatus
                ) /
                  (eventInfo?.mainStatusList?.length - 1)) *
                100
              }
            />
          </div>
          <div className="flex items-center gap-4 mb-4 justify-between -mt-10">
            {eventInfo.mainStatusList?.length > 0 &&
              eventInfo.mainStatusList.map((status) => (
                <EventMilestone
                  key={status}
                  eventType={status}
                  timestamp={
                    orderData?.orderEvents.find(
                      (event) => event.event_type === status
                    )?.event_timestamp
                  }
                  isCompleted={eventInfo.isCompleted}
                  isCancelled={eventInfo.isCancelled}
                  isActive={orderData?.orderEvents.some(
                    (event) => event.event_type === status
                  )}
                />
              ))}
          </div>
        </div>
        {expandAllEvents ? (
          <>
            <div className="space-y-1 rounded-xl overflow-hidden">
              {orderData?.orderEvents?.map((event) => (
                <div
                  key={event.event_id}
                  className="p-4 bg-card flex items-start justify-between"
                >
                  <div className="flex items-start flex-col">
                    <span className="text-sm font-semibold">
                      {formatString(event.event_type)}
                    </span>
                    <span className="text-sm">
                      {orderOfflineService.eventMessage(event.event_type)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatEventTimestamp(event.event_timestamp)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                className={"ml-auto mt-3 border-none"}
                size="sm"
                onClick={() => setExpandAllEvents(false)}
              >
                <ChevronUp />
                View latest only
              </Button>
            </div>
          </>
        ) : (
          orderData?.orderEvents?.length > 0 && (
            <div className="p-4 bg-card flex items-start justify-between rounded-lg border border-primary/30 shadow-primary">
              <div className="flex items-start flex-col h-full">
                <p className="text-xs font-semibold text-primary mb-1">
                  Latest
                </p>
                <span className="text-md font-bold">
                  {formatString(
                    orderData?.orderEvents[orderData?.orderEvents.length - 1]
                      ?.event_type
                  )}
                </span>
                <span className="text-sm">
                  {orderOfflineService.eventMessage(
                    orderData?.orderEvents[orderData?.orderEvents.length - 1]
                      ?.event_type
                  )}
                </span>
              </div>
              <div className="flex flex-col items-end justify-between h-full gap-3">
                <p className="text-sm text-muted-foreground">
                  {formatEventTimestamp(
                    orderData?.orderEvents[orderData?.orderEvents.length - 1]
                      ?.event_timestamp
                  )}
                </p>
                <Button
                  variant="outline"
                  className={"mt-auto text-sm"}
                  size="sm"
                  onClick={() => setExpandAllEvents(true)}
                >
                  View all
                </Button>
              </div>
            </div>
          )
        )}
      </>
    );
  };

  const deliverySection = () => {
    return (
      <div className="bg-card p-4 rounded-lg border border-card/30 shadow-primary">
        <p className="text-lg font-semibold mb-3">Delivery Information</p>
        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
          Courier <Truck className="w-4 h-4" />
        </p>
        {orderData?.snapshot_assigned_courier_name ? (
          <div className="flex items-center justify-between mb-2">
            <div>
              {orderData?.snapshot_assigned_courier_name && (
                <p className="text-md text-primary font-semibold flex items-center gap-3">
                  {orderData?.snapshot_assigned_courier_name}
                </p>
              )}
              {orderData?.snapshot_assigned_courier_phone && (
                <p className="text-sm text-muted-foreground flex items-center gap-3">
                  {orderData?.snapshot_assigned_courier_phone}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  window.open(
                    `tel:${orderData?.snapshot_assigned_courier_phone}`
                  )
                }
                className="mr-2"
              >
                <Phone className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic opacity-70 mb-2">
            Waiting for courier to be assigned...
          </p>
        )}
        <div className="px-1">
          <Separator className="my-3" />
        </div>
        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
          Delivery to <ChevronRight className="w-4 h-4" />
        </p>
        {orderData?.snapshot_recipient_name && (
          <p className="text-md font-semibold flex items-center gap-3">
            {orderData?.snapshot_recipient_name}
          </p>
        )}
        {orderData?.snapshot_recipient_phone && (
          <p className="text-sm text-muted-foreground flex items-center gap-3">
            {orderData?.snapshot_recipient_phone}
          </p>
        )}
        {orderData?.snapshot_delivery_address_line && (
          <p className="text-sm text-muted-foreground flex items-center gap-3">
            {orderData?.snapshot_delivery_address_line}
          </p>
        )}
      </div>
    );
  };

  const pickUpSection = () => {
    // const [viewBarCode, setViewBarCode] = useState(false);
    /**
       * "store": {
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
            "updated_at": "2025-07-14 23:39:58",
            "settings": {
                "bank": "Techcombank",
                "bank_number": "19037648903016"
            }
        },
       */
    return (
      <div className="bg-card p-4 rounded-lg border border-card/30 shadow-primary">
        <p className="text-lg font-semibold mb-3">Pickup Information</p>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            {orderData?.store?.name && (
              <p className="text-md font-semibold flex items-center gap-3">
                {orderData?.store?.name}
              </p>
            )}
            {orderData?.store?.phone && (
              <p className="text-sm text-muted-foreground flex items-center gap-3">
                {orderData?.store?.phone}
              </p>
            )}
            {orderData?.store?.address && (
              <p className="text-sm text-muted-foreground flex items-center gap-3">
                {orderData?.store?.address}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.open(`tel:${orderData?.store?.phone}`)}
            className="mr-2"
          >
            <Phone className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {orderData?.store?.closing_time && (
          <p className="text-sm text-muted-foreground flex items-center gap-3">
            Please arrive before {formatHours(orderData?.store?.closing_time)}
          </p>
        )}
        <p className="text-sm text-muted-foreground flex items-center gap-3">
          When arriving at the store, please show the order code or scan the
          barcode below:
        </p>
        <div className="text-md font-semibold flex items-center justify-center uppercase py-2 bg-muted/30 rounded-md mt-2">
          {pickUpViewCode === "text" ? (
            <span className="text-xl tracking-wider">
              {orderData?.order_code}
            </span>
          ) : (
            <div className="py-2">
              {orderData?.order_code && (
                <Barcode
                  value={orderData?.order_code}
                  width={1.4}
                  height={50}
                  fontSize={14}
                  margin={0}
                  displayValue={false}
                />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant={"default"}
            className="flex-1"
            onClick={() => {
              if (orderData?.store?.latitude && orderData?.store?.longitude) {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${orderData?.store?.latitude},${orderData?.store?.longitude}`,
                  "_blank"
                );
              } else {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${orderData?.store?.address}`,
                  "_blank"
                );
              }
            }}
          >
            <Map className="w-4 h-4" />
            View in Maps
          </Button>
          <Button
            // switch between text and barcode
            variant={"outline"}
            className="flex-1"
            onClick={() =>
              setPickUpViewCode(pickUpViewCode === "text" ? "barcode" : "text")
            }
          >
            {pickUpViewCode === "barcode" ? (
              <RectangleEllipsis className="w-4 h-4" />
            ) : (
              <ScanBarcode className="w-4 h-4" />
            )}
            View as {pickUpViewCode === "text" ? "Barcode" : "Text"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 mt-6">
      {isRecentlyCreated && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-4">
          <p className="text-sm">
            Your order has been successfully created! You can view the details
            below.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-3xl font-semibold">Order Details</p>
          <p className="text-sm text-muted-foreground mb-4">
            ID: #{orderData?.order_code}
            {"   •   "}
            Created {formatTimeAgo(orderData?.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col justify-center">
            <h2 className="text-md font-semibold">{orderData?.store?.name}</h2>
          </div>
          {orderData?.store?.avatar_url ? (
            <Avatar className="h-8 w-8 border">
              <img
                src={orderData?.store?.avatar_url}
                alt={orderData?.store?.name}
              />
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 border flex items-center justify-center">
              <Store className="scale-70 opacity-80" />
            </Avatar>
          )}
        </div>
        {/* <div className="flex items-center gap-4">
          <Link to={`/chat/${orderData?.store_id}`}>
            <Button variant={"outline"}>
              <MessageCircle />
              Message to Store
            </Button>
          </Link>
          <Button variant={"destructive"}>Cancel Order</Button>
        </div> */}
      </div>

      <div className="flex gap-8">
        {/* <pre>
          <code>
            {JSON.stringify(orderData, null, 2)}
          </code>
        </pre> */}
        <div className="w-2/3">
          {eventSection()}
          {orderData && billSection()}
        </div>
        <div className="w-1/3 space-y-4">
          {orderData?.order_type === "pickup" &&
            !orderData?.is_completed &&
            pickUpSection()}
          {orderData?.order_type === "delivery" &&
            !orderData?.is_completed &&
            deliverySection()}
          {!orderData?.is_paid &&
            orderData?.payment_option === "qr" &&
            !orderData?.is_completed &&
            qrCard()}
          {/* <pre>
            <code>{JSON.stringify(orderData, null, 2)}</code>
          </pre> */}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
