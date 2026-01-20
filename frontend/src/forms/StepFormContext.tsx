import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StepConfig, FormStatus } from './types';

interface StepFormContextType<T = any> {
    currentStepIndex: number;
    steps: StepConfig[];
    data: Partial<T>;
    isDirty: boolean;
    isValidating: boolean;
    isSubmitting: boolean;
    isReadOnly: boolean;
    status: FormStatus;
    error: string | null;

    // Actions
    goToStep: (index: number) => void;
    nextStep: () => Promise<boolean>;
    prevStep: () => void;
    updateData: (updates: Partial<T>) => void;
    saveDraft: () => Promise<void>;
    submitForm: () => Promise<void>;

    // State helpers
    canGoNext: boolean;
    canGoPrev: boolean;
    isLastStep: boolean;
    isFirstStep: boolean;
}

const StepFormContext = createContext<StepFormContextType | undefined>(undefined);

export function useStepForm<T = any>() {
    const context = useContext(StepFormContext);
    if (!context) {
        throw new Error('useStepForm must be used within a StepFormProvider');
    }
    return context as StepFormContextType<T>;
}

interface StepFormProviderProps<T> {
    steps: StepConfig[];
    initialData?: Partial<T>;
    status?: FormStatus;
    isReadOnly?: boolean;
    onSaveDraft?: (data: Partial<T>) => Promise<void>;
    onSubmit: (data: T) => Promise<void>;
    persistenceKey?: string;
    children: React.ReactNode;
}

export function StepFormProvider<T>({
    steps,
    initialData = {},
    status = 'DRAFT',
    isReadOnly = false,
    onSaveDraft,
    onSubmit,
    persistenceKey,
    children
}: StepFormProviderProps<T>) {
    // Current Step
    const [currentStepIndex, setCurrentStepIndex] = useState(() => {
        if (persistenceKey) {
            const saved = localStorage.getItem(`${persistenceKey}_step`);
            return saved ? parseInt(saved, 10) : 0;
        }
        return 0;
    });

    // Form Data
    const [data, setData] = useState<Partial<T>>(() => {
        if (persistenceKey) {
            const savedData = localStorage.getItem(`${persistenceKey}_data`);
            if (savedData) return { ...initialData, ...JSON.parse(savedData) };
        }
        return initialData;
    });
    const [isDirty, setIsDirty] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Persistence & Auto-save
    useEffect(() => {
        if (persistenceKey) {
            localStorage.setItem(`${persistenceKey}_step`, currentStepIndex.toString());
            localStorage.setItem(`${persistenceKey}_data`, JSON.stringify(data));
        }
    }, [currentStepIndex, data, persistenceKey]);

    // Cleanup on successful submission
    const clearPersistence = useCallback(() => {
        if (persistenceKey) {
            localStorage.removeItem(`${persistenceKey}_step`);
            localStorage.removeItem(`${persistenceKey}_data`);
        }
    }, [persistenceKey]);

    const updateData = useCallback((updates: Partial<T>) => {
        setData(prev => {
            const newData = { ...prev, ...updates };
            // Simple check for deep changes could be added here
            setIsDirty(true);
            return newData;
        });
    }, []);

    const goToStep = useCallback((index: number) => {
        if (index >= 0 && index < steps.length) {
            setCurrentStepIndex(index);
        }
    }, [steps.length]);

    const validateStep = async (index: number): Promise<boolean> => {
        const step = steps[index];
        if (!step.validationSchema) return true;

        setIsValidating(true);
        try {
            // Validate only current step data
            // In a real implementation, we'd pass the whole data but filter for step-specific fields
            // Or use a partial schema
            await step.validationSchema.parseAsync(data);
            return true;
        } catch (error) {
            console.error('Validation Error:', error);
            return false;
        } finally {
            setIsValidating(false);
        }
    };

    const nextStep = useCallback(async () => {
        const isValid = await validateStep(currentStepIndex);
        if (isValid && currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            return true;
        }
        return false;
    }, [currentStepIndex, steps, data]);

    const prevStep = useCallback(() => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    }, [currentStepIndex]);

    const saveDraft = useCallback(async () => {
        if (onSaveDraft) {
            await onSaveDraft(data);
            setIsDirty(false);
        }
    }, [data, onSaveDraft]);

    const submitForm = useCallback(async () => {
        // Final validation of all steps
        setIsValidating(true);
        try {
            // Realistically we'd validate the whole schema here
            setIsSubmitting(true);
            setError(null);
            await onSubmit(data as T);
            clearPersistence();
            setIsDirty(false);
        } catch (err: any) {
            console.error('Submit Error:', err);
            setError(err.message || 'Operation Protocol Failure');
            throw err;
        } finally {
            setIsSubmitting(false);
            setIsValidating(false);
        }
    }, [data, onSubmit, steps]);

    const value: StepFormContextType<T> = {
        currentStepIndex,
        steps,
        data,
        isDirty,
        isValidating,
        isSubmitting,
        isReadOnly: isReadOnly || (status !== 'DRAFT' && status !== 'RETURNED'),
        status,
        error,
        goToStep,
        nextStep,
        prevStep,
        updateData,
        saveDraft,
        submitForm,
        canGoNext: currentStepIndex < steps.length - 1,
        canGoPrev: currentStepIndex > 0,
        isLastStep: currentStepIndex === steps.length - 1,
        isFirstStep: currentStepIndex === 0
    };

    return (
        <StepFormContext.Provider value={value}>
            {children}
        </StepFormContext.Provider>
    );
}
