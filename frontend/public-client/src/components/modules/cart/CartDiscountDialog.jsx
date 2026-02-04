import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import publicDataService from "@/services/publicDataService";
import {
  EyeOff,
  Plus,
  ShoppingBag,
  Ticket,
  TicketX,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import DiscountCard from "../store/elements/DiscountCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/utils/formatter";

export function CartDiscountDialog({
  discountCode,
  setDiscountCode,
  storeId,
  currentDiscount,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [manualDiscountCode, setManualDiscountCode] = useState("");

  useEffect(() => {
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
    if (storeId) {
      fetchDiscounts();
    }
  }, [storeId]);

  

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={"w-full flex item-center justify-between h-auto"}
          >
            {!discountCode ? (
              <div className="flex items-center gap-4">
                <div className="border-dashed border-1 rounded-sm w-10 h-8 flex items-center justify-center">
                  <Plus />
                </div>
                Add discount
              </div>
            ) : (
              <>
                <div
                  className={`flex items-center gap-4 px-2 ${
                    !currentDiscount?.accepted && "opacity-50"
                  }`}
                >
                  {/* <div className="border-1 rounded-sm px-3 h-10 flex items-center justify-center bg-primary/20 border-primary/20">
                  {currentDiscount?.data?.discount_sale_type === "delivery" ? (
                    <Truck className="w-10 h-10 text-primary" size={24} />
                  ) : (
                    <ShoppingBag className="w-10 h-10 text-primary" size={24} />
                  )}
                  <span className="text-sm text-medium ml-2">
                    -
                    {currentDiscount?.data?.discount_type === "percentage"
                      ? `${currentDiscount?.data?.discount_value}%`
                      : currentDiscount?.data?.discount_value / 1000 + "K"}
                  </span>
                </div> */}
                  <Ticket className="scale-125 text-primary" size={24} />
                  <div className="flex flex-col items-start ml-2">
                    <p className="text-sm font-semibold">
                      {/* Discount */}
                      {currentDiscount?.data?.code}
                    </p>
                    <p className="text-xs text-muted-foreground font-normal">
                      {!currentDiscount?.accepted &&
                      currentDiscount?.decline_reason !== null ? (
                        currentDiscount?.decline_reason
                      ) : (
                        <>
                          {/* {currentDiscount?.data?.is_price_condition
                            ? `when order higher than ${formatPrice(
                                currentDiscount?.data?.min_price_condition
                              )}`
                            : "for any order"}
                          {currentDiscount?.data?.discount_type ===
                            "percentage" &&
                            ", up to " +
                              formatPrice(
                                currentDiscount?.data?.max_discount_amount
                              )} */}

                          <p className="text-xs text-muted-foreground font-normal">
                            -
                            {currentDiscount?.data?.discount_type ===
                            "percentage"
                              ? `${currentDiscount?.data?.discount_value}%`
                              : currentDiscount?.data?.discount_value / 1000 +
                                "k"}
                            {currentDiscount?.data?.discount_sale_type ===
                            "delivery"
                              ? " shipping fee"
                              : " orders amount"}
                          </p>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <p className="ml-auto text-sm text-muted-foreground font-medium mr-2">
                  {/* {formatPrice(data?.courier?.fee || 0)} */}
                  {currentDiscount?.accepted
                    ? "- " + formatPrice(currentDiscount?.discountedPrice || 0)
                    : discountCode && "Rejected"}
                </p>
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className={"gap-0 outline-none z-1000"}>
          <DialogHeader className={"mb-4"}>
            <DialogTitle>Choose your discount!</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            "Loading promotions..."
          ) : (
            <ScrollArea className="gap-4 w-full max-h-[60vh] space-y-4">
              {discounts.length > 0 &&
                discounts.map((discount) => (
                  <div className="py-1 pl-2 pr-3">
                    <DiscountCard
                      data={discount}
                      key={discount.discount_id}
                      onClick={() => {
                        setDiscountCode(discount.code);
                      }}
                    />
                  </div>
                ))}
            </ScrollArea>
          )}
          <div className="p-4 border-primary/20 bg-primary/10 border flex items-center justify-between rounded-md gap-2">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-md">The discount code is secret?</p>
                <p className="text-sm text-muted-foreground">
                  You can entered it here.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input
                id="discount-code"
                className={"w-24"}
                onChange={(e) => {
                  setManualDiscountCode(e.target.value);
                }}
                value={manualDiscountCode}
                placeholder="ABC123"
              />
              <DialogClose asChild>
                <Button
                  variant="default"
                  onClick={() => {
                    setDiscountCode(manualDiscountCode);
                    setManualDiscountCode("");
                  }}
                >
                  Apply
                </Button>
              </DialogClose>
            </div>
          </div>
          <DialogFooter className={"flex justify-end mt-6"}>
            {discountCode !== null && (
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2 mr-auto"
                  onClick={() => {
                    setDiscountCode(null);
                    setManualDiscountCode("");
                  }}
                >
                  <TicketX />
                  Cancel using discount
                </Button>
              </DialogClose>
            )}
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
