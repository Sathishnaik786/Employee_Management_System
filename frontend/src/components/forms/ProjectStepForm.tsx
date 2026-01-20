import React from 'react';
import * as z from 'zod';
import { StepForm } from '@/forms/StepForm';
import { StepConfig } from '@/forms/types';
import { EvidencePanel } from '@/forms/evidence/EvidencePanel';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Briefcase, Users, Target, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ProjectFormData, Employee } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const identitySchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    project_type: z.string().min(1, 'Project type is required'),
    manager_id: z.string().min(1, 'Manager is required'),
});

const timelineSchema = z.object({
    status: z.string().min(1, 'Status is required'),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    client_id: z.string().optional(),
    description: z.string().optional(),
});

interface ProjectStepFormProps {
    onSubmit: (data: ProjectFormData) => void;
    onCancel: () => void;
    initialData?: ProjectFormData;
    employees: Employee[];
    loading?: boolean;
}

export const ProjectStepForm: React.FC<ProjectStepFormProps> = ({
    onSubmit,
    onCancel,
    initialData,
    employees,
    loading
}) => {
    const steps: StepConfig[] = [
        {
            id: 'identity',
            title: 'Core Identity',
            description: 'Define the operation signature and lead strategist.',
            validationSchema: identitySchema
        },
        {
            id: 'timeline',
            title: 'Parameter Metrics',
            description: 'Set execution window and client association.',
            validationSchema: timelineSchema
        },
        {
            id: 'evidence',
            title: 'Compliance Archive',
            description: 'Seal supporting documentation and evidence.'
        },
    ];

    const handleFinalSubmit = async (data: any) => {
        onSubmit(data as ProjectFormData);
    };

    return (
        <StepForm<any>
            id="project_deployment"
            steps={steps}
            initialData={initialData}
            onSubmit={handleFinalSubmit}
            onSaveDraft={async (data) => console.log('Draft Saved:', data)}
            className="max-w-5xl mx-auto"
        >
            {({ currentStepIndex, data, updateData, isReadOnly }: any) => (
                <div className="min-h-[400px]">
                    {currentStepIndex === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Operation Signature</FormLabel>
                                <Input
                                    placeholder="Enter project name..."
                                    value={data.name || ''}
                                    onChange={(e) => updateData({ name: e.target.value })}
                                    className="h-12 bg-background/50 rounded-xl"
                                    disabled={isReadOnly}
                                />
                                <p className="text-[10px] text-muted-foreground italic">Required for archival indexing.</p>
                            </div>

                            <div className="space-y-4">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Strategic Category</FormLabel>
                                <Select
                                    value={data.project_type || ''}
                                    onValueChange={(val) => updateData({ project_type: val })}
                                    disabled={isReadOnly}
                                >
                                    <SelectTrigger className="h-12 bg-background/50 rounded-xl">
                                        <SelectValue placeholder="Select Deployment Type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl glass-panel-dark">
                                        <SelectItem value="WEBSITE">W3 Protocol (Website)</SelectItem>
                                        <SelectItem value="MOBILE_APP">Neural Link (Mobile)</SelectItem>
                                        <SelectItem value="SOFTWARE_PRODUCT">Core Software</SelectItem>
                                        <SelectItem value="CLOUD">Cloud Infrastructure</SelectItem>
                                        <SelectItem value="INTERNAL">Internal Operation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-2 space-y-4 pt-4 border-t border-border/10">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Lead Strategist (Manager)</FormLabel>
                                <Select
                                    value={data.manager_id || ''}
                                    onValueChange={(val) => updateData({ manager_id: val })}
                                    disabled={isReadOnly}
                                >
                                    <SelectTrigger className="h-14 bg-background/50 rounded-xl">
                                        <SelectValue placeholder="Assign Primary Command" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl glass-panel-dark max-h-[300px]">
                                        {employees.map(emp => (
                                            <SelectItem key={emp.id} value={emp.id} className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                                                        {emp.firstName[0]}{emp.lastName[0]}
                                                    </div>
                                                    <span className="font-bold">{emp.firstName} {emp.lastName}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {currentStepIndex === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="space-y-4">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Operational Status</FormLabel>
                                <Select
                                    value={data.status || 'CREATED'}
                                    onValueChange={(val) => updateData({ status: val })}
                                    disabled={isReadOnly}
                                >
                                    <SelectTrigger className="h-12 bg-background/50 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl glass-panel-dark">
                                        <SelectItem value="CREATED">Archive Created</SelectItem>
                                        <SelectItem value="IN_PROGRESS">Active Signal</SelectItem>
                                        <SelectItem value="ON_HOLD">Operation Suspended</SelectItem>
                                        <SelectItem value="COMPLETED">Mission Success</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Timeline Window</FormLabel>
                                <div className="grid grid-cols-2 gap-4">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-12 rounded-xl justify-start text-xs font-bold gap-2 bg-background/50"
                                                disabled={isReadOnly}
                                            >
                                                <CalendarIcon size={14} className="text-primary" />
                                                {data.start_date ? format(new Date(data.start_date), 'PP') : 'Start'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={data.start_date ? new Date(data.start_date) : undefined}
                                                onSelect={(date) => updateData({ start_date: date?.toISOString() })}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-12 rounded-xl justify-start text-xs font-bold gap-2 bg-background/50"
                                                disabled={isReadOnly}
                                            >
                                                <CalendarIcon size={14} className="text-amber-500" />
                                                {data.end_date ? format(new Date(data.end_date), 'PP') : 'End'}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={data.end_date ? new Date(data.end_date) : undefined}
                                                onSelect={(date) => updateData({ end_date: date?.toISOString() })}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-4 pt-4 border-t border-border/10">
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Mission Brief / Objectives</FormLabel>
                                <Textarea
                                    rows={5}
                                    placeholder="Outline primary directives and scope..."
                                    value={data.description || ''}
                                    onChange={(e) => updateData({ description: e.target.value })}
                                    className="bg-background/50 rounded-2xl p-4 resize-none"
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    )}

                    {currentStepIndex === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <EvidencePanel
                                records={[]} // Placeholder for demo
                                onUpload={async (file) => console.log('Uploading:', file)}
                                onReplace={async (id, file) => console.log('Replacing:', id, file)}
                                title="Project Charter & Approval Evidence"
                                isReadOnly={isReadOnly}
                            />

                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-4">
                                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">Compliance Protocol</h4>
                                    <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                                        By proceeding with submission, you verify that all strategic parameters have been validated and supporting evidence is authentic. This record will be sealed in the institutional archive.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </StepForm>
    );
};
