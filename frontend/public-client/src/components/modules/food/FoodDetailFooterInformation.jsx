import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock2,
  Heart,
  Share,
  ShoppingBag,
  Star,
  User2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VerticalProperties from "@/components/common/VerticalProperties";
import BigHorizontalProperties from "@/components/common/BigHorizontalProperties";
import FoodDetailStoreHeader from "./FoodDetailStoreHeader";
import { useParams } from "react-router-dom";
import publicDataService from "@/services/publicDataService";
import { toast } from "sonner";

const FoodDetailFooterInformation = ({ foodData }) => {
  //load trang sẽ tìm kiếm dữ liệu xem người này đã save món này chưa

  //sửa trong be khi mà thêm vào sẽ kiểm trong trong db xem người này đã thích món này chưa
  //nếu có thì sẽ xóa đi và gửi lại dữ liệu saved: false, nếu không thì sẽ thêm và gửi saved: true

  const { foodId } = useParams();
  const [save, setSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkIsSaved = async () => {
    setLoading(true);
    try {
      const response = await publicDataService.isSavedFood(foodId);
      if (response.success) {
        if (response.saved) {
          setSave(true);
        } else {
          setSave(false);
        }
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async () => {
    setLoading(true);
    try {
      const response = await publicDataService.addFavoriteFood(foodId);
      if (response.success) {
        if (response.saved) {
          setSave(true);
          toast.success("This product is saved");
        } else {
          setSave(false);
          toast.success("Removed from your saved products");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkIsSaved();
  }, [foodId]);
  return (
    <>
      {/* <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">{foodData.food_name}</h1>
            <div className="flex items-center  text-muted-foreground">
              <span className="text-sm">4.5</span>{" "}
              <Star className="ml-1 w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-sm mx-2 opacity-50"> • </span>
              <span className="text-sm">634 people ordered</span>{" "}
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
      </div> */}
      <FoodDetailStoreHeader foodData={foodData} />

      <div className="flex items-center gap-2 mt-3">
        <Button
          onClick={handleFavoriteToggle}
          className={"border-none"}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          {save ? (
            <>
              <Heart className={`h-4 w-4 fill-red-500 text-red-500`} />
              Remove from saved foods
            </>
          ) : (
            <>
              <Heart className={`h-4 w-4`} />
              Save this food
            </>
          )}
        </Button>
        {/* <Button
          variant="outline"
          size="sm"
          className="px-3 flex gap-1 border-none"
        >
          <Share className="h-4 w-4" />
          Share
        </Button> */}
      </div>
      <Separator className="my-4" />
      <div className="p-4 border rounded-lg overflow-hidden bg-card/50">
        <h2 className="text-md font-semibold mb-1">About this dish</h2>
        <p className="text-md leading-relaxed text-muted-foreground">
          {foodData.description ||
            "Delicious food prepared with fresh ingredients and traditional cooking methods."}
        </p>
      </div>
      <div className="flex gap-3 items-start">
        {foodData.preparation_time && (
          <BigHorizontalProperties
            icon={<Clock2 />}
            value={`${foodData.preparation_time} min`}
            title="Preparation Time"
          />
        )}
        {foodData?.metrics?.number_of_orders > 0 && (
          <BigHorizontalProperties
            icon={<ShoppingBag />}
            value={`${foodData?.metrics?.number_of_orders} times`}
            title="Ordered"
          />
        )}
        {foodData?.metrics?.number_of_people_ordered > 0 && (
          <BigHorizontalProperties
            icon={<Users />}
            value={`${foodData?.metrics?.number_of_people_ordered} people`}
            title="Ordered by"
          />
        )}
        {foodData?.metrics?.number_of_favorites > 0 && (
          <BigHorizontalProperties
            icon={<Heart />}
            value={`${foodData?.metrics?.number_of_favorites} people like this`}
            title="Favorites"
          />
        )}
      </div>
      {/* <pre>
        <code>{JSON.stringify(foodData, null, 2)}</code>
      </pre> */}
    </>
  );
};

export default FoodDetailFooterInformation;
