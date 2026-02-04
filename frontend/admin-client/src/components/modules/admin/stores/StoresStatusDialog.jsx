import React, { useState } from "react";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "sonner";
import storeManagementService from "@/services/store/storeManagementService";

export function StoresStatusDialog({
  id,
  name,
  isActive,
  isTempClosed,
  type = "status",
  onStatusChange,
  children,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async () => {
    setIsLoading(true);

    try {
      if (type === "status") {
        const result = await storeManagementService.toggleStoreStatus(id);
        const action = isActive ? "disabled" : "activated";
        toast.success(`Store "${name}" has been ${action} successfully.`);
      } else if (type === "temp") {
        const result = await storeManagementService.toggleStoreTempClosed(id);
        const action = isTempClosed ? "reopened" : "temporarily closed";
        toast.success(`Store "${name}" has been marked as ${action}.`);
      }

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      let actionType = "";
      if (type === "status") {
        actionType = isActive ? "disable" : "activate";
      } else {
        actionType = isTempClosed ? "reopen" : "temporarily close";
      }

      toast.error(
        error.message || `Failed to ${actionType} store. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  let title = "";
  let description = "";
  let confirmText = "";
  let confirmVariant = "default";

  if (type === "status") {
    if (isActive) {
      title = "Disable Store";
      description = `Are you sure you want to disable "${name}"? This store will no longer be visible to customers.`;
      confirmText = "Disable";
      confirmVariant = "destructive";
    } else {
      title = "Activate Store";
      description = `Are you sure you want to activate "${name}"? This store will be visible to customers again.`;
      confirmText = "Activate";
      confirmVariant = "default";
    }
  } else if (type === "temp") {
    if (isTempClosed) {
      title = "Reopen Store";
      description = `Are you sure you want to reopen "${name}"? This store will be available for orders again.`;
      confirmText = "Reopen Store";
      confirmVariant = "default";
    } else {
      title = "Mark as Temporarily Closed";
      description = `Are you sure you want to mark "${name}" as temporarily closed? This store will not accept orders until reopened.`;
      confirmText = "Mark as Closed";
      confirmVariant = "warning";
    }
  }

  return (
    <ConfirmationDialog
      title={title}
      description={description}
      confirmText={confirmText}
      confirmVariant={confirmVariant}
      isLoading={isLoading}
      onConfirm={handleStatusChange}
    >
      {children}
    </ConfirmationDialog>
  );
}

export default StoresStatusDialog;
