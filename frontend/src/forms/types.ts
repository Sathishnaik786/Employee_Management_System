import { ReactNode } from 'react';
import { ZodSchema } from 'zod';

export type FormStatus = 'DRAFT' | 'SUBMITTED' | 'RETURNED' | 'APPROVED' | 'REJECTED';

export interface StepConfig {
    id: string;
    title: string;
    description?: string;
    validationSchema?: ZodSchema;
    isOptional?: boolean;
}

export interface StepFormProps<T> {
    id: string; // Unique form identifier for persistence
    steps: StepConfig[];
    initialData?: Partial<T>;
    onSubmit: (data: T) => Promise<void>;
    onSaveDraft?: (data: Partial<T>) => Promise<void>;
    status?: FormStatus;
    isReadOnly?: boolean;
    children: ReactNode | ((context: any) => ReactNode);
    className?: string;
}

export interface FormStepContentProps<T> {
    stepId: string;
    isActive: boolean;
    data: Partial<T>;
    updateData: (updates: Partial<T>) => void;
    errors?: any;
    isReadOnly?: boolean;
}

export interface EvidenceRecord {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    version: number;
    uploadedBy: string;
    uploadedAt: string;
    category?: string;
    description?: string;
}

export interface EvidencePanelProps {
    records: EvidenceRecord[];
    onUpload: (file: File, metadata?: any) => Promise<void>;
    onReplace: (id: string, file: File) => Promise<void>;
    onDelete?: (id: string) => Promise<void>;
    isReadOnly?: boolean;
    maxFiles?: number;
    allowedTypes?: string[];
    title?: string;
}
