import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, Network, Database, ShieldCheck, Globe, Zap, BarChart3, Users, Activity, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/GlassCard';
import PremiumButton from '@/components/ui/PremiumButton';
import EnterprisePageLayout from '@/components/layout/EnterprisePageLayout';
import { AnimatedContainer } from '@/components/landing/AnimatedContainer';

const Counter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const isInView = true;

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplayValue(Math.floor(ease * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [value, duration]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export default function NexusPage() {
  return (
    <EnterprisePageLayout
      label="Unified Platform Layer"
      title="Enterprise Operating System."
      subtitle="Interconnected ecosystem visualization with AI orchestration, platform interoperability, and unified operating architecture across all enterprise functions."
      accentWord="Operating"
    >
      <div className="space-y-24">

        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Connected Nodes', value: 96, suffix: '', icon: Network, color: 'text-orange-500' },
            { label: 'API Calls', value: 2400000, suffix: '+/d', icon: Database, color: 'text-blue-500' },
            { label: 'Sync Latency', value: 12, suffix: 'ms', icon: Zap, color: 'text-purple-500' },
            { label: 'Data Throughput', value: 24.5, suffix: 'TB', icon: Cpu, color: 'text-emerald-500' },
          ].map((stat, i) => (
            <AnimatedContainer key={i} direction="up" delay={i * 0.05}>
              <GlassCard className="p-8 text-center space-y-4 group hover:-translate-y-2 transition-transform duration-500">
                <div className={cn("w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform", stat.color)}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-4xl font-display font-semibold text-slate-900 dark:text-white">
                    <Counter value={stat.value} />{stat.suffix}
                  </h3>
                  <p className="text-xs font-sans font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                </div>
              </GlassCard>
            </AnimatedContainer>
          ))}
        </div>

        {/* Ecosystem Visualization */}
        <AnimatedContainer direction="up" delay={0.2}>
          <GlassCard className="p-12 overflow-hidden">
            <div className="absolute -inset-20 bg-orange-500/5 blur-[120px] rounded-full" />
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white mb-8">Interconnected Ecosystem</h3>
              <div className="relative h-80 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-orange-500/20 border-2 border-orange-500/30 flex items-center justify-center">
                  <Cpu size={48} className="text-orange-500" />
                </div>
                <div className="absolute inset-0">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                    const icons = [Users, CreditCard, BarChart3, ShieldCheck, Database, Globe, Activity, Zap];
                    const colors = ['text-blue-500', 'text-emerald-500', 'text-purple-500', 'text-orange-500'];
                    const radius = 140;
                    const x = Math.cos(angle * Math.PI / 180) * radius;
                    const y = Math.sin(angle * Math.PI / 180) * radius;
                    const Icon = icons[i % icons.length];
                    return (
                      <div
                        key={angle}
                        className="absolute w-16 h-16 rounded-2xl bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-center"
                        style={{ left: `calc(50% + ${x}px - 32px)`, top: `calc(50% + ${y}px - 32px)` }}
                      >
                        <Icon size={24} className={colors[i % colors.length]} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedContainer>

        {/* Platform Layers */}
        <AnimatedContainer direction="up" delay={0.3}>
          <div className="space-y-12">
            <AnimatedContainer direction="up">
              <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white">Unified Architecture Layers</h3>
            </AnimatedContainer>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { title: 'Core Intelligence', icon: Cpu, desc: 'Central AI processing engine', items: ['NLP understanding', 'Pattern recognition', 'Predictive modeling', 'Decision automation'] },
                { title: 'Governance Hub', icon: ShieldCheck, desc: 'Policy and compliance control center', items: ['RBAC management', 'Audit trails', 'Security protocols', 'Compliance engines'] },
                { title: 'Data Fabric', icon: Database, desc: 'Unified information layer', items: ['Real-time sync', 'Data lakes', 'ETL pipelines', 'Warehouse'] },
              ].map((layer, i) => (
                <AnimatedContainer key={i} direction="up" delay={i * 0.05}>
                  <GlassCard className="p-8 space-y-4 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 flex items-center justify-center mb-4">
                      <layer.icon size={24} className="text-orange-500" />
                    </div>
                    <h4 className="font-display font-semibold text-xl text-slate-900 dark:text-white">{layer.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{layer.desc}</p>
                    <div className="space-y-2 pt-4 border-t border-slate-200/50 dark:border-white/5">
                      {layer.items.map((item) => (
                        <div key={item} className="text-xs text-slate-600 dark:text-slate-300">• {item}</div>
                      ))}
                    </div>
                  </GlassCard>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </AnimatedContainer>

        {/* Integration Platform */}
        <AnimatedContainer direction="up" delay={0.4}>
          <GlassCard className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-display font-semibold text-slate-900 dark:text-white">API Gateway & Integration</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">Unified integration layer connecting enterprise systems with real-time synchronization and automated data flow orchestration.</p>
                <div className="space-y-4">
                  {[{ label: 'Enterprise Connectors', value: '500+' }, { label: 'Data Sync', value: 'Real-time' }, { label: 'Uptime', value: '99.99%' }].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                      <span className="text-sm font-sans font-semibold text-orange-500">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-64">
                <div className="absolute inset-0 bg-orange-500/10 blur-[80px] rounded-full" />
                <div className="relative h-full grid grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-white/30 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-center justify-center">
                      <Globe size={24} className="text-orange-500/50" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedContainer>

        {/* Platform Metrics */}
        <AnimatedContainer direction="up" delay={0.5}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Global Regions', value: '96', icon: Globe },
              { label: 'API Endpoints', value: '1542', icon: Database },
              { label: 'AI Models', value: '24', icon: Cpu },
              { label: 'Integrations', value: '500', icon: Activity },
            ].map((metric, i) => (
              <AnimatedContainer key={i} direction="up" delay={i * 0.05}>
                <GlassCard className="p-6 text-center">
                  <metric.icon size={28} className="text-orange-500 mx-auto mb-3" />
                  <h4 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{metric.value}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{metric.label}</p>
                </GlassCard>
              </AnimatedContainer>
            ))}
          </div>
        </AnimatedContainer>

        {/* CTA Section */}
        <AnimatedContainer direction="up" delay={0.6}>
          <div className="text-center">
            <GlassCard className="p-16 border-2 border-orange-500/20">
              <h3 className="text-4xl font-display font-semibold text-slate-900 dark:text-white mb-6">Ready for unified operations?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">Deploy the future enterprise operating system with full ecosystem integration.</p>
              <Link to="/login" className="inline-block">
                <PremiumButton className="px-12 py-4 text-lg">Establish Access</PremiumButton>
              </Link>
            </GlassCard>
          </div>
        </AnimatedContainer>
      </div>
    </EnterprisePageLayout>
  );
}