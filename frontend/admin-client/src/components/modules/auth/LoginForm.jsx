import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "../../../context/UserContext";
import { toast } from "sonner";
import AuthenticateLayout from "../../layout/AuthenticateLayout";
import { validateLoginForm } from "../../../utils/validation/login";
import TextField from "../../common/TextField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
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
        window.location.href = '/accounts';
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

  const handleErrorClear = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  return (
    <AuthenticateLayout>
      <CardHeader className="space-y-1 pt-2">
        <CardTitle className="text-2xl text-center ">
          Yami Admin Console
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default">
          <AlertCircleIcon />
          <AlertTitle>Sign in with an administrator account</AlertTitle>
          <AlertDescription>
            <p>
              To sign in to the Admin Console, use an provided administrator
              account. Store-level accounts must sign in through this portal
              here.
            </p>
          </AlertDescription>
        </Alert>
        <div className="space-y-4">
          <TextField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            icon={<Mail />}
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            onErrorClear={handleErrorClear}
            inputProps={{ disabled: isLoading }}
          />

          <TextField
            id="password"
            name="password"
            label="Password"
            icon={<Lock />}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            onErrorClear={handleErrorClear}
            isHideContent={true}
            inputProps={{ disabled: isLoading }}
          />

          <div className="flex items-center justify-between">
            {/* <div className="flex items-center space-x-2">
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
            </div> */}
            {/* <Link
              to="/account-recovery/request"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link> */}
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
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
        {/* <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          className="w-full"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button> */}
      </CardContent>
    </AuthenticateLayout>
  );
};

export default LoginForm;
