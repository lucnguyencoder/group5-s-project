import publicDataService from "@/services/publicDataService";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FoodContainer from "./FoodContainer";

export const FeatureFood = () => {
  const storeId = useParams().storeId;
  const [featuredFoods, setFeaturedFoods] = useState([]);
  const fetchData = async () => {
    try {
      const response = await publicDataService.getFeatureFood(storeId);
      console.log("Feature foods response:", response);
      const mappedData = response.data.map((item) => ({
        category: item.category,
        foods: item.category.foods.map((food) => ({
          ...food,
          store: item.store,
        })),
      }));
      setFeaturedFoods(mappedData || []);
      console.log("Featured foods fetched:", mappedData);
    } catch (error) {
      console.error("Error fetching feature foods:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [storeId]);
  return (
    <div className="w-full flex flex-col space-y-4 h-full">
      {featuredFoods.length > 0 ? (
        featuredFoods.map((item) => (
          <>
            <FoodContainer
              title={` ${item.category.category_name} (${item.foods.length})`}
              description={item?.category?.description}
              list={item.foods}
              horizontal={false}
              horizontalContainer={false}
              maxRow={1}
            />
          </>
        ))
      ) : (
        <div className="flex justify-center items-center h-full">
          <h1 className="text-2xl font-bold ">No featured foods available.</h1>
        </div>
      )}
    </div>
  );
};
