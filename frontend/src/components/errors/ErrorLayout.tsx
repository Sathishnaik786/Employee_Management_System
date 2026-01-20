import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface ErrorLayoutProps {
    icon: ReactNode;
    badge?: ReactNode;
    title: string;
    description: string;
    actions: ReactNode;
    children?: ReactNode; // Footer content
}

export const ErrorLayout = ({
    icon,
    badge,
    title,
    description,
    actions,
    children
}: ErrorLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-2xl w-full text-center space-y-12"
            >
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <div className="relative w-40 h-40 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/20 mx-auto">
                        {/* Clone icon to enforce size uniformity if possible, or expect correct size passed */}
                        {icon}
                    </div>
                    {badge && (
                        <div className="absolute -top-4 -right-4 bg-rose-500 text-white font-black text-xl px-4 py-2 rounded-2xl shadow-xl rotate-12">
                            {badge}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground uppercase">
                        {title}
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-lg mx-auto font-medium leading-relaxed italic">
                        "{description}"
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
                    {actions}
                </div>

                {children && (
                    <div className="flex flex-col items-center gap-4 pt-10">
                        {children}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
