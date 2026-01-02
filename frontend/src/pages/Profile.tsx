import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, MapPin, Calendar, Edit, Building2, Briefcase } from 'lucide-react';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { employeesApi, authApi } from '@/services/api';
import { EmployeeFormData, Employee, User } from '@/types';

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Get user auth info from /auth/me
        const authUser = await authApi.me();
        console.log('API DATA: Auth user data:', authUser);
        
        // Get full employee profile using employeeId from auth
        if (authUser.user?.employeeId) {
          const emp = await employeesApi.getById(authUser.user.employeeId);
          console.log('API DATA: Full employee data:', emp);
          setEmployee(emp || undefined);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load profile data',
          variant: 'destructive',
        });
        setEmployee(undefined);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      const updatedEmployee = await employeesApi.updateProfile(data);
      setEmployee(updatedEmployee);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error: any) {
      throw error;
    }
  };

  if (authLoading) {
    return (
      <>
        <PageHeader title="Profile" description="Manage your personal information" />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <p>Initializing session…</p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title="Profile" description="Manage your personal information" />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <p>Unauthorized</p>
          </CardContent>
        </Card>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Profile" description="Manage your personal information" />
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
            <div className="mt-6">
              <Skeleton className="h-10 w-full md:w-32" />
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Profile" description="Manage your personal information" />
      
      <CrudModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Edit Profile"
        size="xl"
      >
        <EmployeeForm
          employee={employee || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </CrudModal>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.email?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{employee?.firstName} {employee?.lastName}</CardTitle>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span>{user?.email}</span>
            </div>
            {employee?.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{employee?.phone}</span>
              </div>
            )}
            {employee?.department?.name && (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 text-muted-foreground flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <span>{employee?.department?.name}</span>
              </div>
            )}
            {employee?.position && (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 text-muted-foreground flex items-center justify-center">
                  <Briefcase className="h-4 w-4" />
                </div>
                <span>{employee?.position}</span>
              </div>
            )}
            {employee?.dateOfJoining && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>{new Date(employee?.dateOfJoining).toLocaleDateString()}</span>
              </div>
            )}
            {(employee?.city || employee?.state) && (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{employee?.city}{employee?.city && employee?.state ? ', ' : ''}{employee?.state}</span>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Button onClick={handleEditProfile} disabled={loading} className="w-full md:w-auto">
              <Edit className="h-4 w-4 mr-2" />
              {loading ? 'Loading...' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}