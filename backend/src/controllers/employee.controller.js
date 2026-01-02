const { supabase } = require('@lib/supabase');

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
            .select('*, department:departments!employees_department_id_fkey(*)')
            .eq('user_id', req.user.id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: 'Profile not found' });

        res.status(200).json({ success: true, data: mapEmployee(data) });
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
            .select('*, department:departments!employees_department_id_fkey(*)', { count: 'exact' });

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
        const { data, error } = await supabase
            .from('employees')
            .select('*, department:departments!employees_department_id_fkey(*), manager:employees!employees_manager_id_fkey(*)')
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: 'Employee not found' });

        res.status(200).json({ success: true, data: mapEmployee(data) });
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

        res.status(201).json({ success: true, data: mapEmployee(data) });
    } catch (err) {
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        const { id } = req.params;
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
            .update(dbData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

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

        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (err) {
        next(err);
    }
};
