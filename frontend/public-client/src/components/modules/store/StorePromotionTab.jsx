import publicDataService from "@/services/publicDataService";
import React, { useEffect, useState } from "react";
import DiscountCard from "./elements/DiscountCard";
import { ArchiveX, Box } from "lucide-react";

function StorePromotionTab({ storeId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const response = await publicDataService.getStorePromotions(storeId);
      setDiscounts(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchDiscounts();
    }
    console.log("Store ID:", discounts);
  }, [storeId]);

  return (
    <div className="w-full">
      {isLoading ? (
        "Loading promotions..."
      ) : (
        <div>
          {discounts.length > 0 &&
          discounts !== null &&
          discounts !== undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
              {discounts.map((discount) => (
                <DiscountCard data={discount} key={discount.discount_id} />
              ))}
            </div>
          ) : (
            <div className="text-center flex flex-col items-center justify-center gap-6 py-20">
              <ArchiveX className="w-12 h-12" />
              Currently no promotions available for this store.
              <br /> Please come back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default StorePromotionTab;
