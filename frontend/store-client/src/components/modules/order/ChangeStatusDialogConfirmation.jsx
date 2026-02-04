import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import orderService from "@/services/orderService";
import { formatString } from "@/utils/formatter";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronsRight } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function MoveStatusDialogConfirmation({
  status,
  order_id,
  order_code,
  afterSubmitAction,
}) {
  const handlingClick = async () => {
    try {
      const res = await orderService.updateOrder(order_id, "add-state", status);
      if (res.success) {
        afterSubmitAction();
        toast.success(`Order status updated to ${formatString(status)}`);
      } else {
        toast.error(`Failed to update order status: ${res.message}`);
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="py-0.5 h-auto">
          Move to {formatString(status)}
          <ChevronsRight className="h-2 w-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Confirmation
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <p>
            Are you sure you want to move status of order{" "}
            <strong>{order_code}</strong> to{" "}
            <strong>{formatString(status)}</strong>?
          </p>
          <p className="text-sm text-muted-foreground opacity-75">
            This action cannot be rolled back. Please confirm before proceed.{" "}
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
                Move to {formatString(status)}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MoveStatusDialogConfirmation;
