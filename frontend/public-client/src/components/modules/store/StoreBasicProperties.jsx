import React, { useEffect, useState } from "react";
import {
  Clock,
  Mail,
  Phone,
  MapPin,
  Star,
  CircleDollarSign,
  Car,
  PhoneCall,
  Map,
  Mails,
  Info,
  CalendarClock,
  MessageSquare,
  Compass,
  BadgeAlert,
  Share,
  Forward,
  PhoneOutgoing,
  BookmarkPlus,
} from "lucide-react";
import BigHorizontalProperties from "@/components/common/BigHorizontalProperties";
import { formatDistance, formatHours } from "@/utils/formatter";
import { Badge } from "@/components/ui/badge";
import locationService from "@/services/locationService";
import { useUser } from "@/context/UserContext";
import ActionButton from "@/components/common/ActionButton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import publicDataService from "@/services/publicDataService";
import { toast } from "sonner";

const StoreBasicProperties = ({ storeData }) => {
  const { deliveryAddresses } = useUser();
  const [distance, setDistance] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    checkFollowing();
    if (!deliveryAddresses || deliveryAddresses.length === 0) {
      console.warn("No delivery addresses available.");
      return;
    }

    const defaultAddress = deliveryAddresses.find(
      (address) => address.is_default
    );

    if (!defaultAddress) {
      console.warn("No default delivery address found.");
      return;
    }

    if (!storeData || !storeData.latitude || !storeData.longitude) {
      console.warn("Store location information is missing.");
      return;
    }

    try {
      const calculatedDistance = locationService.calculateDistanceOnDevice(
        defaultAddress.latitude,
        defaultAddress.longitude,
        storeData.latitude,
        storeData.longitude
      );
      setDistance(calculatedDistance || null);
    } catch (error) {
      console.error("Error calculating distance:", error);
    }
  }, [deliveryAddresses, storeData]);

  const checkFollowing = async () => {
    try {
      const response = await publicDataService.isFollowingStore(storeData.id);
      if (response.success) {
        if (response.saved) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const followStore = async () => {
    try {
      const response = await publicDataService.addFavoriteStore(storeData.id);
      if (response.success) {
        if (response.saved) {
          setIsFollowing(true);
          toast.success("You are now following this store!");
        } else {
          setIsFollowing(false);
          toast.success("You have unfollowed this store.");
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2 py-2">
        {/* expand 2 col */}
        <Button
          className="col-span-5 lg:col-span-5 space-y-6 h-auto mb-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-lg -mt-1"
          onClick={followStore}
        >
          {isFollowing ? "Unfollow" : "Follow this store"}
        </Button>
        {/* <ActionButton
          icon={<Compass />}
          onClick={followStore}
          title={isFollowing ? "Following" : "Follow"}
        /> */}
        {/* <ActionButton icon={<Compass />} title={"Direction"} /> */}
        {/* <Link to={"/chat/" + storeData.id}>
          <ActionButton icon={<MessageSquare />} title={"Chat"} />
        </Link> */}
        {/* {storeData.phone && (
          <ActionButton
            onClick={() => {
              window.open(`tel:${storeData.phone}`, "_blank");
            }}
            icon={<Phone />}
            title={"Call"}
          />
        )} */}
        {/* <ActionButton icon={<Forward />} title={"Share"} /> */}
        {/* <ActionButton icon={<BadgeAlert />} title={"Report"} /> */}
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <BigHorizontalProperties
            icon={<Car className="h-5 w-5 text-muted-foreground mt-0.5" />}
            title={"Distance"}
            value={formatDistance(distance)}
            square
          />
          <BigHorizontalProperties
            icon={
              <CalendarClock className="h-5 w-5 text-muted-foreground mt-0.5" />
            }
            title={"Opening Hours"}
            value={
              <>
                <p>
                  {formatHours(storeData.opening_time)} -{"  "}
                  {formatHours(storeData.closing_time)}
                </p>
                <Badge
                  variant={
                    storeData.isActive
                      ? storeData.isTempClosed
                        ? "secondary"
                        : "default"
                      : "destructive"
                  }
                  className="text-xs px-2"
                >
                  {storeData.isActive
                    ? storeData.isTempClosed
                      ? "Closed"
                      : "Open"
                    : "Disabled"}
                </Badge>
              </>
            }
            square
          />
          <BigHorizontalProperties
            icon={
              <PhoneCall className="h-5 w-5 text-muted-foreground mt-0.5" />
            }
            title={"Phone"}
            value={`${storeData.phone}`}
            square
            onClick={() => {
              window.open(`tel:${storeData.phone}`, "_blank");
            }}
          />
        </div>
        <BigHorizontalProperties
          icon={<Map className="h-5 w-5 text-muted-foreground mt-0.5" />}
          title={"Address"}
          value={`${storeData.address}`}
          onClick={() => {
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${storeData.latitude},${storeData.longitude}`,
              "_blank"
            );
          }}
        />
        <BigHorizontalProperties
          icon={<Mails className="h-5 w-5 text-muted-foreground mt-0.5" />}
          title={"Email"}
          value={`${storeData.email}`}
          onClick={() => {
            window.open(`mailto:${storeData.email}`, "_blank");
          }}
        />
        <BigHorizontalProperties
          icon={<Info className="h-5 w-5 text-muted-foreground mt-0.5" />}
          title={"About this store"}
          value={`${storeData.description}`}
          square
        />
      </div>
    </>
  );
};

export default StoreBasicProperties;
