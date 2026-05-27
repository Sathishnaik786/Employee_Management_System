import React, { useState, useEffect } from 'react';
import BackgroundVisual from './BackgroundVisual';
import ThemeToggle from './ThemeToggle';
import TestimonialCard from './TestimonialCard';

interface GlassLoginLayoutProps {
  children: React.ReactNode;
}

export default function GlassLoginLayout({ children }: GlassLoginLayoutProps) {
  const [index, setIndex] = useState(0);

  // Auto-play index coordinator synchronizing the background visual and testimonial quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % 3);
    }, 6000); // cycle index every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500 overflow-hidden relative selection:bg-orange-500/10 selection:text-orange-500 font-sans">
      
      {/* ---------------------------------------------------------------------- */}
      {/* LEFT COLUMN: Cinematic Image Slideshow & Glass Testimonial Card        */}
      {/* ---------------------------------------------------------------------- */}
      <div className="relative hidden lg:flex lg:w-[50%] xl:w-[54%] flex-col justify-between p-12 overflow-hidden h-screen select-none bg-slate-950">
        
        {/* Full-color non-blurred crisp slideshow background */}
        <BackgroundVisual isSidebar={true} index={index} />
        
        {/* Absolute branding watermark */}
        <div className="relative z-10 flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="YVI" 
            className="h-8 object-contain brightness-0 invert opacity-90 select-none pointer-events-none" 
          />
        </div>

        {/* Stateful Glassmorphic Testimonial Card floating on top of active background */}
        <TestimonialCard index={index} setIndex={setIndex} />
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* RIGHT COLUMN: Terminal Area & Credentials Glass Login Card             */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 lg:w-[50%] xl:w-[46%] h-screen overflow-y-auto relative z-10 bg-[#f8fafc] dark:bg-slate-950 transition-colors duration-500">
        
        {/* Mobile-Only Backdrop (immersive blurred slideshow behind the centered card on small screens) */}
        <div className="block lg:hidden">
          <BackgroundVisual isSidebar={false} />
        </div>

        {/* Subtle, absolute Vercel-style Theme Toggle */}
        <div className="absolute top-6 right-6 lg:top-8 lg:right-8 z-30">
          <ThemeToggle />
        </div>

        {/* Centered credentials glass card canvas */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full max-w-[440px] mx-auto my-auto space-y-6">
          {children}
        </div>

        {/* System copyright footer */}
        <div className="w-full text-center pt-8 border-t border-slate-200/50 dark:border-white/5 max-w-[440px] mx-auto relative z-10 transition-colors duration-500">
          <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 leading-normal select-none">
            © 2026 YVI Enterprise Management Systems. All rights reserved.
          </span>
        </div>

      </div>
    </div>
  );
}

