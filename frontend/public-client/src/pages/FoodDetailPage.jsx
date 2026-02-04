import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import publicDataService from "../services/publicDataService";
import FoodDetailStoreHeader from "../components/modules/food/FoodDetailStoreHeader";
import FoodDetailRightPanel from "../components/modules/food/FoodDetailRightPanel";
import FoodDetailFooterInformation from "../components/modules/food/FoodDetailFooterInformation";
import FoodDetailReview from "../components/modules/food/FoodDetailReview";
import { toast } from "sonner";
import { DetailBreadcrumb } from "@/components/modules/common/DetailBreadcrumb";
import FoodDetailRightInformation from "@/components/modules/food/FoodDetailRightInformation";
import SetTitle from "@/components/common/SetTitle";

const FoodDetailPage = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (!foodId) {
        navigate("/food");
        return;
      }

      setLoading(true);
      try {
        const result = await publicDataService.getFoodDetails(foodId);
        console.log("Food details fetched:", result);
        if (result.success) {
          setFoodData(result.data);
        } else {
          toast.error(result.message || "Failed to load food details");
          navigate("/food");
        }
      } catch (error) {
        toast.error("Failed to load food details", error);
        navigate("/food");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodId, navigate]);

  if (loading) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 gap-y-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="aspect-[16/10] animate-pulse bg-muted rounded-xl"></div>
            <div className="space-y-3">
              <div className="h-8 bg-muted animate-pulse rounded"></div>
              <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!foodData) {
    return null;
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 justify-center">
      <SetTitle title={`${foodData?.food_name}`} />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-8 gap-y-8 ">
        <div className="lg:col-span-3 space-y-4">
          <DetailBreadcrumb
            data={[
              { name: "Food", link: "/food" },
              { name: foodData.food_name, link: `/food/${foodId}` },
            ]}
          />
          <div className="rounded-xl overflow-hidden bg-gradient-to-br from-muted/80 to-muted shadow-sm text-right">
            {!imageLoaded && <div className="animate-pulse bg-muted"></div>}
            <img
              src={foodData.image_url}
              alt={foodData.food_name}
              className="max-h-[60vh] w-full object-cover rounded-t-xl"
            />
          </div>
          <FoodDetailFooterInformation foodData={foodData} />
        </div>
        <div className="lg:col-span-2 space-y-4 lg:sticky mt-8.5">
          <FoodDetailRightInformation foodData={foodData} />
          <FoodDetailRightPanel foodData={foodData} />
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPage;
