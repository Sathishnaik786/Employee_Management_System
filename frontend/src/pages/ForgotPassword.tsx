import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Loader2, ArrowLeft } from 'lucide-react';
import { authApi } from '@/services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate email format
  const validateEmailFormat = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Check if email exists in the system
  const checkEmailExists = async (email: string) => {
    if (!validateEmailFormat(email)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
      return;
    }

    setIsCheckingEmail(true);
    setEmailError('');
    
    try {
      // Call the API to check if the email exists
      const response = await authApi.checkEmailExists(email);
      
      if (response.success && response.data.exists) {
        setIsEmailValid(true);
        setEmailError('');
      } else {
        setIsEmailValid(false);
        setEmailError('No account found with this email address');
      }
    } catch (error: any) {
      setEmailError('Error checking email. Please try again.');
      setIsEmailValid(false);
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Handle email input change with debouncing
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Clear previous error
    if (emailError) {
      setEmailError('');
    }
    
    // Clear previous timeout
    if ((handleEmailChange as any).timeoutId) {
      clearTimeout((handleEmailChange as any).timeoutId);
    }
    
    // Check email validity after user stops typing for 500ms
    if (value) {
      (handleEmailChange as any).timeoutId = setTimeout(() => {
        checkEmailExists(value);
      }, 500);
    } else {
      setIsEmailValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Validation Error',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateEmailFormat(email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!isEmailValid) {
      toast({
        title: 'Account Not Found',
        description: 'No account found with this email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
      toast({
        title: 'Email Sent',
        description: 'If an account exists with this email, a password reset link has been sent.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send password reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
        </div>
        
        <Card className="shadow-card">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isSubmitted ? 'Check Your Email' : 'Forgot Password?'}
            </CardTitle>
            <CardDescription>
              {isSubmitted 
                ? 'If an account exists with this email, a password reset link has been sent.' 
                : 'Enter your email address and we will send you a link to reset your password.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  If you don't see the email, please check your spam folder.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Resend Email
                  </Button>
                  <Button onClick={() => navigate('/login')}>
                    Back to Login
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                    {isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {emailError && !isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {isEmailValid && !isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {emailError && (
                    <p className="text-sm text-destructive">{emailError}</p>
                  )}
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
                
                <div className="text-center pt-4">
                  <Link 
                    to="/login" 
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}