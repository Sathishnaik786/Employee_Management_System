import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle, Star, Users, CheckCircle } from 'lucide-react';
import GlassCard from './GlassCard';

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-medium text-sm mb-6"
                        >
                            <Star className="w-4 h-4 fill-indigo-600" />
                            <span>New: Faculty Resource Planning Module</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8"
                        >
                            IRES – One Unified Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Education & Resource</span> Management
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl"
                        >
                            Manage Employees, Faculty, Students, Attendance, Academics, Payroll & Analytics in one intelligent system designed for modern institutions.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group">
                                Request Demo
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all border border-slate-200 flex items-center justify-center gap-2">
                                <PlayCircle className="w-5 h-5" />
                                Explore Platform
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="mt-12 flex items-center gap-6 justify-center lg:justify-start"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-slate-500">
                                <span className="font-bold text-slate-900">500+</span> Institutions trust IRES
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content - Dashboard Preview */}
                    <div className="flex-1 relative w-full max-w-2xl lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="relative"
                        >
                            <GlassCard className="p-4 overflow-hidden border-white/50 shadow-2xl bg-white/40" hoverEffect={false}>
                                {/* Dashboard Mockup */}
                                <div className="bg-white rounded-2xl p-6 shadow-inner min-h-[400px]">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <div className="h-4 w-32 bg-slate-100 rounded-full" />
                                            <div className="h-3 w-20 bg-slate-50 rounded-full" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-indigo-50" />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 rounded-2xl bg-indigo-50/50 p-4">
                                                <div className="h-2 w-12 bg-indigo-200 rounded-full mb-3" />
                                                <div className="h-6 w-16 bg-indigo-600/20 rounded-lg" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 w-40 bg-slate-100 rounded-full" />
                                                    <div className="h-2 w-24 bg-slate-50 rounded-full" />
                                                </div>
                                                <div className="h-6 w-12 bg-green-50 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 md:-right-12"
                            >
                                <GlassCard className="p-4 py-3 bg-white/80 shadow-lg border-white/60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Attendance Rate</div>
                                            <div className="text-sm font-bold text-slate-900">98.5%</div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -bottom-6 -left-6 md:-left-12"
                            >
                                <GlassCard className="p-4 py-3 bg-white/80 shadow-lg border-white/60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Active Faculty</div>
                                            <div className="text-sm font-bold text-slate-900">124 Members</div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
