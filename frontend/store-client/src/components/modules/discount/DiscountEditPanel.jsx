import FormTile from "@/components/common/FormTile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { discountService } from "@/services/discountService";
import { toast } from "sonner";
import {
  ArrowDownFromLine,
  ArrowUpToLine,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarCheck2,
  CalendarX2,
  ChevronDown,
  Code,
  DecimalsArrowRight,
  DollarSign,
  Eye,
  EyeOff,
  Info,
  Percent,
  Save,
  ShoppingBag,
  TagIcon,
  TicketCheck,
  ToggleLeft,
  Truck,
  UserCheck,
  Users,
  Users2,
  X,
} from "lucide-react";
import React, { useEffect, useCallback, useState } from "react";
import DateTimeInput from "@/components/common/DateTimeInput";
import { validateDiscount } from "@/utils/validators";

function DiscountEditPanel({
  selectedDiscount,
  setSelectedDiscount,
  onDataChange,
  isCreating = false,
  setIsCreating,
}) {
  const [discounts, setDiscounts] = useState(() => {
    if (isCreating) {
      return {
        is_active: true,
        is_hidden: false,
        discount_type: "fixed_amount",
        discount_sale_type: "items",
        discount_value: "0",
        max_discount_amount: "0",
        is_price_condition: false,
        min_price_condition: "0",
        usage_limit: 100,
        is_limit_usage_per_user: false,
        allow_usage_per_user: 1,
        valid_from: new Date().toISOString().split("T")[0],
        valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };
    }
    return {};
  });

  const [originalDiscount, setOriginalDiscount] = useState({});
  const [loading, setLoading] = useState(!isCreating);
  const [isHaveChanges, setIsHaveChanges] = useState(isCreating);
  const [isSaving, setIsSaving] = useState(false);

  const fetchDiscount = useCallback(async () => {
    if (isCreating) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await discountService.getDiscountById(selectedDiscount);

      if (response.success) {
        const discountData = response.data || {};
        setDiscounts(discountData);
        setOriginalDiscount(JSON.parse(JSON.stringify(discountData)));
      } else {
        console.error(response.message || "Failed to load discount");
      }
    } catch (error) {
      console.error("Error fetching discount:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDiscount, isCreating]);

  const saveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      let response;

      if (isCreating) {
        response = await discountService.createDiscount(discounts);
        if (response.success) {
          setIsCreating(false);
          if (response.data?.discount_id) {
            setSelectedDiscount(response.data.discount_id);
          }
        }
      } else {
        response = await discountService.updateDiscount(
          selectedDiscount,
          discounts
        );
      }

      if (response.success) {
        setOriginalDiscount(JSON.parse(JSON.stringify(discounts)));
        setIsHaveChanges(false);

        if (onDataChange) {
          onDataChange();
        }
      } else {
        toast.error(response.message || "Failed to save changes");
      }
    } catch (error) {
      toast.error("Error saving changes");
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    discounts,
    selectedDiscount,
    onDataChange,
    isCreating,
    setIsCreating,
    setSelectedDiscount,
  ]);

  useEffect(() => {
    if (isCreating) {
      setLoading(false);
    } else if (selectedDiscount) {
      fetchDiscount();
    }
  }, [fetchDiscount, selectedDiscount, isCreating]);

  useEffect(() => {
    if (isCreating) {
      setIsHaveChanges(true);
    } else if (Object.keys(originalDiscount).length > 0) {
      const currentJson = JSON.stringify(discounts);
      const originalJson = JSON.stringify(originalDiscount);
      setIsHaveChanges(currentJson !== originalJson);
    } else {
      setIsHaveChanges(false);
    }
  }, [discounts, originalDiscount, isCreating]);

  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
    } else {
      setDiscounts(originalDiscount);
      setIsHaveChanges(false);
    }
  };

  const panelTitle = isCreating
    ? "Create New Discount"
    : selectedDiscount === null
    ? "Select a discount to view details"
    : "Edit Discount";

  const [openIssue, setOpenIssue] = useState(true);

  return (
    <div className="h-full flex flex-col">
      {/* <pre>
        <code>
          {JSON.stringify(discounts, null, 2)}
        </code>
      </pre> */}
      {!isCreating && selectedDiscount === null ? (
        <div className="flex items-center justify-center h-full mt-20">
          <p>Select a discount to view details</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading discount...</p>
        </div>
      ) : (
        <>
          <div className="px-4 py-2 border-b">
            <h2 className="text-lg font-medium">{panelTitle}</h2>
          </div>
          <ScrollArea className="flex-1 h-full">
            <div className="flex-1 flex flex-col space-y-2 p-4">
              <p className="text-sm font-medium px-2 pt-2">Basics</p>
              <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full">
                <FormTile
                  icon={<ToggleLeft />}
                  title="Is Active"
                  description="Toggle the active status of the discount"
                  action={
                    <Switch
                      id="is_active"
                      checked={discounts?.is_active || false}
                      onCheckedChange={(checked) =>
                        setDiscounts({
                          ...discounts,
                          is_active: checked,
                        })
                      }
                    />
                  }
                />
                <FormTile
                  icon={discounts?.is_hidden ? <EyeOff /> : <Eye />}
                  title="Visibility"
                  description={
                    discounts?.is_hidden
                      ? "Hidden (code required)"
                      : "Public (visible to all users)"
                  }
                  action={
                    <Switch
                      id="is_hidden"
                      checked={!discounts?.is_hidden}
                      onCheckedChange={(checked) =>
                        setDiscounts({
                          ...discounts,
                          is_hidden: !checked,
                        })
                      }
                    />
                  }
                />
                <FormTile
                  icon={<Code />}
                  title="Discount Code"
                  description="Set the code for the discount"
                  action={
                    <div className="w-48 flex gap-2 items-center">
                      <Input
                        id="code"
                        type="text"
                        value={discounts?.code || ""}
                        onChange={(e) =>
                          setDiscounts({
                            ...discounts,
                            code: e.target.value,
                          })
                        }
                      />
                    </div>
                  }
                />
                <FormTile
                  icon={<TagIcon />}
                  title="Discount Name"
                  description="Set the name for the discount"
                  action={
                    <div className="w-48 flex gap-2 items-center">
                      <Input
                        id="discount_name"
                        type="text"
                        value={discounts?.discount_name || ""}
                        onChange={(e) =>
                          setDiscounts({
                            ...discounts,
                            discount_name: e.target.value,
                          })
                        }
                      />
                    </div>
                  }
                />
                <FormTile
                  icon={<Info />}
                  title="Description"
                  description="Set the description for the discount"
                  action={
                    <div className="w-48 flex gap-2 items-center">
                      <Textarea
                        id="description"
                        value={discounts?.description || ""}
                        onChange={(e) =>
                          setDiscounts({
                            ...discounts,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  }
                />
              </div>
              <p className="text-sm font-medium px-2 pt-4">Applicable</p>
              <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full mt-2">
                <FormTile
                  icon={<TagIcon />}
                  title="Discount Type"
                  description="Select the type of discount"
                  action={
                    <Select
                      id="discount_type"
                      value={discounts?.discount_type || ""}
                      onValueChange={(value) =>
                        setDiscounts({
                          ...discounts,
                          discount_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed_amount">
                          <BanknoteArrowDown />
                          Fixed Amount
                        </SelectItem>
                        <SelectItem value="percentage">
                          <Percent />
                          Percentage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
                <FormTile
                  icon={<DecimalsArrowRight />}
                  title="Discount Value"
                  description="Set the value for the discount"
                  action={
                    <div className="w-36 flex gap-2 items-center">
                      <Input
                        id="discount_value"
                        type="number"
                        value={discounts?.discount_value || ""}
                        onChange={(e) =>
                          setDiscounts({
                            ...discounts,
                            discount_value: e.target.value,
                          })
                        }
                      />
                      <span className="text-sm">
                        {discounts?.discount_type === "percentage" ? "%" : "đ"}
                      </span>
                    </div>
                  }
                />
                {discounts?.discount_type === "percentage" && (
                  <FormTile
                    icon={<ArrowDownFromLine />}
                    title="Max Discount Amount"
                    description="Set the maximum value for the discount"
                    action={
                      <div className="w-36 flex gap-2 items-center">
                        <Input
                          id="max_discount_amount"
                          type="number"
                          value={discounts?.max_discount_amount || ""}
                          onChange={(e) =>
                            setDiscounts({
                              ...discounts,
                              max_discount_amount: e.target.value,
                            })
                          }
                        />
                        <span className="text-sm">đ</span>
                      </div>
                    }
                  />
                )}
                <FormTile
                  icon={<TicketCheck />}
                  title="Apply To"
                  description="Select where the discount applies"
                  action={
                    <Select
                      id="discount_sale_type"
                      value={discounts?.discount_sale_type || ""}
                      onValueChange={(value) =>
                        setDiscounts({
                          ...discounts,
                          discount_sale_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select apply to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">
                          <Truck />
                          Delivery
                        </SelectItem>
                        <SelectItem value="items">
                          <ShoppingBag />
                          Items
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  }
                />
              </div>
              <p className="text-sm font-medium px-2 pt-4">Usage</p>
              <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full mt-2">
                <FormTile
                  icon={<Users2 />}
                  title="Usage Limit"
                  description="Set the maximum number of times this discount can be used"
                  action={
                    <Input
                      id="usage_limit"
                      type="number"
                      value={discounts?.usage_limit || ""}
                      className={"w-18"}
                      onChange={(e) =>
                        setDiscounts({
                          ...discounts,
                          usage_limit: e.target.value,
                        })
                      }
                    />
                  }
                />
                <FormTile
                  icon={<ArrowUpToLine />}
                  title="Limit Usage Per User"
                  description="Limit how many times each user can use this discount"
                  action={
                    <Switch
                      id="is_limit_usage_per_user"
                      checked={discounts?.is_limit_usage_per_user || false}
                      onCheckedChange={(checked) =>
                        setDiscounts({
                          ...discounts,
                          is_limit_usage_per_user: checked,
                        })
                      }
                    />
                  }
                />
                {discounts?.is_limit_usage_per_user && (
                  <FormTile
                    icon={<UserCheck />}
                    title="Uses Per User"
                    description="Maximum number of times each user can use this discount"
                    action={
                      <Input
                        id="allow_usage_per_user"
                        type="number"
                        className={"w-18"}
                        value={discounts?.allow_usage_per_user || "1"}
                        onChange={(e) =>
                          setDiscounts({
                            ...discounts,
                            allow_usage_per_user: e.target.value,
                          })
                        }
                      />
                    }
                  />
                )}
                <FormTile
                  icon={<CalendarCheck2 />}
                  title="Valid From"
                  description="Set the start date for the discount"
                  action={
                    <DateTimeInput
                      label="Valid From"
                      date={discounts?.valid_from || ""}
                      setDate={(date) => {
                        setDiscounts({
                          ...discounts,
                          valid_from: date,
                        });
                      }}
                    />
                  }
                />
                <FormTile
                  icon={<CalendarX2 />}
                  title="Valid To"
                  description="Set the end date for the discount"
                  action={
                    // 2025-07-14 14:00:00
                    <DateTimeInput
                      label="Valid To"
                      date={discounts?.valid_to || ""}
                      setDate={(date) => {
                        setDiscounts({
                          ...discounts,
                          valid_to: date,
                        });
                      }}
                    />
                  }
                />
              </div>
              <p className="text-sm font-medium px-2 pt-4">Conditions</p>
              <div className="space-y-0.5 rounded-lg border border-card overflow-hidden w-full mt-2 mb-32">
                <FormTile
                  icon={<BanknoteArrowUp />}
                  title="Price Minimum Condition"
                  description="Set the minimum price of the order condition for the discount"
                  action={
                    <Switch
                      id="is_price_condition"
                      checked={discounts?.is_price_condition || false}
                      onCheckedChange={(checked) =>
                        setDiscounts({
                          ...discounts,
                          is_price_condition: checked,
                        })
                      }
                    />
                  }
                />
                {discounts?.is_price_condition && (
                  <FormTile
                    icon={<DollarSign />}
                    title="Minimum Price"
                    description="Set the minimum price for the order condition"
                    action={
                      <div className="w-36 flex gap-2 items-center">
                        <Input
                          id="min_price_condition"
                          type="number"
                          value={discounts?.min_price_condition || ""}
                          onChange={(e) =>
                            setDiscounts({
                              ...discounts,
                              min_price_condition: e.target.value,
                            })
                          }
                        />
                        <span className="text-sm">đ</span>
                      </div>
                    }
                  />
                )}
              </div>
            </div>
          </ScrollArea>
        </>
      )}

      <div
        className={`fixed bottom-4 right-4 transform transition-transform duration-300 bg-card border py-2 rounded-lg pl-3 pr-2 flex flex-col gap-2 items-start shadow-lg ${
          (isHaveChanges && (selectedDiscount !== null || isCreating)) ||
          (!validateDiscount(discounts).isValid && selectedDiscount !== null)
            ? "-translate-y-1"
            : "translate-y-200"
        }`}
      >
        {!validateDiscount(discounts).isValid && (
          <>
            <div
              className="flex-1 justify-start flex-col items-start cursor-pointer hover:bg-muted/50 rounded-lg w-full border"
              onClick={() => setOpenIssue(!openIssue)}
            >
              <div className="flex items-center justify-between p-2">
                <p className="text-sm font-semibold">Issues</p>
                <ChevronDown className="w-4 h-4" />
              </div>
              {openIssue && (
                <div className="p-2 border-t">
                  {validateDiscount(discounts).errors.map((item) => (
                    <p
                      key={item}
                      className="text-sm text-destructive flex items-center gap-1"
                    >
                      <X className="inline h-4 w-4 mr-1" />
                      {item}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex items-center gap-2 justify-end w-full">
          <Button variant="link" onClick={handleCancel}>
            {isCreating ? "Cancel" : "Discard"}
          </Button>
          <Button
            variant="default"
            disabled={
              !isHaveChanges ||
              isSaving ||
              validateDiscount(discounts).isValid === false
            }
            onClick={saveChanges}
          >
            {!isSaving && <Save className="h-4 w-4 mr-2" />}
            {isSaving
              ? "Saving..."
              : isCreating
              ? "Create Discount"
              : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DiscountEditPanel;
