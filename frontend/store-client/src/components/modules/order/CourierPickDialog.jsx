import SelectField from "@/components/common/SelectField";
import TextField from "@/components/common/TextField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import orderService from "@/services/orderService";
import { formatString } from "@/utils/formatter";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronsRight, Plus, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function CourierPickDialog({
  order_id,
  order_code,
  afterSubmitAction,
  selected_courier = null,
}) {
  const [reason, setReason] = useState("");
  const [courier, setCourier] = useState(selected_courier);
  const [courierList, setCourierList] = useState([]);
  const currentCourier = selected_courier;
  const handlingClick = async () => {
    try {
      const res = await orderService.updateOrder(
        order_id,
        "edit-courier",
        courier
      );
      if (res.success) {
        afterSubmitAction();
        toast.success(`Assign ${currentCourier} successfully`);
      } else {
        toast.error(`Failed to assign courier: ${res.message}`);
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`);
    }
  };

  const fetchCourierList = async () => {
    try {
      const res = await orderService.getCourierList();
      /**
       * {
        "status": 200,
        "success": true,
        "data": [
            {
                "id": 6,
                "email": "phdev@ph.com",
                "storeProfile": {
                    "full_name": "PH Courier",
                    "phone": "033994334"
                }
            }
        ]
    }
       */
      if (res.success) {
        setCourierList(res?.data?.data?.data);
      } else {
        toast.error(`Failed to fetch courier list: ${res.message}`);
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchCourierList();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {currentCourier ? (
          <Button variant="outline" className="py-0.5 h-auto">
            Change Courier
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Plus className="h-2 w-2" />
            <span>Assign Courier</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Assign Courier
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <p>
            Please select a courier to assign for order{" "}
            <strong>{order_code}</strong>:
          </p>

          <ScrollArea className="max-h-60 rounded-lg">
            {courierList &&
              courierList?.length > 0 &&
              courierList.map((c) => (
                <div
                  key={c.id}
                  variant="outline"
                  className={`flex w-full justify-between items-center p-3 cursor-pointer ${parseInt(courier) === parseInt(c.id)
                      ? "bg-primary/20 hover:bg-primary/15"
                      : "bg-card hover:bg-card/80"
                    }`}
                  onClick={() => setCourier(c.id)}
                >
                  <div>
                    <p className="text-md font-semibold">
                      {c.storeProfile.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground opacity-75">
                      {c.storeProfile.phone}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground opacity-75">
                    {c?.assignedOrders?.length} orders
                  </p>
                </div>
              ))}
          </ScrollArea>
          <div className="flex items-center justify-end -mt-2 py-0 mb-4">
            <Button
              variant="outline"
              size={"sm"}
              className={"h-auto py-1 px-1 border-none"}
              onClick={() => fetchCourierList()}
            >
              <RefreshCcw className="h-3 w-3" /> Refresh
            </Button>
          </div>
          <div className="flex w-full items-center justify-between flex-col gap-3">
            <DialogClose asChild>
              <Button
                variant="default"
                size={"lg"}
                className={"w-full py-3"}
                onClick={() => {
                  handlingClick();
                }}
                disabled={!courier || courier === currentCourier}
              >
                {currentCourier ? "Change Courier" : "Assign Courier"}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="outline" className={"w-full"}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CourierPickDialog;
