import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ListCollapse,
  Minimize,
  Minus,
  Plus,
  Trash,
} from "lucide-react";
import React, { useState } from "react";

function CartChildrenItem({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("vi-VN");
  };

  const getDisplayPrice = () => {
    if (item.food?.is_on_sale && item?.salePrice) {
      return {
        original: formatPrice(item.price),
        sale: formatPrice(item.salePrice),
        isOnSale: true,
      };
    }
    return {
      original: formatPrice(item.price),
      isOnSale: false,
    };
  };

  const priceInfo = getDisplayPrice();

  return (
    <div className="p-3 rounded-lg">
      <div className="flex items-start gap-3">
        <img
          src={item.food?.image_url}
          alt={item.food?.food_name}
          className="h-20 w-32 rounded-md object-cover flex-shrink-0"
        />
        {/* <pre>
          <code>{JSON.stringify(item, null, 2)}</code>
        </pre> */}
        <div className="flex-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-md truncate">
                  {item.food.food_name}
                </h3>
                {!isExpanded && (
                  <div className="">
                    <p className="text-xs text-muted-foreground">
                      {item.customizationOptions
                        .map((option) => option.option_name)
                        .join(", ")}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full p-1 h-auto w-auto"
                    onClick={onDecreaseQuantity}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <span className="text-sm font-medium mx-1">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full p-1 h-auto w-auto"
                    onClick={onIncreaseQuantity}
                    disabled={
                      item.quantity === item?.food?.max_allowed_quantity
                    }
                  >
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <Button
                    size="icon"
                    variant={"ghost"}
                    className="p-1 h-auto w-auto"
                    onClick={onRemoveItem}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-end ml-2">
                {!isExpanded && (
                  <div className="flex flex-col items-end gap-1">
                    {priceInfo.isOnSale ? (
                      <>
                        <p className="text-sm font-semibold ">
                          {priceInfo.sale}đ
                        </p>
                        <p className="text-xs text-muted-foreground line-through">
                          {priceInfo.original}đ
                        </p>
                      </>
                    ) : (
                      <span className="text-sm font-semibold">
                        {priceInfo.original}đ
                      </span>
                    )}
                  </div>
                )}
                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  size="icon"
                  variant={isExpanded ? "secondary" : "ghost"}
                  className="h-auto w-auto p-1 rounded-sm"
                >
                  <ListCollapse className={`h-4 w-4`} />
                </Button>
              </div>
            </div>

            {isExpanded && (
              <div className="mt-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Price:</span>
                    <span>{formatPrice(item.food.base_price)}đ</span>
                  </div>

                  {item.food.is_on_sale && (
                    <div className="flex justify-between items-center text-sm ">
                      <span>Sale Discount:</span>
                      <span>
                        -
                        {formatPrice(
                          parseFloat(item.food.base_price) -
                          parseFloat(item.food.sale_price)
                        )}
                        đ
                      </span>
                    </div>
                  )}

                  {item.customizationGroups.map((group) => {
                    const groupOptions = item.customizationOptions.filter(
                      (option) => option.group_id === group.group_id
                    );

                    return (
                      <div key={group.group_id} className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">
                          {group.group_name}:
                        </div>
                        {groupOptions.map((option) => {
                          const additionalPrice = parseFloat(
                            option.additional_price
                          );
                          return (
                            <div
                              key={option.option_id}
                              className="flex justify-between items-center text-sm pl-2"
                            >
                              <span>• {option.option_name}</span>
                              <span className="text-muted-foreground">
                                {additionalPrice === 0
                                  ? "+0"
                                  : `+${formatPrice(additionalPrice)}đ`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total ({item.quantity}x):</span>
                      <div className="text-right">
                        {priceInfo.isOnSale ? (
                          <>
                            <div className="text-xs text-muted-foreground line-through">
                              {priceInfo.original}đ
                            </div>
                            <div className="">{priceInfo.sale}đ</div>
                          </>
                        ) : (
                          <span>{priceInfo.original}đ</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartChildrenItem;
