import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, ShieldCheck, School } from 'lucide-react';

/**
 * IERS - Institutional Login Portal
 */
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
        description: 'Please enter institutional email and password.',
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
        title: 'Authentication Failed',
        description: 'Invalid credentials. Access to institutional portal denied.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-muted/10">
      {/* Left side - Institutional Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0b] flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="p-3 bg-primary/20 rounded-[1.5rem] backdrop-blur-3xl border border-white/5 shadow-2xl">
            <School className="text-primary w-10 h-10" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tighter uppercase italic">IERS</span>
            <span className="text-[10px] font-black text-primary/60 tracking-[0.4em] uppercase">Academic Cloud</span>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <h1 className="text-6xl font-black text-white leading-[1] tracking-tight">
            Integrated Resource <br />
            & <span className="text-primary">Education System</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-lg font-medium leading-relaxed opacity-80">
            A unified digital governance framework for research lifecycle, accreditation compliance, and academic excellence.
          </p>

          <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/5">
            <div className="space-y-2">
              <p className="text-3xl font-black text-white">PHD:LIFE</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Research Lifecycle</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black text-primary">NAAC:SSR</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compliance Engine</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 tracking-widest uppercase italic">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Institutional Access
          </div>
          <div className="h-px flex-1 bg-white/5" />
          <p className="text-[10px] font-black text-slate-600 uppercase">v3.4.0 Pure IERS</p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/50 backdrop-blur-sm">
        <Card className="w-full max-w-md border-none shadow-2xl rounded-[3rem] p-4 bg-white">
          <CardHeader className="space-y-2 text-center pb-10">
            <div className="flex justify-center lg:hidden mb-6">
              <School className="text-primary w-12 h-12" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tight">Portal Entry</CardTitle>
            <CardDescription className="text-sm font-medium opacity-60">
              Identify yourself using your institutional account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest opacity-60">Identity Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@iers.edu"
                  className="rounded-2xl h-14 border-muted/20 focus-visible:ring-primary/20 focus-visible:border-primary/30"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-60">Security Key</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="rounded-2xl h-14 border-muted/20 focus-visible:ring-primary/20 focus-visible:border-primary/30"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-14 rounded-2xl shadow-xl shadow-primary/20 font-black text-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Enter IERS'}
              </Button>

              <div className="text-center pt-2">
                <a href="/forgot-password" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  Forgotten Credentials?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
