import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    UserSquare2,
    Database,
    CalendarCheck,
    BookOpen,
    CreditCard,
    TrendingUp,
    PieChart
} from 'lucide-react';
import GlassCard from './GlassCard';

const modules = [
    {
        icon: Users,
        title: 'Employee Management',
        desc: 'Centralized database for all staff records, documents, and digital onboarding.',
    },
    {
        icon: UserSquare2,
        title: 'Faculty Profiles',
        desc: 'Detailed academic history, research papers, and workload management for educators.',
    },
    {
        icon: Database,
        title: 'Student Information System',
        desc: 'Complete student lifecycle management from admissions to alumni.',
    },
    {
        icon: CalendarCheck,
        title: 'Attendance & Leave',
        desc: 'Automated biometric integration and flexible leave policy management.',
    },
    {
        icon: BookOpen,
        title: 'Academic Management',
        desc: 'Curriculum planning, examination portal, and gradebook automation.',
    },
    {
        icon: CreditCard,
        title: 'Payroll & Compliance',
        desc: 'Simplified salary processing with tax and regulatory compliance.',
    },
    {
        icon: TrendingUp,
        title: 'Performance Tracking',
        desc: '360-degree appraisals, KRA management, and skill development tracking.',
    },
    {
        icon: PieChart,
        title: 'Reports & Analytics',
        desc: 'Powerful visual insights into institutional performance and resource utilization.',
    },
];

const FeatureGrid = () => {
    return (
        <section id="features" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl font-bold text-slate-900 mb-6"
                    >
                        Core Modules
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600"
                    >
                        A comprehensive suite of integrated modules designed to handle every aspect of educational resource management.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {modules.map((module, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                            className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-indigo-600 transition-colors duration-300">
                                <module.icon className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                {module.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                {module.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureGrid;
