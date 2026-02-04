import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Mail, Lock, User, AlertCircle, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "../../../context/UserContext";
import { toast } from "sonner";
import AuthenticateLayout from "../../layout/AuthenticateLayout";
import {
  validateRegisterForm,
  calculatePasswordStrength,
} from "../../../utils/validation/register";
import TextField from "@/components/common/TextField";
import { formatName } from "@/utils/formatter";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    newsletter: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { register } = useUser();
  const navigate = useNavigate();

  const validateForm = () => {
    const { errors, isValid } = validateRegisterForm(formData);
    setErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const registerData = {
        full_name: formatName(formData.full_name),
        email: formData.email.trim(),
        password: formData.password,
      };
      const response = await register(registerData);

      if (response.success) {
        toast.success("Registration completed! Please log in to continue.");
        navigate("/auth/login");
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage =
        error.message || "An error occurred during registration";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  // Monitor password/confirmPassword match
  const [passwordMatch, setPasswordMatch] = useState(null);

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    } else {
      setPasswordMatch(null);
    }
  }, [formData.password, formData.confirmPassword]);

  const partnerCard = (
    <div className="flex items-center gap-4">
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-foreground">Become a Partner</h3>
        <p className="text-sm text-muted-foreground">
          Join our partner program to reach more customers and grow your
          business.
        </p>
      </div>
      <div className="flex-shrink-0">
        <Link to="/contact">
          <Button
            variant="outline"
            size="sm"
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <AuthenticateLayout bottomCard={partnerCard}>
      <CardHeader className="space-y-1 py-2">
        <CardTitle className="text-2xl text-center">Register</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            id="full_name"
            name="full_name"
            label="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            error={errors.full_name}
            icon={<User className="h-5 w-5" />}
            onErrorClear={clearError}
            disabled={isLoading}
            required
          />

          <TextField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail className="h-5 w-5" />}
            onErrorClear={clearError}
            disabled={isLoading}
            required
          />

          <div className="space-y-2">
            <TextField
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="h-5 w-5" />}
              isHideContent={true}
              onErrorClear={clearError}
              disabled={isLoading}
              required
            />

            {formData.password && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Password strength:
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      passwordStrength < 50
                        ? "text-destructive"
                        : "text-green-600"
                    )}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <Progress value={passwordStrength} className="h-1" />
              </div>
            )}
          </div>

          <TextField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<Lock className="h-5 w-5" />}
            isHideContent={true}
            onErrorClear={clearError}
            disabled={isLoading}
            required
            rightItems={[
              passwordMatch === true ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : passwordMatch === false ? (
                <X className="h-4 w-4 text-destructive" />
              ) : null,
            ]}
          />

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agreeTerms: checked }))
                }
                disabled={isLoading}
                className={cn(errors.agreeTerms && "border-destructive")}
              />
              <Label
                htmlFor="agreeTerms"
                className="text-sm font-normal leading-5"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            {errors.agreeTerms && (
              <p className="text-sm text-destructive">{errors.agreeTerms}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size={"lg"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </AuthenticateLayout>
  );
};

export default RegisterForm;
