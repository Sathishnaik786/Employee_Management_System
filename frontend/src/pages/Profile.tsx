import { useState, useEffect, useRef, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, MapPin, Calendar, Edit, Building2, Briefcase, Camera, Loader2 } from 'lucide-react';
import { EmployeeForm } from '@/components/forms/EmployeeForm';
import { CrudModal } from '@/components/modals/CrudModal';
import { useToast } from '@/components/ui/use-toast';
import { employeesApi } from '@/services/api';
import { EmployeeFormData, Employee } from '@/types';

export default function Profile() {
  const { user, isLoading: authLoading, updateProfileImage } = useAuth();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoized fetch function to prevent infinite loops
  const fetchProfileData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's profile with signed image URL from backend
      const response = await employeesApi.getProfile();
      
      console.log('Profile API Response:', response); // Debug logging
      
      // Handle the response appropriately
      const emp = response;
      
      if (emp) {
        setEmployee(emp);
        // Backend returns signed URL in profile_image field
        if (emp.profile_image) {
          setProfileImageUrl(emp.profile_image);
          // Also update global auth context
          updateProfileImage(emp.profile_image);
        } else {
          setProfileImageUrl(null);
        }
      } else {
        setEmployee(undefined);
        setProfileImageUrl(null);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load profile data',
        variant: 'destructive',
      });
      setEmployee(undefined);
      setProfileImageUrl(null);
    } finally {
      setLoading(false);
    }
  }, [user, toast, updateProfileImage]);

  // Fetch profile data only once when user is available
  useEffect(() => {
    if (user && !authLoading) {
      fetchProfileData();
    }
  }, [user?.id, authLoading, fetchProfileData]);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (data: EmployeeFormData) => {
    try {
      // Only send allowed profile fields to updateProfile endpoint
      const { 
        firstName, 
        lastName, 
        dateOfBirth, 
        dateOfJoining, 
        zipCode, 
        emergencyContact, 
        emergencyPhone, 
        phone, 
        address, 
        city, 
        state, 
        country, 
        position,
        ...rest 
      } = data;
      
      const profileData: Partial<EmployeeFormData> = {};
      
      if (firstName !== undefined) profileData.firstName = firstName;
      if (lastName !== undefined) profileData.lastName = lastName;
      if (dateOfBirth !== undefined) profileData.dateOfBirth = dateOfBirth;
      if (dateOfJoining !== undefined) profileData.dateOfJoining = dateOfJoining;
      if (zipCode !== undefined) profileData.zipCode = zipCode;
      if (emergencyContact !== undefined) profileData.emergencyContact = emergencyContact;
      if (emergencyPhone !== undefined) profileData.emergencyPhone = emergencyPhone;
      if (phone !== undefined) profileData.phone = phone;
      if (address !== undefined) profileData.address = address;
      if (city !== undefined) profileData.city = city;
      if (state !== undefined) profileData.state = state;
      if (country !== undefined) profileData.country = country;
      if (position !== undefined) profileData.position = position;
      
      const updatedEmployee = await employeesApi.updateProfile(profileData);
      setEmployee(updatedEmployee);
      
      // Update profile image URL if it changed
      if (updatedEmployee.profile_image) {
        setProfileImageUrl(updatedEmployee.profile_image);
        updateProfileImage(updatedEmployee.profile_image);
      }
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      // Close modal and refetch profile data to ensure UI is updated
      setIsModalOpen(false);
      
      // Refetch profile data to ensure all changes are reflected
      await fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
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
        
        // Update local state
        setProfileImageUrl(newImageUrl);
        
        // Update global user state
        updateProfileImage(newImageUrl);
        
        // Update local employee state
        setEmployee(prev => prev ? { ...prev, profile_image: newImageUrl } : undefined);
        
        toast({
          title: 'Success',
          description: 'Profile image updated successfully',
        });
        
        // Refresh profile data to get latest signed URL
        await fetchProfileData();
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
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 w-40" />
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
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                {profileImageUrl || employee?.profile_image ? (
                  <img
                    src={profileImageUrl || employee?.profile_image}
                    alt="profile"
                    className="w-full h-full object-cover"
                    loading="eager"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      console.error('Profile image failed to load:', profileImageUrl);
                      setProfileImageUrl(null);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                    <span className="text-2xl font-bold text-white">
                      {employee?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      {employee?.lastName?.charAt(0) || user?.email?.charAt(1) || ''}
                    </span>
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
            
            {/* Show employee data if available, otherwise show a message */}
            {employee ? (
              <>
                {/* Personal Information */}
                {employee?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{employee?.phone}</span>
                  </div>
                )}
                {employee?.dateOfBirth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>DOB: {new Date(employee?.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                )}
                
                {/* Company Information */}
                {employee?.department?.name && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-muted-foreground flex items-center justify-center">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span>Dept: {employee?.department?.name}</span>
                  </div>
                )}
                {employee?.position && (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 text-muted-foreground flex items-center justify-center">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <span>Position: {employee?.position}</span>
                  </div>
                )}
                {employee?.role && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span>Role: {employee?.role}</span>
                  </div>
                )}
                {employee?.dateOfJoining && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>DOJ: {new Date(employee?.dateOfJoining).toLocaleDateString()}</span>
                  </div>
                )}
                
                {/* Location Information */}
                {employee?.country && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Country: {employee?.country}</span>
                  </div>
                )}
                {employee?.state && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>State: {employee?.state}</span>
                  </div>
                )}
                {employee?.city && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>City: {employee?.city}</span>
                  </div>
                )}
                {employee?.zipCode && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>ZIP: {employee?.zipCode}</span>
                  </div>
                )}
                {employee?.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Address: {employee?.address}</span>
                  </div>
                )}
                
                {/* Emergency Information */}
                {employee?.emergencyContact && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>Emergency Contact: {employee?.emergencyContact}</span>
                  </div>
                )}
                {employee?.emergencyPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>Emergency Phone: {employee?.emergencyPhone}</span>
                  </div>
                )}
                
                {/* Employment Information */}
                {employee?.salary && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span>Salary: ${employee?.salary.toLocaleString()}</span>
                  </div>
                )}
                {employee?.status && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span>Status: {employee?.status}</span>
                  </div>
                )}
                {employee?.manager?.firstName && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <span>Manager: {employee?.manager?.firstName} {employee?.manager?.lastName}</span>
                  </div>
                )}
                
                {/* Timestamps */}
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Created: {employee?.createdAt ? new Date(employee?.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Updated: {employee?.updatedAt ? new Date(employee?.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </>
            ) : (
              <div className="col-span-2 text-center py-4 text-muted-foreground">
                Employee profile data is not available. Please contact an administrator to set up your employee record.
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