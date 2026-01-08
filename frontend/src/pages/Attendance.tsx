import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { attendanceApi } from '@/services/api';
import { Attendance } from '@/types';
import { Clock, LogIn, LogOut, Calendar, Download, Search, Users, MapPin, SearchCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const AttendancePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await attendanceApi.getReport();
      setAttendance(response.data || []);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      const errorMessage = error.message || 'Failed to initialize attendance feed';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const stats = useMemo(() => ({
    present: attendance.filter(a => a.status === 'PRESENT').length,
    late: attendance.filter(a => a.status === 'LATE').length,
    leave: attendance.filter(a => a.status === 'ON_LEAVE').length,
    absent: attendance.filter(a => a.status === 'ABSENT').length
  }), [attendance]);

  const filteredAttendance = useMemo(() => {
    if (!searchTerm) return attendance;
    const s = searchTerm.toLowerCase();
    return attendance.filter(a =>
      `${a.employee?.firstName} ${a.employee?.lastName}`.toLowerCase().includes(s) ||
      a.employee?.email?.toLowerCase().includes(s)
    );
  }, [attendance, searchTerm]);

  if (authLoading) return <div className="p-12 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  if (!user) return <div className="p-12 text-center text-rose-500 font-bold">Unauthorized Session</div>;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-8 space-y-8"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Daily Attendance"
          description="Real-time monitoring of personnel presence and check-in metrics."
          className="bg-header-gradient p-8 rounded-3xl border border-border/30 shadow-premium"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlinePremium" size="sm" className="hidden sm:flex">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Button variant="premium" size="sm" className="shadow-lg shadow-primary/25">
              <LogIn className="mr-2 h-4 w-4" /> Check In
            </Button>
            <Button variant="outline" size="sm" className="border-border/40">
              <LogOut className="mr-2 h-4 w-4" /> Check Out
            </Button>
          </div>
        </PageHeader>
      </motion.div>

      {/* Analytics Grid */}
      <motion.div
        variants={slideUpVariants}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Card className="border-emerald-500/10 bg-emerald-500/5 backdrop-blur-sm relative overflow-hidden group">
          <CardContent className="p-6 pt-7">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Present Personnel</p>
                <div className="text-3xl font-black mt-2 text-emerald-600">{stats.present}</div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform shadow-sm">
                <Users size={22} />
              </div>
            </div>
            <div className="mt-4 h-1 w-full bg-emerald-500/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-emerald-500/50" />
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl" />
        </Card>

        <Card className="border-amber-500/10 bg-amber-500/5 backdrop-blur-sm relative overflow-hidden group">
          <CardContent className="p-6 pt-7">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Late Arrivals</p>
                <div className="text-3xl font-black mt-2 text-amber-600">{stats.late}</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform shadow-sm">
                <Clock size={22} />
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl" />
        </Card>

        <Card className="border-sky-500/10 bg-sky-500/5 backdrop-blur-sm relative overflow-hidden group">
          <CardContent className="p-6 pt-7">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Documented Leave</p>
                <div className="text-3xl font-black mt-2 text-sky-600">{stats.leave}</div>
              </div>
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 group-hover:scale-110 transition-transform shadow-sm">
                <Calendar size={22} />
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-500/5 rounded-full blur-2xl" />
        </Card>

        <Card className="border-rose-500/10 bg-rose-500/5 backdrop-blur-sm relative overflow-hidden group">
          <CardContent className="p-6 pt-7">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Absent/Excused</p>
                <div className="text-3xl font-black mt-2 text-rose-600">{stats.absent}</div>
              </div>
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 group-hover:scale-110 transition-transform shadow-sm">
                <AlertCircle size={22} />
              </div>
            </div>
          </CardContent>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/5 rounded-full blur-2xl" />
        </Card>
      </motion.div>

      <motion.div variants={slideUpVariants}>
        <Card className="border-border/30 shadow-premium overflow-hidden bg-white/40 backdrop-blur-md rounded-3xl">
          <CardHeader className="px-8 py-6 border-b border-border/20 bg-muted/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <SearchCheck size={20} className="text-primary" />
              Live Attendance Feed
            </CardTitle>
            <div className="relative w-full md:w-80 group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Locate member..."
                className="h-10 pl-10 rounded-xl bg-background/50 border-border/40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/10">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <div className="p-16 text-center">
                    <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase italic">Streaming records...</p>
                  </div>
                ) : filteredAttendance.length > 0 ? (
                  filteredAttendance.map((record, idx) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, scale: 0.98, y: 5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center justify-between px-8 py-5 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <Avatar className="h-12 w-12 rounded-2xl border border-border/40 shadow-sm group-hover:scale-110 transition-transform">
                            <AvatarFallback className="bg-primary/5 text-primary text-sm font-black">
                              {record.employee?.firstName?.[0]}{record.employee?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className={cn(
                            "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background",
                            record.status === 'PRESENT' ? "bg-emerald-500" : record.status === 'LATE' ? "bg-amber-500" : "bg-slate-400"
                          )} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{record.employee?.firstName} {record.employee?.lastName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="px-2 py-0 h-4 text-[10px] font-black uppercase bg-muted/50 text-muted-foreground">
                              ID: {record.id.slice(0, 8).toUpperCase()}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground/60 font-bold flex items-center gap-1">
                              <MapPin size={10} /> HQ - Section A
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-center">
                          <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Entry</span>
                          <span className="text-xs font-black font-mono">{record.checkIn || '--:--'}</span>
                        </div>
                        <div className="hidden md:flex flex-col items-center">
                          <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">Exit</span>
                          <span className="text-xs font-black font-mono">{record.checkOut || '--:--'}</span>
                        </div>
                        <StatusBadge status={record.status} />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-24">
                    <div className="w-20 h-20 bg-muted/40 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-muted-foreground/20 shadow-inner">
                      <Users size={40} />
                    </div>
                    <p className="text-xl font-black text-foreground uppercase tracking-widest">No Intelligence Trace</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto italic">We could not locate any active personnel records matching your search scope.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
          <div className="px-8 py-5 bg-muted/10 border-t border-border/20 flex items-center justify-between">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Personnel Stream Active</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">System Operational</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default AttendancePage;