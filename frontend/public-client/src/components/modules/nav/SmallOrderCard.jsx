import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { orderOfflineService } from "@/services/offline/orderOfflineService";
import {
  CheckCircle,
  ClipboardPlus,
  CookingPot,
  HandCoins,
  Package,
  Plus,
  ScanQrCode,
  Truck,
  Utensils,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function SmallOrderCard({ data }) {
  const [eventInfo, setEventInfo] = useState({});
  useEffect(() => {
    const fetchEventInfo = async () => {
      console.log(
        "Fetching event info for order:",
        data?.orderEvents,
        data?.order_type
      );
      const eventinf = orderOfflineService.getEventInfo(
        data?.orderEvents,
        data?.order_type === "pickup"
      );
      setEventInfo(eventinf);
    };
    fetchEventInfo();
  }, [data]);
  if (!data) return null;

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
        icon: (
          <ClipboardPlus
            className={`h-4 w-4 ${
              isActive ? "text-primary" : "text-muted-foreground opacity-50"
            }`}
          />
        ),
      },
      preparing: {
        label: "Preparing",
        icon: (
          <CookingPot
            className={`h-4 w-4 ${
              isActive ? "text-primary" : "text-muted-foreground opacity-50"
            }`}
          />
        ),
      },
      delivering: {
        label: "Delivering",
        icon: (
          <Truck
            className={`h-4 w-4 ${
              isActive ? "text-primary" : "text-muted-foreground opacity-50"
            }`}
          />
        ),
      },
      completed: {
        label: "Completed",
        icon: (
          <Utensils
            className={`h-4 w-4 ${
              isActive ? "text-primary" : "text-muted-foreground opacity-50"
            }`}
          />
        ),
      },
      ready_to_pickup: {
        label: "Ready for Pickup",
        icon: (
          <Package
            className={`h-4 w-4 ${
              isActive ? "text-primary" : "text-muted-foreground opacity-50"
            }`}
          />
        ),
      },
    };
    return (
      <div className="flex flex-col items-center z-99">
        {eventJson[eventType]?.icon || <Plus />}
      </div>
    );
  };

  return (
    <DropdownMenuItem className={"p-2.5"}>
      {/* <pre>
        <code>{JSON.stringify(eventInfo, null, 2)}</code>
      </pre> */}
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-end justify-between">
          <p className="capitalize text-md font-semibold">{data?.order_code}</p>

          <div className="flex items-center gap-1">
            <p className="text-xs text-muted-foreground bg-card/30 border px-1.5 rounded-md flex items-center gap-1">
              {data?.payment_option === "qr" ? (
                data?.is_paid ? (
                  <>
                    <CheckCircle className="scale-80" />
                    Paid
                  </>
                ) : (
                  <>
                    <ScanQrCode className="scale-80" />
                    Unpaid
                  </>
                )
              ) : (
                <HandCoins className="scale-80" />
              )}
            </p>
            <p className="text-xs text-muted-foreground bg-card/30 border px-2 rounded-md">
              {data?.order_type === "pickup" ? "Pickup" : "Delivery"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground -mt-1">
          <p>
            {orderOfflineService.eventMessage(eventInfo?.currentMainStatus)}
          </p>
        </div>
        {eventInfo?.currentMainStatus !== "cancelled" && (
          <>
            <Progress
              value={
                (eventInfo?.mainStatusList?.indexOf(
                  eventInfo?.currentMainStatus
                ) /
                  (eventInfo?.mainStatusList?.length - 1)) *
                100
              }
            />
            <div className="flex items-center justify-between">
              {eventInfo?.mainStatusList?.map((status, index) => (
                <p
                  key={index}
                  className={`text-xs ${
                    eventInfo?.currentMainStatus === status
                      ? "text-primary"
                      : "text-muted-foreground opacity-80"
                  }`}
                >
                  <EventMilestone
                    eventType={status}
                    timestamp={
                      data?.orderEvents.find(
                        (event) => event.event_type === status
                      )?.event_timestamp
                    }
                    isCompleted={eventInfo?.isCompleted}
                    isCancelled={eventInfo?.isCancelled}
                    isActive={data?.orderEvents.some(
                      (event) => event.event_type === status
                    )}
                  />
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </DropdownMenuItem>
  );
}

export default SmallOrderCard;
