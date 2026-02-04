import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatTimeAgo } from "@/utils/formatter";
import {
  BanknoteX,
  CircleDollarSign,
  Copy,
  HandCoins,
  MapPin,
  QrCode,
  Store,
  Truck,
  TruckElectric,
  ChevronDown,
  ChevronUp,
  Plus,
  Phone,
  User,
  ChevronsRight,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import MoveStatusDialogConfirmation from "./ChangeStatusDialogConfirmation";
import CancelDialogConfirmation from "./CancelConfirmation";
import SetPaidDialogConfirmation from "./SetPaidDialogConfirmation";
import CourierPickDialog from "./CourierPickDialog";

const InfoBadge = ({ children, icon }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-card-foreground/80 bg-muted/50 rounded">
      {icon && <div className="text-primary scale-75">{icon}</div>}
      <span>{children}</span>
    </span>
  );
};

const StatusBadge = ({ status, isCancelled, isCompleted }) => {
  const getStatusColor = (status) => {
    if (isCancelled) {
      return "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900";
    }
    if (isCompleted) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900";
    }

    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900";
      case "ready_to_pickup":
        return "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900";
      case "completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-200 dark:text-gray-900";
    }
  };

  // Determine display status based on completion and cancellation flags
  const displayStatus = isCancelled
    ? "cancelled"
    : isCompleted
    ? "completed"
    : status;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm text-xs capitalize font-bold ${getStatusColor(
        status
      )}`}
    >
      {displayStatus.replace(/_/g, " ")}
    </span>
  );
};

function OrderCard({ data, setViewDetail, fetchData = () => {} }) {
  //   const [showAllEvents, setShowAllEvents] = useState(false);
  const [showOrderItems, setShowOrderItems] = useState(false);

  // Get latest event
  //   const latestEvent =
  //     data?.orderEvents?.length > 0
  //       ? data.orderEvents[data.orderEvents.length - 1]
  //       : null;

  const hasAssignedCourier =
    data?.assigned_courier_id || data?.snapshot_assigned_courier_name;
  const showCourierSection =
    hasAssignedCourier || data?.allowedActivity?.allowAssignCourier;

  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="p-2 px-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          {data?.displayEventInformation?.currentMainStatus && (
            <StatusBadge
              status={data.displayEventInformation.currentMainStatus}
              isCancelled={data?.displayEventInformation?.isCancelled}
              isCompleted={data?.displayEventInformation?.isCompleted}
            />
          )}
          <h3 className="text-md font-semibold">{data?.order_code}</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            size="xs"
            className={"px-2 py-0.5"}
            onClick={() => {
              navigator.clipboard.writeText(data?.order_code);
              toast("Order code copied to clipboard!");
            }}
          >
            <Copy />
            Copy Code
          </Button>
          {/* <Button
            variant={"outline"}
            size="xs"
            className={"px-2 py-0.5"}
            onClick={() => setViewDetail(data.order_id)}
          >
            View Details
          </Button> */}
        </div>
      </div>
      <div className="p-2 pb-0">
        <div className="flex flex-wrap gap-2">
          {data?.payment_option === "cash" ? (
            <InfoBadge icon={<HandCoins />}>Cash</InfoBadge>
          ) : (
            <InfoBadge icon={<QrCode />}>QR Payment</InfoBadge>
          )}
          {data?.is_paid ? (
            <InfoBadge icon={<CircleDollarSign />}>Paid</InfoBadge>
          ) : (
            <InfoBadge icon={<BanknoteX />}>Unpaid</InfoBadge>
          )}
          {data?.order_type === "pickup" ? (
            <InfoBadge icon={<Store />}>Pickup</InfoBadge>
          ) : (
            <InfoBadge icon={<Truck />}>Delivery</InfoBadge>
          )}
        </div>
      </div>

      {/* <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-medium">Latest Event</h4>
          {data?.orderEvents?.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="h-6 px-2 bg-muted/30 text-xs"
            >
              {showAllEvents ? (
                <>
                  <ChevronUp className="h-2 w-2" /> Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-2 w-2" /> More
                </>
              )}
            </Button>
          )}
        </div>

        {latestEvent && (
          <div className="mt-1">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium capitalize">
                {latestEvent.event_type.replace(/_/g, " ")}
              </span>
              <span className="text-muted-foreground">
                {formatTimeAgo(latestEvent.event_timestamp)}
              </span>
            </div>
            {latestEvent.event_notes && (
              <p className="text-sm text-muted-foreground mt-1">
                {latestEvent.event_notes}
              </p>
            )}
          </div>
        )}

        {showAllEvents && data?.orderEvents?.length > 1 && (
          <div className="mt-2">
            <div className="space-y-2">
              {data.orderEvents
                .slice(0, -1)
                .reverse()
                .map((event) => (
                  <div key={event.event_id} className="text-sm border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">
                        {event.event_type.replace(/_/g, " ")}
                      </span>
                      <span className="text-muted-foreground">
                        {formatTimeAgo(event.event_timestamp)}
                      </span>
                    </div>
                    {event.event_notes && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.event_notes}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div> */}

      <div className="p-3 border-b">
        <div className="flex flex-wrap -mx-2">
          <div className={`px-2 ${showCourierSection ? "w-1/2" : "w-full"}`}>
            <h4 className="text-sm font-semibold mb-2">Recipient</h4>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{data?.snapshot_recipient_name || "Not specified"}</span>
              </div>
              {data?.snapshot_recipient_phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{data.snapshot_recipient_phone}</span>
                </div>
              )}
              {data?.snapshot_delivery_address_line && (
                <div className="flex items-start text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <span className="flex-1">
                    {data.snapshot_delivery_address_line}
                  </span>
                </div>
              )}
            </div>
          </div>

          {showCourierSection && (
            <div className={`flex flex-1 w-full`}>
              <Separator orientation="vertical" className="h-16 mx-2" />
              <div className="px-2 w-full">
                <h4 className="text-sm font-semibold">Courier</h4>
                {hasAssignedCourier ? (
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {data?.snapshot_assigned_courier_name ||
                          "Not specified"}
                      </span>
                    </div>
                    {data?.snapshot_assigned_courier_phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{data.snapshot_assigned_courier_phone}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  data?.allowedActivity?.allowAssignCourier && (
                    <div className="flex items-center justify-center h-16 border border-dashed rounded-md mt-2">
                      <CourierPickDialog
                        order_id={data?.order_id}
                        order_code={data?.order_code}
                        afterSubmitAction={fetchData}
                        selected_courier={data?.assigned_courier_id}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {data?.customer_special_instruction && (
        <div className="p-3 border-b">
          <h4 className="text-sm font-semibold mb-2">Instructions</h4>
          <p className="text-sm text-muted-foreground">
            {data.customer_special_instruction}
          </p>
        </div>
      )}
      {/* Order items section with collapse/expand functionality */}
      <div className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold">
            Items ({data?.orderItems?.length || 0})
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOrderItems(!showOrderItems)}
            className="h-6 px-2 bg-muted/30 text-xs"
          >
            {showOrderItems ? (
              <>
                <ChevronUp className="h-2 w-2" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="h-2 w-2" /> More
              </>
            )}
          </Button>
        </div>

        {showOrderItems && (
          <div className="mt-2">
            <div className="space-y-2">
              {data?.orderItems?.map((item) => (
                <div
                  key={item.item_id}
                  className="flex justify-between text-sm"
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.snapshot_food_name}</div>
                    {item.customization && (
                      <div className="text-xs text-muted-foreground">
                        {item.customization}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.sale_price)}{" "}
                      × {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final price section */}
      <div className="p-3 border-b">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Final Price</span>
          <span className="text-lg font-semibold text-primary">
            {formatCurrency(data?.final_price)}
          </span>
        </div>
      </div>

      <div className="p-2 pl-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground opacity-80">
            Created {formatTimeAgo(data?.created_at)}
          </p>
          <p className="text-xs text-muted-foreground opacity-80">
            by {data?.customer?.email || "System"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data?.allowedActivity?.allowAddCancelledEvent && (
            <CancelDialogConfirmation
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
          {data?.allowedActivity?.allowUnassignCourier && (
            <CourierPickDialog
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
              selected_courier={data?.assigned_courier_id}
            />
          )}
          {data?.allowedActivity?.allowSetIsPaid && !data?.is_paid && (
            <SetPaidDialogConfirmation
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
          {data?.allowedActivity?.allowAddReadyToPickupEvent && (
            <MoveStatusDialogConfirmation
              status="ready_to_pickup"
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
          {data?.allowedActivity?.allowAddPreparingEvent && (
            <MoveStatusDialogConfirmation
              status="preparing"
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
          {data?.allowedActivity?.allowAddDeliveringEvent && (
            <MoveStatusDialogConfirmation
              status="delivering"
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
          {data?.allowedActivity?.allowAddCompletedEvent && (
            <MoveStatusDialogConfirmation
              status="completed"
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
          {data?.allowedActivity?.allowAddRefundEvent && (
            <MoveStatusDialogConfirmation
              status="refunded"
              order_id={data?.order_id}
              order_code={data?.order_code}
              afterSubmitAction={fetchData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
