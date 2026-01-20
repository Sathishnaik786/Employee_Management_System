import React from 'react';
import { motion } from 'framer-motion';
import { Building2, School, UserCog, Users, GraduationCap } from 'lucide-react';
import GlassCard from './GlassCard';

const personas = [
    {
        icon: Building2,
        title: 'Educational Institutions',
        desc: 'Complete ERP solution for schools and administrative offices.',
        color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
        icon: School,
        title: 'Colleges & Universities',
        desc: 'Scalable infrastructure for higher education and multi-campus setups.',
        color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
        icon: UserCog,
        title: 'Management & Admins',
        desc: 'Real-time insights and data-driven decision making tools.',
        color: 'bg-violet-50 text-violet-600 border-violet-100',
    },
    {
        icon: Users,
        title: 'Faculty & Staff',
        desc: 'Streamlined resource management and academic planning.',
        color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
    {
        icon: GraduationCap,
        title: 'Students',
        desc: 'Future-ready portal for academics, reports, and communication.',
        color: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100',
    },
];

const PersonaSection = () => {
    return (
        <section id="solutions" className="py-24 bg-slate-50/50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-slate-900 mb-6"
                    >
                        Who is IRES For?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        Whether you're a small school or a large university system, IRES provides the tools you need to excel.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {personas.map((persona, index) => (
                        <GlassCard
                            key={index}
                            delay={index * 0.1}
                            className="flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm ${persona.color}`}>
                                <persona.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                {persona.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {persona.desc}
                            </p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PersonaSection;
