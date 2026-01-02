import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

const deptData = [{ name: 'Engineering', count: 24 }, { name: 'Sales', count: 18 }, { name: 'Operations', count: 15 }, { name: 'Marketing', count: 12 }, { name: 'Finance', count: 10 }, { name: 'HR', count: 8 }];
const leaveData = [{ name: 'Annual', value: 85 }, { name: 'Sick', value: 42 }, { name: 'Personal', value: 18 }];
const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))'];

export default function Reports() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <>
        <PageHeader title="Reports" description="Analytics and insights" />
        <div className="p-4">Initializing session…</div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title="Reports" description="Analytics and insights" />
        <div className="p-4">Unauthorized</div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Reports" description="Analytics and insights" />
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Employees by Department</CardTitle></CardHeader><CardContent className="h-[300px]">
          <ResponsiveContainer><BarChart data={deptData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={12} /><YAxis /><Tooltip /><Bar dataKey="count" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>Leave Distribution</CardTitle></CardHeader><CardContent className="h-[300px]">
          <ResponsiveContainer><PieChart><Pie data={leaveData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
            {leaveData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie><Tooltip /></PieChart></ResponsiveContainer>
        </CardContent></Card>
      </div>
    </>
  );
}
