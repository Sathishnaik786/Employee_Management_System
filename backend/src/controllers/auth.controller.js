const { supabase, supabaseAdmin } = require('../../config/supabase');

exports.checkEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // For demo purposes, recognize the demo emails
        const demoEmails = ['admin@company.com', 'hr@company.com', 'manager@company.com'];
        const isDemoEmail = demoEmails.includes(email);

        if (isDemoEmail) {
            return res.status(200).json({
                success: true,
                exists: true
            });
        }

        // For non-demo emails, check if the user exists in our database
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Use maybeSingle to avoid errors when no user is found

        if (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }

        res.status(200).json({
            success: true,
            exists: !!dbUser
        });
    } catch (err) {
        next(err);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        // First, check if the user exists in our database
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle(); // Use maybeSingle to avoid errors when no user is found

        if (dbError) {
            console.error('Database error:', dbError);
            return res.status(500).json({ success: false, message: 'An error occurred while processing your request' });
        }

        // If user doesn't exist in our database, return a success response but don't send email
        // This prevents email enumeration attacks
        if (!dbUser) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.'
            });
        }

        // User exists, so send the password reset email
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password`
        });

        if (error) {
            console.error('Forgot password error:', error);
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.'
        });
    } catch (err) {
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, message: 'Token and password are required' });
        }

        // For Supabase, we need to use the admin client to update the user's password
        // First, we verify the token by getting the user
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
        
        if (userError) {
            console.error('Token verification error:', userError);
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        // Update the user's password
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
            userData.user.id,
            { password: password }
        );

        if (error) {
            console.error('Reset password error:', error);
            return res.status(400).json({ success: false, message: error.message });
        }

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.'
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Authenticate with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data?.user || !data?.session) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const authUser = data.user;
  const accessToken = data.session.access_token;

  // 2️⃣ Fetch employee using user_id (not email) - use admin client to bypass RLS
  const { data: employee, error: empError } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('user_id', authUser.id)
    .maybeSingle();

  if (empError) {
    console.error('Employee lookup error:', empError);
  }

  if (!employee) {
    return res.status(403).json({
      message: 'Permission denied: User exists but is not mapped to an employee record',
    });
  }

  // Check if employee is active
  if (employee.status !== 'ACTIVE') {
    return res.status(403).json({
      message: 'Access denied: Employee account is not active',
    });
  }

  // 3️⃣ Return combined session payload
  return res.json({
    token: accessToken,
    user: {
      id: authUser.id,
      email: authUser.email,
      employeeId: employee.id,
      role: employee.role,
      firstName: employee.first_name,
      lastName: employee.last_name,
    },
  });
}


exports.me = async (req, res, next) => {
    try {
        // req.user is already populated by authMiddleware
        res.status(200).json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        // Only allow admin users to create other users
        if (req.user?.role !== 'ADMIN') {
            return res.status(403).json({ success: false, message: 'Only admins can create users' });
        }
        
        const { email, role, departmentId, managerId } = req.body;

        // Validate required fields
        if (!email || !role) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and role are required' 
            });
        }

        // Validate role
        const validRoles = ['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid role. Must be one of: ADMIN, HR, MANAGER, EMPLOYEE' 
            });
        }

        // Check if user already exists in Supabase Auth
        const { data: { users }, error: searchError } = await supabase.auth.admin.listUsers();
        if (searchError) {
            console.error('Error searching users:', searchError);
        }
        
        const existingUser = users?.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Create Supabase Auth user using Service Role Key
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true, // Auto-confirm email to avoid verification steps
            password: 'TempPassword123!', // Default temporary password
        });

        if (authError) {
            console.error('Error creating auth user:', authError);
            return res.status(400).json({ 
                success: false, 
                message: authError.message 
            });
        }

        const userId = authData.user.id;

        // Insert into public.users table
        const { data: userRecord, error: userError } = await supabase
            .from('users')
            .insert([{
                id: userId,
                email,
                role
            }])
            .select()
            .single();

        if (userError) {
            console.error('Error inserting user record:', userError);
            // Rollback: delete the auth user since DB insert failed
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to create user record' 
            });
        }

        // Check if employee record already exists for this user_id
        const { data: existingEmployee, error: existingError } = await supabase
            .from('employees')
            .select('id')
            .eq('user_id', userId)
            .single();
        
        let employeeRecord;
        let employeeError = null;
        
        if (existingEmployee) {
            // Update existing employee record
            const { data: updateData, error: updateError } = await supabase
                .from('employees')
                .update({
                    first_name: email.split('@')[0], // Use email prefix as first name
                    last_name: 'User',
                    role,
                    department_id: departmentId || null,
                    manager_id: managerId || null,
                    email
                })
                .eq('user_id', userId)
                .select()
                .single();
                
            employeeRecord = updateData;
            employeeError = updateError;
        } else {
            // Insert new employee record
            const { data: insertData, error: insertError } = await supabase
                .from('employees')
                .insert([{
                    user_id: userId,
                    first_name: email.split('@')[0], // Use email prefix as first name
                    last_name: 'User',
                    role,
                    department_id: departmentId || null,
                    manager_id: managerId || null,
                    email
                }])
                .select()
                .single();
                
            employeeRecord = insertData;
            employeeError = insertError;
        }

        if (employeeError) {
            console.error('Error inserting/updating employee record:', employeeError);
            // Rollback: delete the auth user and user record since employee operation failed
            await supabaseAdmin.auth.admin.deleteUser(userId);
            await supabase.from('users').delete().eq('id', userId);
            return res.status(500).json({ 
                success: false, 
                message: 'Failed to create/update employee record' 
            });
        }

        // Return created user summary
        res.status(201).json({
            success: true,
            data: {
                id: employeeRecord.id,
                userId: userId,
                email,
                role,
                departmentId: departmentId || null,
                managerId: managerId || null
            },
            message: 'User created successfully. Default password is TempPassword123!'
        });
    } catch (err) {
        console.error('Create user error:', err);
        next(err);
    }
};
