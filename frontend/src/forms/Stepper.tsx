import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStepForm } from './StepFormContext';

export const Stepper: React.FC = () => {
    const { steps, currentStepIndex, goToStep, isReadOnly } = useStepForm();

    return (
        <div className="relative flex justify-between items-center w-full mb-12">
            {/* Connection Lines */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-muted/30 -z-10" />
            <motion.div
                className="absolute top-5 left-0 h-[2px] bg-primary -z-10 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStepIndex / (steps.length - 1) }}
                transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            />

            {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                    <div key={step.id} className="flex flex-col items-center group">
                        <motion.button
                            onClick={() => (isCompleted || isActive) && !isReadOnly && goToStep(index)}
                            disabled={!isCompleted && !isActive}
                            className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 relative border-2",
                                isActive
                                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/10"
                                    : isCompleted
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "bg-background border-muted/50 text-muted-foreground hover:border-primary/50"
                            )}
                            whileHover={!isReadOnly && (isActive || isCompleted) ? { scale: 1.1 } : {}}
                            whileTap={!isReadOnly && (isActive || isCompleted) ? { scale: 0.95 } : {}}
                        >
                            {isCompleted ? (
                                <Check size={20} strokeWidth={3} />
                            ) : (
                                <span className="text-sm font-black">{index + 1}</span>
                            )}
                        </motion.button>

                        <div className="absolute mt-12 flex flex-col items-center whitespace-nowrap">
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
                                isActive ? "text-primary" : isCompleted ? "text-emerald-600" : "text-muted-foreground/60"
                            )}>
                                {step.title}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
