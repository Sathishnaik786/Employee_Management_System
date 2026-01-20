import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, Cloud } from 'lucide-react';

const securityFeatures = [
    {
        icon: ShieldCheck,
        title: 'Secure data handling',
        desc: 'AES-256 encryption at rest and TLS 1.3 in transit.'
    },
    {
        icon: Lock,
        title: 'Role-based permissions',
        desc: 'Granular access control ensuring data privacy.'
    },
    {
        icon: Eye,
        title: 'Audit-ready architecture',
        desc: 'Llog every action with detailed audit trails.'
    },
    {
        icon: Cloud,
        title: 'Cloud-friendly design',
        desc: 'High availability clusters with multi-region failover.'
    }
];

const SecuritySection = () => {
    return (
        <section id="security" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            Institutional grade security, by default.
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            We understand that educational data is sensitive. That's why we've built IRES with a security-first mindset, ensuring compliance with global data protection standards.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {['GDPR Compliant', 'ISO 27001', 'SOC2 Type II'].map((cert, i) => (
                                <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 text-sm font-semibold">
                                    {cert}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {securityFeatures.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;
