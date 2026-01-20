import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { StepFormProvider, useStepForm } from './StepFormContext';
import { Stepper } from './Stepper';
import { StepFormProps } from './types';

function StepFormInternal<T>({
    children,
    className
}: {
    children: React.ReactNode | ((context: any) => React.ReactNode);
    className?: string;
}) {
    const context = useStepForm<T>();
    const {
        currentStepIndex,
        steps,
        isFirstStep,
        isLastStep,
        prevStep,
        nextStep,
        submitForm,
        saveDraft,
        isReadOnly,
        isDirty,
        isSubmitting,
        isValidating,
        error
    } = context;

    const currentStep = steps[currentStepIndex];

    return (
        <div className={cn("space-y-8", className)}>
            <Stepper />

            <Card className="relative p-8 border-border/30 bg-card/60 backdrop-blur-md shadow-premium rounded-[2rem] overflow-hidden">
                {/* Save as Draft Badge */}
                <AnimatePresence>
                    {isDirty && !isReadOnly && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute top-6 right-8 flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">Unsaved Progress</span>
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-4xl mx-auto py-4">
                    <header className="mb-10">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-foreground">{currentStep.title}</h2>
                        {currentStep.description && (
                            <p className="text-sm text-muted-foreground mt-2 font-medium italic">{currentStep.description}</p>
                        )}
                    </header>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mb-8"
                        >
                            <Alert variant="destructive" className="rounded-2xl border-rose-500/50 bg-rose-500/5">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle className="text-xs font-black uppercase tracking-widest">Operation Protocol Failure</AlertTitle>
                                <AlertDescription className="text-[10px] font-bold opacity-80 uppercase tracking-tight">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {typeof children === 'function' ? children(context) : children}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-12 pt-8 border-t border-border/20 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {!isReadOnly && (
                                <Button
                                    variant="outline"
                                    onClick={saveDraft}
                                    disabled={!isDirty || isSubmitting}
                                    className="rounded-xl px-4 h-11 text-[10px] font-black uppercase tracking-widest border-border/40 gap-2"
                                >
                                    <Save size={14} className="text-amber-500" />
                                    Save Progress
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {!isFirstStep && (
                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    className="rounded-xl px-6 h-11 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
                                >
                                    <ChevronLeft size={16} className="mr-2" /> Back
                                </Button>
                            )}

                            {isLastStep ? (
                                <Button
                                    onClick={() => {
                                        if (window.confirm("FINAL PROTOCOL CHECK: Are you sure you want to commit this data? This action will seal the record for workflow processing.")) {
                                            submitForm();
                                        }
                                    }}
                                    disabled={isSubmitting || isReadOnly}
                                    variant="premium"
                                    className="rounded-xl px-8 h-11 text-[10px] font-black uppercase tracking-widest gap-2"
                                >
                                    {isSubmitting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <CheckCircle2 size={16} />
                                    )}
                                    Final Submission
                                </Button>
                            ) : (
                                <Button
                                    onClick={nextStep}
                                    disabled={isValidating || isSubmitting}
                                    className="rounded-xl px-8 h-11 text-[10px] font-black uppercase tracking-widest gap-2 bg-primary hover:bg-primary/90"
                                >
                                    {isValidating ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <>Continue <ChevronRight size={16} /></>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export function StepForm<T>(props: StepFormProps<T>) {
    return (
        <StepFormProvider<T>
            steps={props.steps}
            initialData={props.initialData}
            status={props.status}
            isReadOnly={props.isReadOnly}
            onSaveDraft={props.onSaveDraft}
            onSubmit={props.onSubmit}
            persistenceKey={props.id}
        >
            <StepFormInternal<T> className={props.className}>
                {props.children}
            </StepFormInternal>
        </StepFormProvider>
    );
}
