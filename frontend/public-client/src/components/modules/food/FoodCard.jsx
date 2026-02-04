import { formatDistance, formatPrice } from "@/utils/formatter";
import {
  Clock2,
  DivideCircle,
  MapPin,
  MapPinned,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function FoodCard({ food, horizontal, horizontalContainer, className = "" }) {
  const Properties = ({ icon, value, className = "" }) => {
    if (!value || value === undefined) return null;
    return (
      <div className={`flex items-center space-x-1.5 p-0 m-0 ${className}`}>
        {icon}
        <span>{value}</span>
      </div>
    );
  };

  const isOrderNew = (createdAt) => {
    if (!createdAt) return false;
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays < 7;
  };

  return (
    <div
      className={`rounded-lg bg-card border overflow-hidden ${
        horizontal
          ? "flex gap-0 " + (horizontalContainer ? "min-w-lg" : "h-38")
          : horizontalContainer && "min-w-sm"
      } ${className}`}
    >
      <img
        src={food?.image_url}
        alt={food?.food_name}
        className={`w-full object-cover ${horizontal ? "h-38 w-24" : "h-48"}`}
      />
      <div
        className={`pb-4 flex flex-col w-full ${horizontal ? "p-4" : "p-4"}`}
      >
        <div className="flex items-center justify-between">
          <Link to={`/food/${food?.food_id}`} className="w-full">
            <p className="text-xl font-semibold mb-0 hover:underline link-underline-primary hover:text-primary">
              {food?.food_name}
            </p>
          </Link>

          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-primary">
              {food?.is_on_sale
                ? formatPrice(food?.sale_price || food?.base_price)
                : formatPrice(food?.base_price)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 p-0 m-0">
            {food?.store?.avatar_url && (
              <img
                className="h-5 w-5 rounded-full"
                src={food?.store?.avatar_url}
              />
            )}
            <Link to={`/store/${food?.store_id}`} className="w-full">
              <span className="opacity-75 text-md hover:text-primary">
                {food?.store?.name}
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {food?.is_on_sale && (
              <span className="text-sm line-through text-muted-foreground">
                {formatPrice(food?.base_price)}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-1">
          {isOrderNew(food?.created_at) && (
            <Properties icon={<Sparkles className="h-4 w-4" />} value={`New`} />
          )}
          {food?.preparation_time && (
            <Properties
              icon={<Clock2 className="h-4 w-4 text-muted-foreground" />}
              value={`${food?.preparation_time} min`}
            />
          )}

          {food?.distance !== undefined && (
            <Properties
              icon={<MapPinned className="h-4 w-4 text-muted-foreground" />}
              value={
                food?.distance === 0 ? "Nearby" : formatDistance(food?.distance)
              }
            />
          )}
          {food?.metrics && (
            <>
              {/* <Properties
                icon={<Star className="h-4 w-4 text-muted-foreground" />}
                value={`${parseFloat(food?.metrics?.average_rating).toFixed(
                  1
                )} (${food?.metrics?.number_of_ratings})`}
              /> */}
              {food?.metrics?.number_of_orders > 0 && (
                <Properties
                  icon={
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  }
                  value={food?.metrics?.number_of_orders + " ordered"}
                />
              )}
            </>
          )}
        </div>
        {/* <pre>
          <code>{JSON.stringify(food, null, 2)}</code>
        </pre> */}
      </div>
    </div>
  );
}

export default FoodCard;
