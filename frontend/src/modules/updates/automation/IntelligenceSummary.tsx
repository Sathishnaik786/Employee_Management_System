import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, BookOpen, Quote } from 'lucide-react';
import { getIntelligenceSummary } from './automation.api';
import { toast } from 'sonner';

const IntelligenceSummary: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    const handleGenerate = async (type: string) => {
        setLoading(true);
        try {
            const res = await getIntelligenceSummary(type);
            setSummary(res.data);
            toast.success('AI insights generated');
        } catch (e) {
            toast.error('Failed to generate summary.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-900/5 to-purple-900/5 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="h-32 w-32 text-indigo-500" />
            </div>

            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                        <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                        AI Impact Synthesis
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerate('WEEKLY')}
                            disabled={loading}
                            className="text-[10px] font-black uppercase rounded-xl h-8 border-indigo-500/20"
                        >
                            Summarize Daily
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerate('MONTHLY')}
                            disabled={loading}
                            className="text-[10px] font-black uppercase rounded-xl h-8 border-purple-500/20"
                        >
                            Summarize Weekly
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="min-h-[160px] flex flex-col justify-center">
                {!summary ? (
                    <div className="text-center py-10">
                        <BookOpen className="h-8 w-8 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">
                            Generate a synthetic summary of your recent updates to identify patterns and growth signals.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="relative">
                            <Quote className="absolute -top-4 -left-2 h-8 w-8 text-indigo-500/10" />
                            <p className="text-base font-semibold text-foreground/80 leading-relaxed italic pl-6">
                                {summary.text || summary}
                            </p>
                        </div>

                        {summary.keyHighlights && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Key Outcomes</h4>
                                    <ul className="space-y-2">
                                        {summary.keyHighlights.map((h: string, i: number) => (
                                            <li key={i} className="text-xs font-bold flex items-center gap-2">
                                                <ArrowRight className="h-3 w-3 text-emerald-500" />
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-2">Strategic Suggestion</h4>
                                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                        {summary.suggestion}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IntelligenceSummary;
