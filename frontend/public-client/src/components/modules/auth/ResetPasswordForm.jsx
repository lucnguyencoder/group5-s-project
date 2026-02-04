import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthenticateLayout from "@/components/layout/AuthenticateLayout";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useUser();

  const resetToken = location.state?.resetToken;

  useEffect(() => {
    if (!resetToken) {
      toast.error(
        "Invalid or missing reset token. Please restart the password recovery process."
      );
      navigate("/account-recovery/request");
    }
  }, [resetToken, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleOnCheck = (checkedState) => {
    setIsChecked(checkedState);
    setShowPassword(checkedState);
    setShowConfirmPassword(checkedState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await resetPassword(resetToken, formData.password);
      if (response.success) {
        toast.success(
          "Password has been reset successfully! You can now log in with your new password."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(
          response.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!resetToken) {
    return null;
  }

  return (
    <AuthenticateLayout>
      <CardHeader className="space-y-1 py-2">
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Enter your new password below.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your new password"
                className={cn(
                  "pl-10 pr-10",
                  errors.password &&
                  "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className={cn(
                  "pl-10 pr-10",
                  errors.confirmPassword &&
                  "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={isChecked}
              onCheckedChange={handleOnCheck}
            />
            {isChecked ? (
              <Label htmlFor="terms">Hide Password</Label>
            ) : (
              <Label htmlFor="terms">Show password</Label>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </CardContent>
    </AuthenticateLayout>
  );
};

export default ResetPasswordForm;
