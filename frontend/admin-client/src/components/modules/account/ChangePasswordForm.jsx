import LabelInput from "@/components/common/LabelInput";
import VerticalAccountCard from "@/components/common/VerticalAccountCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import { toast } from "sonner";
import { validatePassword } from "@/utils/validators";

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { user, changePassword } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    const validatedPassword = validatePassword(formData.newPassword);
    if (validatedPassword) {
      newErrors.newPassword = validatedPassword;
    }
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(Object.values(validationErrors)[0]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await changePassword(
        user?.id,
        formData.currentPassword,
        formData.newPassword
      );
      if (response.success) {
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password changed successfully");
      } else {
        setErrors({
          general: response.message || "Failed to change password",
        });
        toast.error(response.message || "Failed to change password");
      }
    } catch (error) {
      setErrors({ general: error.message || "Failed to change password" });
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <VerticalAccountCard
          title={"Security"}
          footer={
            <Button
              type="submit"
              size={"sm"}
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="relative">
              <LabelInput
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Enter your current password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                error={errors.currentPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowCurrentPassword((v) => !v)}
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <LabelInput
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                error={errors.newPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowNewPassword((v) => !v)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <LabelInput
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={errors.confirmPassword}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.general && (
              <div className="text-red-500 text-sm">{errors.general}</div>
            )}
          </div>
        </VerticalAccountCard>
      </form>
    </>
  );
}

export default ChangePasswordForm;
