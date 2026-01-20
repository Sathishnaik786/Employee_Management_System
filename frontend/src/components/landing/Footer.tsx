import React from 'react';
import { Rocket, Twitter, Linkedin, Facebook, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Rocket className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">
                                IRES
                            </span>
                        </div>
                        <p className="text-slate-500 leading-relaxed">
                            Empowering educational institutions with a unified platform for employees, faculty, students, and resource management.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-sm tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-slate-500">
                            {['Features', 'Solutions', 'Security', 'Roadmap', 'Pricing'].map((item, i) => (
                                <li key={i}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-sm tracking-widest">Company</h4>
                        <ul className="space-y-4 text-slate-500">
                            {['About Us', 'Careers', 'Contact', 'Privacy Policy', 'Terms of Service'].map((item, i) => (
                                <li key={i}><a href="#" className="hover:text-indigo-600 transition-colors">{item}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase text-sm tracking-widest">Contact</h4>
                        <ul className="space-y-4 text-slate-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                <span>123 Innovation Drive, Tech City, <br />TC 45678</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-indigo-600" />
                                <span>hello@ires.com</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-indigo-600" />
                                <span>+1 (234) 567-890</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} IRES (Integrated Resource & Education System). All rights reserved.
                    </p>
                    <p className="text-slate-400 text-sm flex items-center gap-1">
                        Made with <span className="text-red-500">♥</span> for Education.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
