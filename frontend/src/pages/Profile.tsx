import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Mail,
  MapPin,
  Calendar,
  Edit,
  GraduationCap,
  Camera,
  Loader2,
  User,
  Shield,
  Fingerprint,
  Globe,
  School
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/services/api';
import { staggerContainer, slideUpVariants } from '@/animations/motionVariants';
import { Badge } from '@/components/ui/badge';

/**
 * IERS - Institutional Identity Profile
 * Strictly handles educational credentials and academic records.
 */
export default function Profile() {
  const { user, isLoading: authLoading, updateProfileImage } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfileData = useCallback(async () => {
    if (!user) return;
    try {
      // Use the IERS-pure "me" endpoint which now returns the full identity
      const response = await authApi.getMe();
      if (response.success && response.data?.user) {
        setProfileData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching IERS profile:', error);
      toast({
        title: 'Identity Error',
        description: 'Failed to synchronize institutional profile.',
        variant: 'destructive',
      });
    }
  }, [user, toast]);

  useEffect(() => {
    if (user && !authLoading && !profileData) {
      fetchProfileData();
    }
  }, [user?.id, authLoading, profileData, fetchProfileData]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Image upload logic will be linked to IERS storage buckets
      toast({ title: 'IERS Storage', description: 'Institutional image repository is currently read-only.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Upload failed.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) return <div className="p-12 text-center text-rose-500 font-bold">Unauthorized Session</div>;

  const displayUser = profileData || user;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="p-6 lg:p-10 space-y-10 max-w-[1400px] mx-auto"
    >
      <motion.div variants={slideUpVariants}>
        <PageHeader
          title="Institutional Identity"
          description="Manage your academic credentials and verified institutional records."
          className="bg-header-gradient p-10 rounded-[2.5rem] border border-white/10 shadow-premium"
        >
          <Button variant="premium" disabled className="shadow-lg shadow-primary/25 opacity-50">
            Official Record Sealed
          </Button>
        </PageHeader>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Card */}
        <motion.div variants={slideUpVariants} className="lg:col-span-1">
          <Card className="h-full border-white/10 shadow-premium bg-white/5 backdrop-blur-xl rounded-[3rem] overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent relative">
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="w-36 h-36 rounded-[2.5rem] border-4 border-background shadow-2xl overflow-hidden bg-muted">
                    {displayUser.profile_image ? (
                      <img src={displayUser.profile_image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary text-4xl font-black">
                        {displayUser.fullName?.[0]}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-3 rounded-2xl bg-primary text-white shadow-xl hover:scale-110 transition-transform"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                  </button>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageUpload} />
                </div>
              </div>
            </div>

            <CardContent className="pt-20 pb-12 px-8 text-center space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{displayUser.fullName}</h2>
                <p className="text-primary font-bold mt-1 uppercase tracking-[0.2em] text-[10px]">{displayUser.iersId || 'PENDING VERIFICATION'}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge className="rounded-xl px-4 py-1.5 bg-primary/10 text-primary border-none font-black text-[10px]">
                  {displayUser.role}
                </Badge>
                <Badge className="rounded-xl px-4 py-1.5 bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px]">
                  ACTIVE
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Academic Records */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={slideUpVariants}>
            <Card className="border-white/5 shadow-premium bg-white/5 backdrop-blur-md rounded-[2.5rem] h-full">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                  <Fingerprint size={16} className="text-primary" /> Core Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5">
                  <Mail size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40">Registered Email</p>
                    <p className="text-sm font-bold">{displayUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5">
                  <School size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40">Affiliation</p>
                    <p className="text-sm font-bold">Integrated Resource & Education System</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={slideUpVariants}>
            <Card className="border-white/5 shadow-premium bg-white/5 backdrop-blur-md rounded-[2.5rem] h-full">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 opacity-60">
                  <GraduationCap size={16} className="text-primary" /> Academic Taxonomy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5">
                  <Calendar size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40">Admission Cohort</p>
                    <p className="text-sm font-bold">Academic Year 2025-26</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 rounded-3xl bg-white/5 border border-white/5">
                  <Globe size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-40">Citizenship / Locale</p>
                    <p className="text-sm font-bold">Standard Institutional Jurisdiction</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={slideUpVariants} className="md:col-span-2">
            <Card className="border-primary/20 shadow-premium bg-primary/5 rounded-[3rem]">
              <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-black">Institutional Data Sealed</h3>
                  <p className="text-sm text-muted-foreground">This profile is cryptographically linked to your institutional identity. Any changes must be approved by the Registrar office.</p>
                </div>
                <Button variant="outline" className="rounded-2xl font-black text-xs px-8">Contact Registrar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}