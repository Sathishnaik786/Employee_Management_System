import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createDailyUpdate } from './dailyUpdates.api';
import { toast } from 'sonner';

interface DailyStandupFormProps {
    onSuccess?: () => void;
}

const DailyStandupForm: React.FC<DailyStandupFormProps> = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        yesterday: '',
        today: '',
        blockers: '',
        title: `Daily Update - ${new Date().toLocaleDateString()}`
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.yesterday || !formData.today) {
            toast.error('Please fill in at least yesterday and today fields');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                update_type: 'DAILY',
                title: formData.title,
                content: {
                    yesterday: formData.yesterday,
                    today: formData.today,
                    blockers: formData.blockers
                }
            };

            await createDailyUpdate(payload);
            toast.success('Daily update submitted successfully!');
            setFormData({
                yesterday: '',
                today: '',
                blockers: '',
                title: `Daily Update - ${new Date().toLocaleDateString()}`
            });
            if (onSuccess) onSuccess();
        } catch (error: any) {
            console.error('Error submitting daily update:', error);
            toast.error(error.message || 'Failed to submit daily update');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/10">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                        New Daily Standup
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="yesterday">What did you do yesterday? *</Label>
                        <Textarea
                            id="yesterday"
                            placeholder="List your key achievements from yesterday..."
                            value={formData.yesterday}
                            onChange={(e) => setFormData({ ...formData, yesterday: e.target.value })}
                            className="min-h-[100px] resize-none focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="today">What will you do today? *</Label>
                        <Textarea
                            id="today"
                            placeholder="What are your goals for today?"
                            value={formData.today}
                            onChange={(e) => setFormData({ ...formData, today: e.target.value })}
                            className="min-h-[100px] resize-none focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="blockers">Any blockers?</Label>
                        <Textarea
                            id="blockers"
                            placeholder="Anything stopping your progress?"
                            value={formData.blockers}
                            onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                            className="min-h-[80px] resize-none focus:ring-primary"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full sm:w-auto ml-auto"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Update'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default DailyStandupForm;
