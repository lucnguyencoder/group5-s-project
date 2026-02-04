import FoodList from "@/components/modules/food/FoodList";
import FoodFilterPanel from "@/components/modules/food/FoodFilterPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import SetTitle from "@/components/common/SetTitle";

function FoodListPage() {
  const [filter, setFilter] = useState({
    // sortBy: "food_name",
    latitude: null,
    longitude: null,
    search: "",
    priceStart: null,
    priceEnd: null,
    minPrepareTime: null,
    maxPrepareTime: null,
    page: 1,
  });

  // const handleSortChange = (value) => {
  //   setFilter({ ...filter, sortBy: value, page: 1 });
  // };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
      <SetTitle title="Foods" />
      <FoodFilterPanel filter={filter} setFilter={setFilter} />
      <div className="flex-1">
        {/* <div className="flex items-center gap-4 mb-6">
          <Label className="text-lg font-semibold">Sort by</Label>
          <Select value={filter.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food_name">Name</SelectItem>
              <SelectItem value="number_of_orders">Orders</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
        <FoodList query={filter} />
      </div>
    </div>
  );
}

export default FoodListPage;
