import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatTimeLeft } from "@/utils/formatter";
import { Info, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
/**
 * "discount_id": 1,
            "store_id": 1,
            "code": "SUMMER25",
            "discount_name": "Summer 2025",
            "description": "Alone can use that discount",
            "discount_type": "percentage",
            "discount_sale_type": "delivery",
            "discount_value": "100.00",
            "max_discount_amount": "5000.00",
            "is_limit_usage_per_user": true,
            "allow_usage_per_user": 1000000,
            "valid_from": "2025-07-18 04:00:00",
            "valid_to": "2025-12-31 21:00:00",
            "usage_limit": 1000000000,
            "is_price_condition": true,
            "min_price_condition": "100000.00",
            "is_active": true,
            "is_hidden": false,
            "created_at": "2025-07-14 18:19:42",
            "updated_at": "2025-07-14 18:19:42"
 */
function DiscountCard({ data, onClick }) {
  const LabelWithData = ({ label, data }) => (
    <div className="mb-2">
      <p className="text-sm font-medium text-primary">{label}</p>
      <p className="text-md text-primary-foreground">{data}</p>
    </div>
  );

  const DetailDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        {!onClick ? (
          <Button
            size={"xs"}
            variant={"outline"}
            className={"rounded-full px-3 py-1"}
          >
            View details
          </Button>
        ) : (
          <Button size="icon" variant="outline" className={"rounded-full"}>
            <Info />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>About this discount</DialogHeader>
        <div>
          <LabelWithData
            label="Code"
            data={<p className="font-mono">{data?.code}</p>}
          />
          <LabelWithData
            label="Discount Name"
            data={<p className="text-lg">{data?.discount_name}</p>}
          />

          <LabelWithData
            label="Description"
            data={<p>{data?.description}</p>}
          />
          <LabelWithData
            label="Valid From"
            // full date time
            data={
              <p>
                {new Date(data?.valid_from).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(data?.valid_from).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            }
          />
          <LabelWithData
            label="Valid To"
            // full date time
            data={
              <p>
                {new Date(data?.valid_to).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(data?.valid_to).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            }
          />
          <LabelWithData
            label="Discount Type"
            data={
              <p className="capitalize">
                {data?.discount_type === "percentage"
                  ? "Percentage"
                  : "Fixed Amount"}
              </p>
            }
          />
          <LabelWithData
            label="Discount on"
            data={
              <p className="capitalize">
                {data?.discount_sale_type === "delivery"
                  ? "Delivery Price"
                  : "Orders Price"}
              </p>
            }
          />
          <LabelWithData
            label="Discount Value"
            data={
              <p className="font-mono">
                {data?.discount_type === "percentage"
                  ? `${data.discount_value}%`
                  : formatPrice(data.discount_value)}
              </p>
            }
          />
          {data?.max_discount_amount && (
            <LabelWithData
              label="Max Discount Amount"
              data={
                <p className="font-mono">
                  {formatPrice(data?.max_discount_amount)}
                </p>
              }
            />
          )}
          <LabelWithData
            label="Usage Limit"
            data={
              <p>
                {data?.usage_limit === 0
                  ? "Unlimited"
                  : data?.usage_limit.toLocaleString()}
              </p>
            }
          />
          {data?.is_limit_usage_per_user && (
            <LabelWithData
              label="Limit Usage Per User"
              data={
                <p>
                  {data?.allow_usage_per_user === 0
                    ? "Unlimited"
                    : data?.allow_usage_per_user.toLocaleString()}
                </p>
              }
            />
          )}
          {data?.is_price_condition && (
            <LabelWithData
              label="Min Price Condition"
              data={
                <p className="font-mono">
                  {data?.min_price_condition
                    ? formatPrice(data.min_price_condition)
                    : "No Minimum Price"}
                </p>
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="relative w-full h-full">
      <Card className="overflow-hidden shadow-none py-0">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full -ml-3"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-background rounded-full -mr-3"></div>
        <div className="bg-gradient-to-r from-primary/3 to-secondary/3 border-border flex items-stretch gap-4">
          <div
            className="px-10 flex flex-col items-center justify-center
            border-r border-dashed
          "
          >
            {data?.discount_sale_type === "delivery" ? (
              <Truck className="w-10 h-10 text-primary" size={24} />
            ) : (
              <ShoppingBag className="w-10 h-10 text-primary" size={24} />
            )}
          </div>
          <div className="flex-1 py-4 pr-4">
            <div className="flex items-center justify-between">
              <p
                variant={"secondary"}
                className="text-sm font-mono font-semibold"
              >
                {data?.code}
              </p>
              <span className="text-sm text-muted-foreground">
                {formatTimeLeft(data?.valid_to)}
              </span>
            </div>

            <h3 className="font-semibold text-foreground text-lg">
              {data?.discount_name}
            </h3>

            <p className="text-sm font-medium text-muted-foreground mb-2">
              {/* {data?.is_limit_usage_per_user
                ? `${data?.allow_usage_per_user} Usage per User`
                : "Unlimited Usage"}{" "} */}
              {data?.is_price_condition
                ? `when order higher than ${formatPrice(
                    data.min_price_condition
                  )}`
                : "for any order"}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-end">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.discount_type === "percentage"
                    ? `${data.discount_value}%`
                    : formatPrice(data.discount_value)}
                </span>
                <span className="text-md text-muted-foreground font-semibold">
                  off
                </span>
              </div>
              <div className="flex items-center gap-1">
                <DetailDialog />
                {onClick && (
                  <DialogClose asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-3 py-1 ml-2"
                      onClick={onClick}
                    >
                      Select
                    </Button>
                  </DialogClose>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DiscountCard;
