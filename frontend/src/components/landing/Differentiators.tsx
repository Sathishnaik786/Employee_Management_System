import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Layers, Smartphone } from 'lucide-react';
import GlassCard from './GlassCard';

const differentiators = [
    {
        icon: ShieldCheck,
        title: 'Role-based access control',
        desc: 'Fine-grained permissions for admins, faculty, and support staff.',
    },
    {
        icon: Layers,
        title: 'Scalable for institutions',
        desc: 'Easily manage multiple campuses and departments from a single dashboard.',
    },
    {
        icon: Zap,
        title: 'Faster onboarding',
        desc: 'Modern intuitive design means your team is productive from day one.',
    },
    {
        icon: Smartphone,
        title: 'Modern UI & UX',
        desc: 'A consumer-grade interface designed for complex enterprise workflows.',
    },
    {
        icon: CheckCircle2,
        title: 'Secure & compliant',
        desc: 'Enterprise-grade security standards with full data residency compliance.',
    },
];

const Differentiators = () => {
    return (
        <section className="py-24 bg-indigo-900 overflow-hidden relative">
            {/* Abstract Background Patterns */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-800 rounded-full blur-[120px] -mr-64 -mt-64 opacity-50" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-800 rounded-full blur-[120px] -ml-64 -mb-64 opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold text-white mb-8"
                        >
                            Why IRES is the better choice for your institution
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-indigo-100 mb-12"
                        >
                            Legacy ERPs are slow, complex, and frustrating. IRES is built for the modern education era.
                        </motion.p>

                        <div className="space-y-6">
                            {['99.9% Uptime SLA', 'Dedicated Support Hub', 'Customizable Workflows', 'Seamless API Integrations'].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className="flex items-center gap-3 text-white font-medium"
                                >
                                    <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                    </div>
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {differentiators.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                                className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 ${index === 2 ? 'sm:col-span-2' : ''}`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-indigo-300" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Differentiators;
