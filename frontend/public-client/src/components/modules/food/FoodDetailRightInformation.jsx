import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock2, Heart, Share, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import VerticalProperties from "@/components/common/VerticalProperties";
import BigHorizontalProperties from "@/components/common/BigHorizontalProperties";
import FoodDetailStoreHeader from "./FoodDetailStoreHeader";
import { getDiscountPercentage } from "@/utils/formatter";

const FoodDetailRightInformation = ({ foodData }) => {
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("vi-VN");
  };

  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">{foodData.food_name}</h1>
            <div className="flex items-center  text-muted-foreground">
              {/* <span className="text-sm">4.5</span>{" "}
              <Star className="ml-1 w-3 h-3 text-amber-400 fill-amber-400" /> */}
              {/* <span className="text-sm mx-2 opacity-50"> • </span> */}
              <span className="text-sm">
                {foodData?.orderedPeople > 0
                  ? `${foodData?.orderedPeople} people ordered`
                  : "New"}
              </span>
              {foodData.is_on_sale &&
                getDiscountPercentage(
                  foodData.base_price,
                  foodData.sale_price
                ) !== null && (
                  <>
                    <span className="text-sm mx-2 opacity-50"> • </span>
                    <span className="text-sm">
                      {getDiscountPercentage(
                        foodData.base_price,
                        foodData.sale_price
                      )}
                      % off
                    </span>
                  </>
                )}
            </div>
          </div>

          <div className="text-left sm:text-right">
            {foodData.is_on_sale && foodData.sale_price ? (
              <>
                <div className="text-xl font-bold text-primary">
                  {formatPrice(foodData.sale_price)}₫
                </div>
                <div className="text-sm text-muted-foreground line-through">
                  {formatPrice(foodData.base_price)}₫
                </div>
              </>
            ) : (
              <div className="text-xl font-bold text-primary">
                {formatPrice(foodData.base_price)}₫
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodDetailRightInformation;
