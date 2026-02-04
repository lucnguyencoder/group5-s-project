import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from 'sonner';
import AuthenticateLayout from '@/components/layout/AuthenticateLayout';
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateEmail } from '@/utils/validators';


const ForgotPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { forgotPassword } = useUser();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const validatedEmail = validateEmail(email);
            if (validatedEmail) {
                setError(validatedEmail);
                toast.error(validatedEmail);
                setIsLoading(false);
                return;
            }
            const response = await forgotPassword(email);
            if (response.success) {
                toast.success("Recovery email sent successfully!");
                navigate('/auth/account-recovery/verifyOTP', { state: { requestId: response.requestId } });
            } else {
                toast.error(response.message)
                setError(response.message);
            }
        } catch (error) {
            setError(error.message || 'Failed to send recovery email');
            toast.error(error.message || 'Failed to send recovery email')
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthenticateLayout>
            <CardHeader className="space-y-1 py-2">
                <CardTitle className="text-2xl text-center">Password Recovery</CardTitle>
                <p className="text-sm text-muted-foreground text-center">
                    Enter your email address and we'll send you instructions to reset your password.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email address"
                                className={cn("pl-10", error && "border-destructive focus-visible:ring-destructive")}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send Recovery Email'
                        )}
                    </Button>
                </form>
            </CardContent>
        </AuthenticateLayout>
    );
};

export default ForgotPasswordForm;