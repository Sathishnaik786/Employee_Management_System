import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/auth/ThemeToggle';
import { GlassCard } from '@/components/ui/GlassCard';
import PremiumButton from '@/components/ui/PremiumButton';
import SectionHeading from '@/components/landing/SectionHeading';
import { AnimatedContainer } from '@/components/landing/AnimatedContainer';

interface EnterprisePageLayoutProps {
  children: React.ReactNode;
  title: string;
  label: string;
  subtitle?: string;
  accentWord?: string;
}

export function EnterprisePageLayout({ children, title, label, subtitle, accentWord }: EnterprisePageLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen mesh-bg-light dark:mesh-bg-dark text-slate-900 dark:text-white transition-colors duration-500 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden relative">
      <div className="grain-overlay" />

      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-orange-500/5 dark:bg-orange-500/10 blur-[140px] rounded-full pointer-events-none animate-slow-pulse -z-20" />
      <div className="absolute top-[35%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/8 blur-[120px] rounded-full pointer-events-none animate-slow-pulse -z-20" style={{ animationDelay: '-4s' }} />
      <div className="absolute bottom-[20%] left-[5%] w-[600px] h-[600px] bg-orange-500/3 dark:bg-orange-500/6 blur-[150px] rounded-full pointer-events-none animate-slow-pulse -z-20" style={{ animationDelay: '-8s' }} />

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-orange-500">
        Skip to main content
      </a>

      <div className={cn("fixed top-5 left-1/2 -translate-x-1/2 z-[150] w-[95%] max-w-[1700px] transition-all duration-500 ease-out")}>
        <nav aria-label="Main navigation" className={cn("relative grid grid-cols-[auto_1fr_auto] items-center rounded-full px-6 xl:px-10 bg-white/[0.08] dark:bg-slate-950/[0.55] backdrop-blur-3xl border border-white/15 dark:border-white/10", isScrolled ? "h-[72px] shadow-[0_20px_50px_rgba(15,23,42,0.18)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.55)]" : "h-[88px] shadow-[0_20px_80px_rgba(15,23,42,0.10)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.40)]", "transition-all duration-500 ease-out overflow-visible")}>
          <div aria-hidden="true" className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-transparent to-orange-500/5 pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-px rounded-full border border-white/10 pointer-events-none" />

          <Link to="/" className="relative flex items-center gap-4 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-full px-2 py-1">
            <img src="/logo.png" alt="YVI People logo" loading="lazy" className="w-11 h-11 object-contain rounded-xl brightness-110 drop-shadow-sm" />
            <span className="font-display font-semibold text-[26px] xl:text-[28px] tracking-tight text-slate-900 dark:text-white">YVI <span className="text-orange-500">People</span></span>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-10">
            {[
              { label: 'Home', path: '/' },
              { label: 'Workforce', path: '/workforce' },
              { label: 'Payroll', path: '/payroll' },
              { label: 'Intelligence', path: '/intelligence' },
              { label: 'Governance', path: '/governance' },
              { label: 'Operations', path: '/operations' },
              { label: 'Nexus', path: '/nexus' },
              { label: 'Company', path: '/about' }
            ].map((nav) => {
              const active = location.pathname === nav.path;
              return (
                <Link
                  key={nav.label}
                  to={nav.path}
                  className={cn(
                    "relative text-[15px] font-medium tracking-wide py-2 px-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded transition-all duration-300",
                    active
                      ? "text-orange-500 dark:text-orange-400 font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {nav.label}
                  <span
                    className={cn(
                      "absolute left-0 bottom-[-4px] h-[2px] bg-orange-500 rounded-full transition-all duration-300 ease-out",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="relative flex items-center gap-3 shrink-0">
            <div className="flex items-center"><ThemeToggle /></div>
            <Link to="/login" className="hidden sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 rounded-full"><PremiumButton>Login</PremiumButton></Link>
          </div>
        </nav>
      </div>

      <main id="main-content" className="pt-32">
        <section className="py-20 px-6">
          <div className="max-w-[1500px] mx-auto space-y-24">
            <AnimatedContainer direction="up">
              <SectionHeading label={label} title={title} subtitle={subtitle} accentWord={accentWord} />
            </AnimatedContainer>
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

export default EnterprisePageLayout;