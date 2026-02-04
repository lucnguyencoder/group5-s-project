import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatHours } from "@/utils/formatter";
import { ChevronRight, MapPin, Phone, Store } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const NEARBY_TIME_TO_CLOSE = 30;
const NEARBY_TIME_TO_OPEN = 30;

const timeAlert = (opening_time, closing_time) => {
  const now = new Date();
  const opening = new Date(now.toDateString() + " " + opening_time);
  const closing = new Date(now.toDateString() + " " + closing_time);

  if (now < opening) {
    if (opening - now <= NEARBY_TIME_TO_OPEN * 60 * 1000) {
      return (
        "Opening soon in " + ((opening - now) / 60000).toFixed(0) + " minutes"
      );
    }
  }
  if (now > closing) {
    return "Closed";
  }

  if (now < closing && closing - now <= NEARBY_TIME_TO_CLOSE * 60 * 1000) {
    return (
      "Closing soon in " + ((closing - now) / 60000).toFixed(0) + " minutes"
    );
  }

  if (opening <= now && now < closing) {
    return "Open";
  }
};

function StoreCard({ data, compact }) {

  if (compact) {
    return (
      <Link to={`/store/${data.store_id}`}>
        <div className="rounded-lg overflow-hidden flex py-2 px-4 items-center hover:bg-card/50 min-w-3xs cursor-pointer">
          {data?.avatar_url ? (
            <img
              src={data.avatar_url}
              alt={data.store_name}
              className="w-10 h-10 object-cover rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center border">
              <Store className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div className="ml-4 flex-1 w-full flex flex-col gap-0">
            <div className="flex items-center justify-between">
              <p className="text-md font-semibold text-card-foreground text-overflow-ellipsis whitespace-nowrap">
                {data.store_name}
              </p>
              {data?.distance && (
                <Badge variant={"outline"}>
                  {(data?.distance / 1000).toFixed(1)} km
                </Badge>
              )}
            </div>
            {data?.opening_time && data?.closing_time && (
              <p className="text-sm text-muted-foreground overflow-hidden text-overflow-ellipsis whitespace-nowrap max-w-full">
                {timeAlert(data.opening_time, data.closing_time)}
              </p>
            )}
            {!data?.opening_time && !data?.closing_time && data?.address && (
              <p className="text-sm text-muted-foreground overflow-hidden text-overflow-ellipsis whitespace-nowrap max-w-full">
                {data.address}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden flex flex-col">
      {data?.cover_image_url ? (
        <img
          src={data.cover_image_url}
          alt={data.store_name}
          className="w-full h-42 object-cover"
        />
      ) : (
        <div className="w-full h-42 bg-muted/50 flex items-center justify-center"></div>
      )}
      {data?.avatar_url && (
        <img
          src={data.avatar_url}
          alt={data.store_name}
          className="w-18 h-18 object-cover rounded-full -mt-8 ml-4"
        />
      )}
      <div className="p-4 flex-1">
        <p
          className={`text-xl font-semibold text-card-foreground flex items-end justify-between ${data?.avatar_url ? "-mt-12 ml-22 mb-3" : ""
            }`}
        >
          <p className="text-primary">{data.store_name}</p>
          {data?.distance && (
            <Badge variant={"outline"}>
              {(data?.distance / 1000).toFixed(1)} km
            </Badge>
          )}
        </p>
        {data?.address && (
          <p className="text-md text-muted-foreground overflow-hidden text-overflow-ellipsis whitespace-nowrap max-w-full">
            {data.address}
          </p>
        )}
        {data?.opening_time && data?.closing_time && (
          <p className="text-sm text-muted-foreground opacity-80">
            {timeAlert(data.opening_time, data.closing_time)} (
            {formatHours(data?.opening_time)} -{" "}
            {formatHours(data?.closing_time)})
          </p>
        )}
      </div>
      <div className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              let link = data.longitude
                ? `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  data.address || ""
                )}`;
              window.open(link, "_blank");
            }}
          >
            <MapPin />
          </Button>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              window.open("tel:" + data.phone, "_blank");
            }}
          >
            <Phone />
          </Button>
        </div>
        <Link to={`/store/${data.store_id}`}>
          <Button variant="outline">
            Details
            <ChevronRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default StoreCard;
