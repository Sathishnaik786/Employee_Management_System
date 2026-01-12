const { supabase } = require('@lib/supabase');
const multer = require('multer');
const NotificationService = require('./notification.service');
const ProfileImageService = require('./profileImage.service');
const CacheService = require('../services/cache.service');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: (req, file, cb) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Helper to map snake_case DB to camelCase Frontend
const mapEmployee = (emp) => {
    if (!emp) return null;
    return {
        ...emp,
        firstName: emp.first_name,
        lastName: emp.last_name,
        dateOfBirth: emp.date_of_birth,
        dateOfJoining: emp.date_of_joining,
        departmentId: emp.department_id,
        zipCode: emp.zip_code,
        emergencyContact: emp.emergency_contact,
        emergencyPhone: emp.emergency_phone,
        managerId: emp.manager_id,
        profile_image: emp.profile_image, // Map profile_image field
        avatar: emp.profile_image, // Also map to avatar for compatibility
        department: emp.department_name ? {
            name: emp.department_name, // Use department_name from employees table
            id: emp.department_id
        } : undefined,
        departmentName: emp.department_name // Also provide direct access to department_name
    };
};

// Get current user's profile
exports.getProfile = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('employees')
            .select('*, department:departments(*)')
            .eq('user_id', req.user.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: 'Profile not found' });

        // If profile_image exists, generate a signed URL
        let profileData = mapEmployee(data);
        if (data.profile_image) { // This should be the file path now
            try {
                const signedUrl = await ProfileImageService.generateSignedUrl(data.profile_image);
                if (signedUrl) {
                    profileData.profile_image = signedUrl; // Replace file path with signed URL
                } else {
                    // File doesn't exist in storage - clear the invalid path from DB
                    profileData.profile_image = null;
                    // Optionally clean up the invalid path from database (async, don't block response)
                    supabase
                        .from('employees')
                        .update({ profile_image: null })
                        .eq('user_id', req.user.id)
                        .then(() => {
                            console.log(`Cleaned up invalid profile_image path for user ${req.user.id}`);
                        })
                        .catch(cleanupError => {
                            console.error('Error cleaning up invalid profile_image:', cleanupError);
                        });
                }
            } catch (urlError) {
                console.error('Error generating signed URL for profile image:', urlError);
                // Set to null if signed URL generation fails
                profileData.profile_image = null;
            }
        }

        res.status(200).json({ success: true, data: profileData });
    } catch (err) {
        next(err);
    }
};

// Update current user's profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { firstName, lastName, dateOfBirth, dateOfJoining, zipCode, emergencyContact, emergencyPhone, phone, address, city, state, country, ...rest } = req.body;

        // Only allow updating specific fields for profile (not role, department, manager, etc.)
        const allowedFields = {};
        if (firstName !== undefined) allowedFields.first_name = firstName;
        if (lastName !== undefined) allowedFields.last_name = lastName;
        if (dateOfBirth !== undefined) allowedFields.date_of_birth = dateOfBirth;
        if (dateOfJoining !== undefined) allowedFields.date_of_joining = dateOfJoining;
        if (zipCode !== undefined) allowedFields.zip_code = zipCode;
        if (emergencyContact !== undefined) allowedFields.emergency_contact = emergencyContact;
        if (emergencyPhone !== undefined) allowedFields.emergency_phone = emergencyPhone;
        if (phone !== undefined) allowedFields.phone = phone;
        if (address !== undefined) allowedFields.address = address;
        if (city !== undefined) allowedFields.city = city;
        if (state !== undefined) allowedFields.state = state;
        if (country !== undefined) allowedFields.country = country;

        // Also allow updating any other fields from rest, but be careful about sensitive ones
        Object.keys(rest).forEach(key => {
            if (!['role', 'department_id', 'manager_id', 'user_id', 'id', 'email', 'status'].includes(key)) {
                allowedFields[key] = rest[key];
            }
        });

        const { data, error } = await supabase
            .from('employees')
            .update(allowedFields)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        // Generate signed URL if profile_image exists
        if (data.profile_image) {
            try {
                const signedUrl = await ProfileImageService.generateSignedUrl(data.profile_image);
                if (signedUrl) {
                    data.profile_image = signedUrl;
                }
            } catch (urlError) {
                console.error('Error generating signed URL in updateProfile:', urlError);
            }
        }

        res.status(200).json({ success: true, data: mapEmployee(data) });
    } catch (err) {
        next(err);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, departmentId, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('employees')
            .select('*, department:departments(*)', { count: 'exact' });

        if (search) {
            query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
        }

        if (req.user.role === 'ADMIN') {
            // Admin can see all employees
            query = query;
        } else if (departmentId) {
            query = query.eq('department_id', departmentId);
        }

        if (req.user.role === 'MANAGER' && req.user.employee) {
            const { data: teamIds } = await supabase
                .from('employees')
                .select('id')
                .eq('manager_id', req.user.employee.id);

            if (teamIds) {
                query = query.in('id', teamIds.map(t => t.id).concat(req.user.employee.id));
            }
        }

        // Validate sort parameters to prevent SQL injection
        const allowedSortFields = ['created_at', 'first_name', 'last_name', 'position', 'status', 'email', 'department_id', 'department'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const ascending = sortOrder === 'asc';

        // Special handling for department name sorting
        let data, count, error;
        if (sortBy === 'department') {
            // For department name sorting, we need to order by the department_name column in the employees table
            ({ data, count, error } = await query
                .range(from, to)
                .order('department_name', { ascending }));
        } else {
            ({ data, count, error } = await query
                .range(from, to)
                .order(sortField, { ascending }));
        }

        if (error) throw error;

        // Generate signed URLs for profile images in batch
        if (data && data.length > 0) {
            const employeesWithImages = data.filter(emp => emp.profile_image);
            if (employeesWithImages.length > 0) {
                try {
                    const imagePaths = employeesWithImages.map(emp => emp.profile_image);
                    const signedUrls = await ProfileImageService.generateSignedUrls(imagePaths);

                    // Create a map of path to signed URL
                    const urlMap = {};
                    signedUrls.forEach(item => {
                        if (item.signedUrl) urlMap[item.path] = item.signedUrl;
                    });

                    // Replace paths with signed URLs in the data
                    data.forEach(emp => {
                        if (emp.profile_image && urlMap[emp.profile_image]) {
                            emp.profile_image = urlMap[emp.profile_image];
                        }
                    });
                } catch (urlError) {
                    console.error('Error generating batch signed URLs in getAll:', urlError);
                }
            }
        }

        res.status(200).json({
            success: true,
            data: {
                data: (data || []).map(mapEmployee),
                total: count || 0,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil((count || 0) / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cacheKey = `employee:${id}`;

        // Try cache first
        const cached = await CacheService.get(cacheKey);
        if (cached) {
            return res.status(200).json({
                success: true,
                data: cached,
                cached: true
            });
        }

        // Fetch from database
        const { data, error } = await supabase
            .from('employees')
            .select('*, department:departments(*), manager:employees(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });

        // Generate signed URL if profile_image exists
        if (data.profile_image) {
            try {
                const signedUrl = await ProfileImageService.generateSignedUrl(data.profile_image);
                if (signedUrl) {
                    data.profile_image = signedUrl;
                }
            } catch (urlError) {
                console.error('Error generating signed URL in getById:', urlError);
            }
        }

        const mappedData = mapEmployee(data);

        // Cache the result (5 minutes)
        await CacheService.set(cacheKey, mappedData, 300);

        res.status(200).json({ success: true, data: mappedData });
    } catch (err) {
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { firstName, lastName, dateOfBirth, dateOfJoining, departmentId, zipCode, emergencyContact, emergencyPhone, managerId, ...rest } = req.body;

        const dbData = {
            ...rest,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            date_of_joining: dateOfJoining,
            department_id: departmentId,
            zip_code: zipCode,
            emergency_contact: emergencyContact,
            emergency_phone: emergencyPhone,
            manager_id: managerId
        };

        const { data, error } = await supabase
            .from('employees')
            .insert([dbData])
            .select()
            .single();

        if (error) throw error;

        // Notify admin users about the new employee
        const adminRecipients = await NotificationService.getNotificationRecipientsForRole('ADMIN');
        for (const adminId of adminRecipients) {
            await NotificationService.notifyNewUserCreated(data.user_id, adminId);
        }

        // Invalidate cache after create
        await CacheService.invalidateEntity('employee');

        res.status(201).json({ success: true, data: mapEmployee(data) });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, dateOfBirth, dateOfJoining, departmentId, zipCode, emergencyContact, emergencyPhone, managerId, role, ...rest } = req.body;

        const dbData = {
            ...rest,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            date_of_joining: dateOfJoining,
            department_id: departmentId,
            zip_code: zipCode,
            emergency_contact: emergencyContact,
            emergency_phone: emergencyPhone,
            manager_id: managerId
        };

        // Only add role to update if it's explicitly provided
        if (role !== undefined) {
            dbData.role = role;
        }

        const { data, error } = await supabase
            .from('employees')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        // Generate signed URL if profile_image exists
        if (data.profile_image) {
            try {
                const signedUrl = await ProfileImageService.generateSignedUrl(data.profile_image);
                if (signedUrl) {
                    data.profile_image = signedUrl;
                }
            } catch (urlError) {
                console.error('Error generating signed URL in update:', urlError);
            }
        }

        // If role was changed, notify the user
        if (role !== undefined) {
            // Get the user ID from the employee record
            if (data.user_id) {
                await NotificationService.notifyRoleChanged(data.user_id, data.user_id);
            }
        }

        // Invalidate cache after update
        await CacheService.delete(`employee:${id}`);
        await CacheService.invalidateEntity('employee');

        res.status(200).json({ success: true, data: mapEmployee(data) });
    } catch (err) {
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('employees')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Invalidate cache after delete
        await CacheService.delete(`employee:${id}`);
        await CacheService.invalidateEntity('employee');

        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (err) {
        next(err);
    }
};

// Upload profile image
exports.uploadProfileImage = [
    upload.single('image'), // Multer middleware to handle file upload
    async (req, res, next) => {
        try {
            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No image file provided'
                });
            }

            // Get user ID from authenticated user
            const userId = req.user.id;

            // Get current employee data to access old profile image
            const { data: currentEmployee, error: fetchError } = await supabase
                .from('employees')
                .select('profile_image')
                .eq('user_id', userId)
                .single();

            if (fetchError) {
                console.error('Error fetching current employee:', fetchError);
                // Continue anyway, as we might be adding the first image
            }

            // Upload image to Supabase Storage
            const imageUrl = await ProfileImageService.uploadProfileImage(req.file, userId);

            // Update employee profile with new image file path
            const updatedEmployee = await ProfileImageService.updateEmployeeProfileImage(userId, imageUrl);

            // Generate signed URL for the response
            let signedUrl = null;
            try {
                signedUrl = await ProfileImageService.generateSignedUrl(imageUrl);
                if (!signedUrl) {
                    console.warn('Failed to generate signed URL for newly uploaded image:', imageUrl);
                }
            } catch (urlError) {
                console.error('Error generating signed URL for uploaded image:', urlError);
                // Even if signed URL generation fails, the upload was successful
                // The file path is stored in DB and can be accessed later
            }

            // Delete old profile image if it exists
            if (currentEmployee && currentEmployee.profile_image) {
                await ProfileImageService.deleteOldProfileImage(userId, currentEmployee.profile_image);
            }

            res.status(200).json({
                success: true,
                data: { profile_image: signedUrl },
                message: 'Profile image uploaded successfully'
            });
        } catch (err) {
            console.error('Error uploading profile image:', err);
            next(err);
        }
    }
];

// Get profile image URL (helper method)
exports.getProfileImage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('employees')
            .select('profile_image')
            .eq('id', id)
            .single();

        if (error) throw error;

        let signedUrl = null;
        if (data?.profile_image) {
            try {
                signedUrl = await ProfileImageService.generateSignedUrl(data.profile_image);
            } catch (urlError) {
                console.error('Error generating signed URL for profile image:', urlError);
            }
        }

        res.status(200).json({
            success: true,
            data: { profile_image: signedUrl }
        });
    } catch (err) {
        next(err);
    }
};
