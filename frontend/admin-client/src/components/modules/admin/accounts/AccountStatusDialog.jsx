//done
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import accountManagementService from "@/services/user/accountManagementService";

export function AccountStatusDialog({
  id,
  email,
  isActive,
  children,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStatusChange = async () => {
    setIsLoading(true);

    try {
      await accountManagementService.toggleUserStatus(id);

      toast.success(
        isActive
          ? `Account ${email} has been disabled successfully.`
          : `Account ${email} has been enabled successfully.`
      );
      setTimeout(() => window.location.reload(), 500);

    } catch (error) {
      toast.error(
        error.message ||
        `Failed to ${isActive ? "disable" : "enable"
        } account. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "Disable Account" : "Enable Account"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActive
              ? `Are you sure you want to disable the account for ${email}? This action can be reversed later.`
              : `Are you sure you want to enable the account for ${email}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <Button
            variant={isActive ? "destructive" : "success"}
            onClick={handleStatusChange}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : isActive ? (
              "Disable Account"
            ) : (
              "Enable Account"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AccountStatusDialog;
