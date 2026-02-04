import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "../../../context/UserContext";
import { toast } from "sonner";
import AuthenticateLayout from "../../layout/AuthenticateLayout";
import { validateLoginForm } from "../../../utils/validation/login";
import { useNavigate } from "react-router-dom";
import TextField from "@/components/common/TextField";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const { login } = useUser();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from") || location.state?.from || "/account";


  const validateForm = () => {
    const { errors, isValid } = validateLoginForm(formData);
    setErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      if (response.success) {
        if (response.is_enabled_2fa) {
          toast.success("OTP sent");
          navigate("/auth/verify", {
            state: {
              id: response.data.requestId,
              tempToken: response.data.tempToken,
            },
          });
        } else {
          toast.success("Login successful!");
          window.location.href = "/food";
        }
      } else {
        const errorMessage = response.message || "Login failed";
        toast.error(errorMessage);
        setGeneralError(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "An error occurred during login";
      toast.error(errorMessage);
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const merchantPortalCard = (
    <div className="flex items-center gap-4">
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-foreground">Merchant Portal</h3>
        <p className="text-sm text-muted-foreground">
          Are you store staff or a merchant? Please follow the link below to
          access the portal.
        </p>
      </div>
      <div className="flex-shrink-0">
        <Link to="http://localhost:3004/auth/login">
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            Continue
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <AuthenticateLayout bottomCard={merchantPortalCard}>
      <CardHeader className="space-y-1 py-2">
        <CardTitle className="text-2xl text-center">Sign in to Yami</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <TextField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onErrorClear={clearError}
            error={errors.email}
            icon={<Mail className="h-5 w-5" />}
            disabled={isLoading}
            required
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            onErrorClear={clearError}
            error={errors.password}
            icon={<Lock className="h-5 w-5" />}
            isHideContent={true}
            disabled={isLoading}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, rememberMe: checked }))
                }
                disabled={isLoading}
              />
              <Label htmlFor="rememberMe" className="text-sm font-normal">
                Remember me
              </Label>
            </div>
            <Link
              to="/auth/account-recovery/request"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="button"
            onClick={handleSignIn}
            className="w-full"
            disabled={isLoading || !formData.email || !formData.password}
            size={"lg"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </AuthenticateLayout>
  );
};

export default LoginForm;
