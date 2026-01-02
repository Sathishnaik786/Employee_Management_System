import { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, MapPin, Calendar, Edit, Building2, Briefcase, Camera, Loader2 } from 'lucide-react';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { employeesApi, authApi } from '@/services/api';
import { EmployeeFormData, Employee, User } from '@/types';

export default function Profile() {
  const { user, isLoading: authLoading, updateProfileImage, refreshProfileImage } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Get user auth info from /auth.me
        const authUser = await authApi.me();
        console.log('API DATA: Auth user data:', authUser);
        
        // Get user's profile (not by employeeId, but by authenticated user)
        const emp = await employeesApi.getProfile();
        console.log('API DATA: Full employee data:', emp);
        setEmployee(emp || undefined);
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

  // Refresh profile image signed URL periodically
  useEffect(() => {
    if (user) {
      // Refresh profile image when component mounts
      refreshProfileImage();
      
      // Set up interval to refresh signed URL before it expires
      const interval = setInterval(() => {
        refreshProfileImage();
      }, 30 * 60 * 1000); // Refresh every 30 minutes
      
      return () => clearInterval(interval);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file (JPEG, PNG, GIF, WebP)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'File size exceeds 2MB limit',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);

      // Create form data to send the file
      const formData = new FormData();
      formData.append('image', file);

      // Upload the image to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3003/api'}/employees/profile/image`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header when using FormData, let browser set it with boundary
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to upload image');
      }

      // Update the employee state with new profile image
      if (result.data?.profile_image) {
        const newImageUrl = result.data.profile_image;
        
        // Update global user state immediately
        user?.id && updateProfileImage(newImageUrl);
        
        // Update local employee state
        setEmployee(prev => prev ? { ...prev, profile_image: newImageUrl } : undefined);
        
        toast({
          title: 'Success',
          description: 'Profile image updated successfully',
        });
        

      }
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload profile image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
          <div className="flex items-center gap-4 relative">
            <div className="relative h-20 w-20">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="profile"
                    className="w-full h-full object-cover"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl font-bold">{user?.email?.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
              </div>

              <div className="absolute bottom-2 right-2 z-10">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full border border-background"
                  onClick={triggerFileInput}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={uploading}
              />
            </div>
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