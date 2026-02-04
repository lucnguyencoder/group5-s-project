import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  Share,
  Star,
  MapPin,
  CalendarClock,
  Phone,
  Map,
  User,
  MoreVertical,
  Flag,
  Check,
  Leaf,
  ArrowUpRight,
  ListPlus,
  Clock2,
  AlertCircleIcon,
  BadgePlus,
  MessageCircle,
} from "lucide-react";
import HorizontalProperties from "@/components/common/HorizontalProperties";
import { formatDistance, formatHours } from "@/utils/formatter";
import locationService from "@/services/locationService";
import { useUser } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import publicDataService from "@/services/publicDataService";
import { toast } from "sonner";

const FoodDetailStoreHeader = ({ foodData }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { deliveryAddresses } = useUser();
  const [distance, setDistance] = useState(null);
  const restaurantData = foodData?.store;

  useEffect(() => {
    isFollowingStore();
    console.log("Delivery Addresses:", deliveryAddresses);
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

    if (
      !restaurantData ||
      !restaurantData.latitude ||
      !restaurantData.longitude
    ) {
      console.warn("Store location information is missing.");
      return;
    }

    try {
      const calculatedDistance = locationService.calculateDistanceOnDevice(
        defaultAddress.latitude,
        defaultAddress.longitude,
        restaurantData.latitude,
        restaurantData.longitude
      );
      setDistance(calculatedDistance || null);
      console.log("Distance calculated:", calculatedDistance);
    } catch (error) {
      console.error("Error calculating distance:", error);
    }
  }, [deliveryAddresses, restaurantData]);

  const isFollowingStore = async () => {
    try {
      const response = await publicDataService.isFollowingStore(
        restaurantData.id
      );
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

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      const response = await publicDataService.addFavoriteStore(
        restaurantData.id
      );
      if (response.success) {
        if (response.saved) {
          setIsFollowing(true);
          toast.success("You are now following this store!");
        } else {
          setIsFollowing(false);
          toast.success("You have unfollowed this store.");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * "store": {
            "id": 1,
            "name": "Gordon Ramsay Restaurant",
            "description": "Desc",
            "avatar_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEYdCw4UTaX_otBCctPusJYHee4Vf7z-cd4Q&s",
            "cover_image_url": null,
            "address": "Son Tay",
            "latitude": "21.03675400",
            "longitude": "105.55241900",
            "phone": "0334333444",
            "email": "tch@tami.com",
            "opening_time": "09:00:00",
            "closing_time": "22:00:00",
            "status": "active",
            "isActive": true,
            "isTempClosed": false,
            "rating": "3.20",
            "total_reviews": 100
        },
   */
  return (
    <>
      {!restaurantData.is_active && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>
            This store is force closed and disabled by Yami staff.
          </AlertTitle>
          <AlertDescription>
            <p>
              We are sorry for the inconvenience. If you need any assistance,
              please make a ticket to our support team directly.
            </p>
            <Link to="/tickets/new">
              <Button variant={"outline"} size={"sm"}>
                <BadgePlus />
                Create a ticket
              </Button>
            </Link>
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link to={`/store/${restaurantData.id}`}>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-card -ml-1 -mr-4 -mb-1 pl-1 pr-4 pb-1 rounded-sm  ">
            {restaurantData.avatar_url && (
              <Avatar className="h-12 w-12 mt-2">
                <img
                  src={restaurantData.avatar_url}
                  alt={restaurantData.name}
                />
              </Avatar>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-lg">{restaurantData.name}</h2>
              </div>
              {/* {JSON.stringify(restaurantData)} */}
              <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-x-4 mt-0.5">
                <Badge
                  variant={
                    restaurantData.is_active
                      ? restaurantData.isTempClosed
                        ? "secondary"
                        : "outline"
                      : "destructive"
                  }
                  className="text-xs px-2"
                >
                  {restaurantData.is_active
                    ? restaurantData.isTempClosed
                      ? "Closed"
                      : "Accepting orders"
                    : "Disabled"}
                </Badge>
                {/* <HorizontalProperties
                  icon={
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  }
                  value={restaurantData.rating}
                /> */}
                <HorizontalProperties
                  icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
                  value={formatDistance(distance)}
                />
                <HorizontalProperties
                  icon={<Clock2 className="h-4 w-4 text-muted-foreground" />}
                  value={`${formatHours(
                    restaurantData.opening_time
                  )} - ${formatHours(restaurantData.closing_time)}`}
                />
              </div>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-1 self-start sm:self-center">
          {restaurantData.phone && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() =>
                window.open(`tel:${restaurantData.phone}`, "_blank")
              }
            >
              <Phone className="h-4.5 w-4.5" />
            </Button>
          )}
          <Link to={"/chat/" + restaurantData.id}>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <MessageCircle className="h-4.5 w-4.5" />
            </Button>
          </Link>
          {restaurantData.latitude && restaurantData.longitude && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${restaurantData.latitude},${restaurantData.longitude}`,
                  "_blank"
                )
              }
            >
              <Map className="h-4.5 w-4.5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4.5 w-4.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Flag className="h-4 w-4 mr-2" />
                Report an issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleFollowToggle}
            size="sm"
            className={"px-6 opacity-90 rounded-full border"}
            variant={isFollowing ? "secondary" : "default"}
            disabled={loading}
          >
            {isFollowing ? "Unfollow" : "Follow this store"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FoodDetailStoreHeader;
