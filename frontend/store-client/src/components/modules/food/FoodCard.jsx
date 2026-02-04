import PrivateComponents from "@/components/layout/PrivateComponents";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatter";
import { Pen } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function FoodCard({ food }) {
  /**
   *
   * {"food_id":8,"store_id":1,"category_id":1,"food_name":"Premium Pizza","description":"Pizza (phát âm tiếng Ý: [ˈpittsa], phát âm tiếng Latinh: [pi˧ zaː˧]) là một loại bánh dẹt, tròn được chế biến từ bột mì, nấm men,... sau khi đã được ủ bột để nghỉ ít nhất 24 tiếng đồng hồ và nhào nặn thành loại bánh có hình dạng tròn và dẹt, và được cho vào lò nướng chín trước khi ăn.","base_price":"2000000.00","is_on_sale":true,"sale_price":"1650000.00","image_url":"https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/food-images/store-1/22ba32a83e1bee4177a6a233805e306c.jpg","is_available":true,"preparation_time":30,"max_allowed_quantity":100,"created_at":"2025-06-27 01:32:09","updated_at":"2025-07-05 15:55:29"}
   */
  return (
    <div className="flex items-center justify-between p-3 rounded-xs sidebar">
      <div className="flex items-center space-x-2">
        {food.image_url && (
          <img
            src={food.image_url}
            alt={food.food_name}
            className="h-12 w-16 object-cover rounded-md"
          />
        )}
        <div className="ml-2">
          <p className="text-md font-medium">{food.food_name}</p>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">
              {food.is_on_sale
                ? formatCurrency(food.sale_price)
                : formatCurrency(food.base_price)}
            </span>
          </div>
          {/* {JSON.stringify(food)} */}
        </div>
      </div>
      <PrivateComponents url="/api/store/foods/:foodId" method="PUT">
        <Link to={`/food/edit/${food.food_id}`}>
          <Button size="icon" variant={"ghost"}>
            <Pen />
          </Button>
        </Link>
      </PrivateComponents>
    </div>
  );
}

export default FoodCard;
