import TextField from "@/components/common/TextField";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import orderService from "@/services/orderService";
import { formatString } from "@/utils/formatter";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { ChevronsRight } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function CancelDialogConfirmation({ order_id, order_code, afterSubmitAction }) {
  const [reason, setReason] = useState("");
  const handlingClick = async () => {
    try {
      const res = await orderService.updateOrder(order_id, "cancelled", reason);
      if (res.success) {
        afterSubmitAction();
        toast.success(`Cancel order ${order_code} successfully`);
      } else {
        toast.error(`Failed to cancel order: ${res.message}`);
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error.message}`);
    }
  };

  const validateReason = ({ reason }) => {
    if (!reason.trim()) {
      return "Reason for cancellation cannot be empty";
    }
    if (reason.length > 500) {
      return "Reason for cancellation cannot exceed 500 characters";
    }
    return "";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-destructive border-destructive py-0.5 h-auto"
        >
          Cancel Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-lg font-semibold">
          Cancel Order
        </DialogTitle>
        <div className="flex flex-col space-y-4">
          <p>
            Please provide a reason for cancelling order{" "}
            <strong>{order_code}</strong>:
          </p>
          <TextField
            label="Reason for cancellation"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for cancellation"
            helpText={"If you don't have a reason, you can leave it blank."}
            className="w-full"
            error={validateReason({ reason })}
          />
          <p className="text-sm text-muted-foreground opacity-75">
            This action cannot be rolled back. Please confirm before proceed.{" "}
          </p>
          <div className="flex w-full items-center justify-between flex-col gap-3">
            <DialogClose asChild>
              <Button
                variant="default"
                size={"lg"}
                className={"w-full py-3"}
                onClick={() => {
                  handlingClick();
                }}
                disabled={validateReason({ reason })}
              >
                Cancel order {order_code}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                variant="outline"
                className={"w-full"}
                onClick={() => {
                  // Close dialog without action
                }}
              >
                Exit
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CancelDialogConfirmation;
