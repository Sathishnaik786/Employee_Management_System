import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer2, Phone } from 'lucide-react';

const CTASection = () => {
    return (
        <section id="contact" className="py-24 px-6">
            <div className="container mx-auto">
                <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 md:p-20 text-center">
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -ml-32 -mb-32" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight"
                        >
                            Ready to Modernize Your Institution with IRES?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-indigo-100 mb-12"
                        >
                            Join hundreds of institutions already transforming their education resource management.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <button className="w-full sm:w-auto px-10 py-5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-slate-50 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                <MousePointer2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Book a Demo
                            </button>
                            <button className="w-full sm:w-auto px-10 py-5 bg-indigo-500/20 text-white font-bold rounded-2xl border border-white/20 hover:bg-indigo-500/30 transition-all flex items-center justify-center gap-3">
                                <Phone className="w-5 h-5" />
                                Contact Sales
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
