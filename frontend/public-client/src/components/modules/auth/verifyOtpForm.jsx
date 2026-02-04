import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import AuthenticateLayout from "@/components/layout/AuthenticateLayout";
import { toast } from "sonner";

const VerifyOTPForm = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOTP } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const requestId = location.state?.requestId;

  if (!requestId) {
    toast.success("No request has been made");
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOTP(requestId, otp);
      if (response.success) {
        toast.success("OTP verified successfully!");
        navigate("/auth/account-recovery/reset-password", {
          state: { resetToken: response.resetToken },
        });
      } else {
        setError(response.message);
        toast.error(response.message || "Failed to verify OTP.");
      }
    } catch (error) {
      setError(error.message || "Failed to verify OTP");
      toast.error(
        error.message || "An error occurred during OTP verification."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthenticateLayout>
      <CardHeader className="space-y-1 py-2">
        <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Please enter the 6-digit OTP code sent to your email.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP Code</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                pattern="\d{6}"
                placeholder="Enter 6-digit OTP"
                className={cn(
                  "pl-10",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                disabled={isLoading}
              />
            </div>
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
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </form>
      </CardContent>
    </AuthenticateLayout>
  );
};

export default VerifyOTPForm;
