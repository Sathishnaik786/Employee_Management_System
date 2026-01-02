import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Building2, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/app/dashboard');
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <img 
            src="/src/assest/logo.png" 
            alt="Logo" 
            className="w-20 h-20 rounded-xl object-contain"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          <span className="text-xl font-bold text-sidebar-foreground">YVI Employee MS</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-sidebar-foreground leading-tight">
            Streamline your<br />workforce management
          </h1>
          <p className="text-lg text-sidebar-muted max-w-md">
            A complete solution for managing employees, attendance, leaves, and generating insightful reports.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-sidebar-primary">500+</p>
              <p className="text-sm text-sidebar-muted">Companies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-sidebar-primary">50K+</p>
              <p className="text-sm text-sidebar-muted">Employees</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-sidebar-primary">99.9%</p>
              <p className="text-sm text-sidebar-muted">Uptime</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-sidebar-muted">
          © 2024 Employee Management System. All rights reserved.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-card">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center lg:hidden mb-4">
              <img 
                src="/src/assest/logo.png" 
                alt="Logo" 
                className="w-12 h-12 rounded-xl object-contain"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              {/* Enter your credentials to access your account */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
                          
              <div className="text-center pt-4">
                <a 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
            
            {/* <div className="mt-6 p-4 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
              <div className="space-y-1 text-xs">
                <p><span className="font-medium">Admin:</span> admin@company.com</p>
                <p><span className="font-medium">HR:</span> hr@company.com</p>
                <p><span className="font-medium">Manager:</span> manager@company.com</p>
                <p className="text-muted-foreground">Use any password</p>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
