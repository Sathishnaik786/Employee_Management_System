import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileIcon,
    Trash2,
    ExternalLink,
    History,
    ShieldCheck,
    AlertCircle,
    FileText,
    Image as ImageIcon,
    FileCode,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EvidenceRecord, EvidencePanelProps } from '../types';

const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon size={18} />;
    if (type.includes('pdf')) return <FileText size={18} />;
    if (type.includes('code')) return <FileCode size={18} />;
    return <FileIcon size={18} />;
};

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
    records,
    onUpload,
    onReplace,
    onDelete,
    isReadOnly = false,
    maxFiles = 10,
    allowedTypes = ['application/pdf', 'image/*'],
    title = "Evidence & Documentation"
}) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
    };

    return (
        <Card className="border-border/30 bg-muted/5 rounded-[1.5rem] overflow-hidden">
            <div className="px-6 py-4 border-b border-border/20 bg-muted/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-widest">{title}</h3>
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter bg-background/50">
                    {records.length} / {maxFiles} Files
                </Badge>
            </div>

            <div className="p-6 space-y-4">
                {/* Upload Zone */}
                {!isReadOnly && records.length < maxFiles && (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) onUpload(file); }}
                        className={cn(
                            "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer",
                            isDragging
                                ? "border-primary bg-primary/5 scale-[0.99]"
                                : "border-border/40 bg-background/40 hover:border-primary/40 hover:bg-muted/5"
                        )}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                            accept={allowedTypes.join(',')}
                        />
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <Upload size={24} />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black uppercase tracking-widest text-foreground">Upload Supporting Evidence</p>
                            <p className="text-[10px] text-muted-foreground mt-1 font-medium">Drag & drop or click to browse (Max 20MB)</p>
                        </div>
                    </div>
                )}

                {/* Evidence List */}
                <div className="grid gap-3">
                    <AnimatePresence mode="popLayout">
                        {records.map((record, index) => (
                            <motion.div
                                key={record.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="group flex items-center gap-4 p-4 rounded-xl border border-border/20 bg-background/60 hover:border-primary/20 transition-all shadow-sm"
                            >
                                <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
                                    {getFileIcon(record.fileType)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold truncate text-foreground">{record.fileName}</p>
                                        <Badge variant="outline" className="h-4 px-1 text-[8px] font-black uppercase bg-primary/5 text-primary border-primary/20">
                                            v{record.version}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-[9px] font-black uppercase text-muted-foreground opacity-60 tracking-tighter">
                                        <span>{(record.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                        <span>•</span>
                                        <span>{record.uploadedAt}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><History size={8} /> History Available</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" asChild>
                                                    <a href={record.fileUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>View / Refresh Uplink</TooltipContent>
                                        </Tooltip>

                                        {!isReadOnly && (
                                            <>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-lg text-amber-600 hover:bg-amber-500/10"
                                                            onClick={() => {
                                                                const input = document.createElement('input');
                                                                input.type = 'file';
                                                                input.onchange = (e) => {
                                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                                    if (file) onReplace(record.id, file);
                                                                };
                                                                input.click();
                                                            }}
                                                        >
                                                            <RefreshCw size={14} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Replace / Version Up</TooltipContent>
                                                </Tooltip>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 rounded-lg text-rose-600 hover:bg-rose-500/10"
                                                            onClick={() => onDelete?.(record.id)}
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Decommission Record</TooltipContent>
                                                </Tooltip>
                                            </>
                                        )}
                                    </TooltipProvider>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {records.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground/40 border-2 border-dashed border-border/20 rounded-2xl bg-muted/5">
                            <AlertCircle size={32} className="opacity-20 mb-3" />
                            <p className="text-[10px] font-black uppercase tracking-widest">No Evidence Archives Found</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
