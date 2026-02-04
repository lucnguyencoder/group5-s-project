import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import orderService from "@/services/orderService";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronsRight, CircleDollarSign } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SetPaidDialogConfirmation({
  order_id,
  order_code,
  afterSubmitAction,
}) {
  const handlingClick = async () => {
    try {
      const res = await orderService.updateOrder(order_id, "change-paid", true);
      if (res.success) {
        afterSubmitAction();
        toast.success(`Update payment data for order ${order_code} successfully`);
      } else {
        toast.error(`Failed to update payment data: ${res.message}`);
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className=" py-0.5 h-auto">
          <CircleDollarSign className="h-2 w-2" /> Mark as Paid
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Confirmation
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <p>
            Are you sure you want to mark order{" "}
            <strong>{order_code}</strong> as paid?
          </p>
          <p className="text-sm text-muted-foreground opacity-75">
            This action cannot be rolled back. Please confirm before proceed. This order will be marked as paid and you will not be able to change it back. 
          </p>
          <div className="flex w-full items-center justify-between flex-col gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className={"w-full"}
                onClick={() => {
                  // Close dialog without action
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="default"
                size={"lg"}
                className={"w-full py-3"}
                onClick={() => {
                  handlingClick();
                }}
              >
                Mark as Paid
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SetPaidDialogConfirmation;
