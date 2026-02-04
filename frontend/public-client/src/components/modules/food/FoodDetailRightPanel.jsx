import React, { useState, useContext, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Minus,
  ChevronDown,
  Percent,
  Store,
  Bike,
  FileWarning,
  CircleAlert,
} from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { toast } from "sonner";

const FoodDetailRightPanel = ({ foodData }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { addToCart } = useContext(CartContext);

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("vi-VN");
  };

  useEffect(() => {
    let defCheck = [];
    if (foodData.foodGroups) {
      for (const group of foodData.foodGroups) {
        for (const option of group.groupOptions) {
          // console.log("Checking option:", option);
          if (option.is_default) {
            defCheck.push(option.option_id);
          }
        }
      }
    }
    setSelectedOptions(defCheck);
  }, [foodData.foodGroups]);

  const [validatorList, setValidatorList] = useState([]);

  const getValidationList = (selectedOptions) => {
    const groups = foodData.foodGroups || [];
    const validatorRes = groups.map((group) => {
      const groupId = group.group_id;
      const selectedOptionsInGroup = selectedOptions.filter((id) =>
        group.groupOptions.some((opt) => opt.option_id === id)
      );
      const min = group.min_selections || 0;
      const max = group.max_selections || Infinity;
      const req = group.is_required || false;
      const isRequired = group.is_required || false;
      let error = false;
      const selectedCount = selectedOptionsInGroup.length;
      if (selectedCount < min || selectedCount > max) {
        if (!req && selectedCount === 0) {
          error = false;
        } else {
          error = true;
        }
      }
      return {
        group_id: groupId,
        min,
        max,
        is_required: isRequired,
        selectedOptions: selectedOptionsInGroup,
        error,
      };
    });
    return validatorRes;
  };

  useEffect(() => {

    selectedOptions.sort((a, b) => a - b);
    setValidatorList(getValidationList(selectedOptions));
  }, [selectedOptions]);

  const SubmissionBadgeMessage = ({ group }) => {
    const data = validatorList.find((item) => item.group_id === group);
    if (!data) return null;
    const max = data.max;
    const min = data.min;
    const req = data.is_required;
    let error = data.error;
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full flex gap-1 items-center ${error
            ? "bg-destructive/10 text-destructive"
            : req && min === max
              ? "bg-primary/10 text-primary/90"
              : "bg-muted/50 text-muted-foreground"
          }`}
      >
        {req
          ? min === max
            ? `Select ${min} option${min > 1 ? "s" : ""}`
            : min === 0
              ? `Select up to ${max} option${max > 1 ? "s" : ""}`
              : `Select ${min} to ${max} option${max > 1 ? "s" : ""}`
          : min === max
            ? `Uncheck or select ${min} option${min > 1 ? "s" : ""}`
            : min === 0
              ? `Select up to ${max} option${max > 1 ? "s" : ""}`
              : `Uncheck or select ${min} to ${max} option${max > 1 ? "s" : ""}`}
        {error && <CircleAlert className="w-3 h-3" />}
      </span>
    );
  };

  const handleOptionChange = (optionId) => {
    setSelectedOptions((prev) => {
      if (prev.includes(optionId)) {
        return prev.filter((id) => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleSingleOptionChange = (optionId, group) => {
    const groupOptions = group.groupOptions.map((opt) => opt.option_id);
    console.log("Group options:", groupOptions);
    let temp = [...selectedOptions];
    temp = temp.filter((id) => !groupOptions.includes(id));
    temp.push(optionId);
    console.log("Temp after filter:", temp);
    setSelectedOptions(temp);
  };

  const calculateTotal = () => {
    let total =
      parseFloat(
        foodData.is_on_sale ? foodData?.sale_price || foodData?.base_price : foodData?.base_price
      ) * quantity;

    selectedOptions.forEach((optionId) => {
      let option = null;

      if (foodData.foodGroups) {
        for (const group of foodData.foodGroups) {
          const foundOption = group.groupOptions.find(
            (opt) => opt.option_id === optionId
          );
          if (foundOption) {
            option = foundOption;
            break;
          }
        }
      }

      if (option?.additional_price) {
        total += parseFloat(option.additional_price) * quantity;
      }
    });

    return total;
  };

  const handleAddToBasket = () => {
    const cartItem = {
      foodId: foodData.food_id,
      foodName: foodData.food_name,
      image: foodData.food_image,
      price: foodData.is_on_sale ? foodData.sale_price : foodData.base_price,
      quantity,
      selectedOptions,
      total: calculateTotal(),
    };

    addToCart(foodData.store_id, cartItem);
    console.log("Added to basket:", cartItem);
    toast.success("Added to basket successfully!");
  };

  const isShortOption = (option) => {
    return (
      (!option.description || option.description.length < 30) &&
      option.option_name.length < 20
    );
  };

  const areAllOptionsShort = (options) => {
    return options.every(isShortOption);
  };

  return (
    <>
      {/* <pre>
        <code>{JSON.stringify(validatorList, null, 2)}</code>
      </pre> */}
      {foodData.foodGroups && foodData.foodGroups.length > 0 && (
        <div className="pb-4">
          {foodData.foodGroups.map((group) => (
            <div key={group.group_id} className="mb-8 last:mb-0">
              {/* <pre>
                <code>{JSON.stringify(selectedOptions, null, 2)}</code>
              </pre> */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-md">{group.group_name}</h4>
                <SubmissionBadgeMessage group={group.group_id} />
              </div>

              {group.max_selections === 1 && group.is_required ? (
                <RadioGroup
                  defaultValue={group.groupOptions
                    .find((i) => i.is_default)
                    ?.option_id?.toString()}
                  className={
                    areAllOptionsShort(group.groupOptions)
                      ? "grid grid-cols-2 gap-2"
                      : "space-y-0"
                  }
                  onValueChange={(value) => {
                    console.log(value);
                    handleSingleOptionChange(parseInt(value), group);
                  }}
                >
                  {group.groupOptions.map((option) => (
                    <div key={option.option_id}>
                      <Label
                        htmlFor={option.option_id.toString()}
                        className="cursor-pointer bg-transparent border-[1.5px] hover:bg-card flex items-start rounded-lg p-4 h-full transition-all duration-50 has-[[data-state=checked]]:border-primary"
                      >
                        <RadioGroupItem
                          value={option.option_id.toString()}
                          id={option.option_id.toString()}
                          className="hidden"
                        />
                        <div className="w-full flex-col items-start flex gap-1">
                          <p className="text-md font-semibold ">
                            {option.option_name}
                          </p>
                          <span className="text-sm opacity-75 font-normal">
                            {parseFloat(option.additional_price) > 0
                              ? `+${formatPrice(option.additional_price)}₫`
                              : "Free"}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div
                  className={
                    areAllOptionsShort(group.groupOptions)
                      ? "grid grid-cols-2 gap-2"
                      : "space-y-2"
                  }
                >
                  {/* <pre>
                      <code>
                        {JSON.stringify(group, null, 2)}
                      </code>
                    </pre> */}
                  {group.groupOptions.map((option) => (
                    <div key={option.option_id}>
                      <Label
                        htmlFor={option.option_id.toString()}
                        className="cursor-pointer bg-transparent border-[1.5px]  hover:bg-card flex items-start rounded-lg p-4 h-full transition-all duration-50 has-[[data-state=checked]]:border-primary"
                      >
                        <Checkbox
                          id={option.option_id.toString()}
                          checked={selectedOptions.includes(option.option_id)}
                          onCheckedChange={() => {
                            handleOptionChange(option.option_id);
                          }}
                        />
                        <div className="w-full flex-col items-start flex gap-1">
                          <p className="text-md font-semibold ">
                            {option.option_name}
                            {/* {option.is_default ? "Checked" : "Unchecked"} */}
                          </p>
                          <span className="text-sm opacity-75 font-normal">
                            {parseFloat(option.additional_price) > 0
                              ? `+${formatPrice(option.additional_price)}₫`
                              : "Free"}
                          </span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="px-0 py-4">
        <div className="flex justify-between items-center mb-4">
          {/* <pre>
            <code>{JSON.stringify(selectedOptions, null, 2)}</code>
          </pre> */}
          <div>
            <h3 className="text-md font-semibold">Quantity</h3>
            {/* {foodData.max_allowed_quantity && (
              <p className="text-sm text-muted-foreground">
                Store allow up to {foodData.max_allowed_quantity} items
              </p>
            )} */}
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <p className="mx-4">{quantity}</p>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={
                foodData.max_allowed_quantity &&
                quantity >= foodData.max_allowed_quantity
              }
              onClick={() => {
                if (
                  foodData.max_allowed_quantity &&
                  quantity >= foodData.max_allowed_quantity
                ) {
                  toast.error(
                    `Maximum quantity of ${foodData.max_allowed_quantity} reached`
                  );
                } else {
                  setQuantity(quantity + 1);
                }
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* <RadioGroup
          defaultValue="delivery"
          value={shippingMethod}
          onValueChange={setShippingMethod}
          className="flex"
        >
          <Label
            htmlFor="delivery"
            className="cursor-pointer hover:bg-accent/10 flex items-center rounded-lg border p-4 transition-colors w-full
                       has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem value="delivery" id="delivery" className="hidden" />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Bike className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-sm font-medium">Delivery</span>
                  <p className="text-xs text-muted-foreground">2.0 km</p>
                </div>
              </div>
              <p className="text-sm font-medium">+15.000₫</p>
            </div>
          </Label>

          <Label
            htmlFor="pickup"
            className="cursor-pointer hover:bg-accent/10 flex items-center rounded-lg border p-4 transition-colors w-full
                       has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
          >
            <RadioGroupItem value="pickup" id="pickup" className="hidden" />
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-primary" />
                <div>
                  <span className="text-sm font-medium">Pickup</span>
                  <p className="text-xs text-muted-foreground">At restaurant</p>
                </div>
              </div>
              <p className="text-sm font-medium">Free</p>
            </div>
          </Label>
        </RadioGroup> */}
      </div>

      <div className="px-0 mt-2">
        <div className="flex gap-2">
          <Button
            className="flex-1 h-10 text-sm font-semibold rounded-full"
            onClick={handleAddToBasket}
            disabled={validatorList.some((item) => item.error)}
          >
            Add to basket - {formatPrice(calculateTotal())}₫
          </Button>
        </div>
      </div>
    </>
  );
};

export default FoodDetailRightPanel;
