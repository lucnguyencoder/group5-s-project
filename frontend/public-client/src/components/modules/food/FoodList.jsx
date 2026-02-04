import publicDataService from "@/services/publicDataService";
import React, { useEffect, useState } from "react";
import FoodCard from "./FoodCard";
import FoodContainer from "./FoodContainer";

function FoodList({
  query,
  horizontal = false,
  horizontalContainer = false,
  maxRow = null,
}) {
  const [foodList, setfoodList] = useState([]);

  const fetchFoodList = async () => {
    try {
      const response = await publicDataService.getFoods(query);
      console.log("Food list fetch response:", response);
      setfoodList(response.data || []);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, [query]);

  return (
    <div className="p-2 space-y-8 overflow-hidden">
      <FoodContainer
        list={foodList}
        horizontal={horizontal}
        horizontalContainer={horizontalContainer}
        maxRow={maxRow}
      />
    </div>
  );
}

export default FoodList;
