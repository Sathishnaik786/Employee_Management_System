import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users2, BellRing, Search } from 'lucide-react';
import GlassCard from './GlassCard';

const ProductPreview = () => {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-slate-900 mb-6"
                    >
                        Product Excellence
                    </motion.h2>
                    <p className="text-lg text-slate-600">
                        A peak into the intelligent dashboard designed for ultimate clarity and control.
                    </p>
                </div>

                <GlassCard className="max-w-6xl mx-auto p-4 md:p-8 bg-white/40 border-white/60 shadow-2xl relative">
                    <div className="rounded-2xl bg-white shadow-inner overflow-hidden border border-slate-100 min-h-[500px] flex flex-col md:flex-row">
                        {/* Sidebar Mockup */}
                        <div className="w-full md:w-64 bg-slate-50 p-6 border-r border-slate-100 hidden md:block">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg mb-8" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className={`h-10 rounded-lg flex items-center gap-3 px-3 ${i === 1 ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
                                        <div className="w-5 h-5 bg-current opacity-20 rounded" />
                                        <div className="h-3 w-20 bg-current opacity-20 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main Content Mockup */}
                        <div className="flex-1 p-6 md:p-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                                <div className="relative w-full md:w-96">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <div className="w-full h-10 bg-slate-50 rounded-xl border border-slate-100 px-10 flex items-center text-slate-400 text-sm">
                                        Search anything...
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                        <BellRing className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100" />
                                        <div className="hidden sm:block">
                                            <div className="text-sm font-bold text-slate-900">Education Admin</div>
                                            <div className="text-xs text-slate-500">Super Admin</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                {[
                                    { label: 'Active Students', value: '2,840', icon: Users2, color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { label: 'Faculty Members', value: '184', icon: Users2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                    { label: 'Monthly Growth', value: '+12.5%', icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' }
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                                        <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
                                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="rounded-2xl border border-slate-100 p-6 flex flex-col gap-4">
                                <div className="h-4 w-32 bg-slate-100 rounded-full mb-2" />
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                                        <div className="w-10 h-10 rounded-full bg-slate-100" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 w-40 bg-slate-100 rounded-full" />
                                            <div className="h-2 w-24 bg-slate-50 rounded-full" />
                                        </div>
                                        <div className="h-8 w-24 bg-slate-50 rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Draggable-feel Floating Stats */}
                    <motion.div
                        style={{ x: 20, y: -40 }}
                        className="absolute -top-10 -left-6 hidden lg:block"
                    >
                        <GlassCard className="p-6 bg-white/90 shadow-2xl border-white/80 w-64">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">Productivity</div>
                                    <div className="text-lg font-bold text-slate-900">+24% Increase</div>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '75%' }}
                                    className="h-full bg-indigo-600 rounded-full"
                                />
                            </div>
                        </GlassCard>
                    </motion.div>
                </GlassCard>
            </div>
        </section>
    );
};

export default ProductPreview;
