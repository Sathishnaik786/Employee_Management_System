const { supabase, supabaseAdmin } = require('../../lib/supabase');

const authMiddleware = async (req, res, next) => {
  if (req.path.includes('/auth/login')) {
    return next();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Load employee mapping to get role - use admin client to bypass RLS during auth
  const { data: employee, error: empError } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (empError) {
    console.error('Employee lookup error:', empError);
  }

  if (!employee) {
    return res.status(403).json({
      message: 'Permission denied: User exists but is not mapped to an employee record',
    });
  }

  req.user = {
    ...data.user,
    role: employee.role,
    employeeId: employee.id,
    firstName: employee.first_name,
    lastName: employee.last_name,
  };
  
  next();
};

module.exports = authMiddleware;
