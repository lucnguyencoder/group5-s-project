//done
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import accountManagementService from "@/services/user/accountManagementService";
import { KeyIcon } from "lucide-react";
import TextField from "@/components/common/TextField";

export function AccountChangePasswordDialog({ id, email, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await accountManagementService.updateUser(id, { password });

      toast.success(`Password for ${email} has been updated successfully.`);

      setIsOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.message || "Failed to update password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      setPassword("");
      setConfirmPassword("");
      setErrors({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Change password for account: {email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="password"
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<KeyIcon />}
            error={errors.password}
            helpText="Minimum 8 characters required"
            isHideContent={true}
            inputProps={{
              autoComplete: "new-password",
            }}
          />

          <TextField
            id="confirmPassword"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<KeyIcon />}
            error={errors.confirmPassword}
            helpText="Re-enter the new password"
            isHideContent={true}
            inputProps={{
              autoComplete: "new-password",
            }}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AccountChangePasswordDialog;
