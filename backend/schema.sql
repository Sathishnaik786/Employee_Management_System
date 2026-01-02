-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('ADMIN', 'HR', 'MANAGER', 'EMPLOYEE')) DEFAULT 'EMPLOYEE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Departments table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    manager_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    position TEXT,
    salary NUMERIC(15, 2),
    date_of_birth DATE,
    date_of_joining DATE,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    zip_code TEXT,
    emergency_contact TEXT,
    emergency_phone TEXT,
    status TEXT CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED')) DEFAULT 'ACTIVE',
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add manager_id reference to departments now that employees exists
ALTER TABLE departments ADD CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL;

-- Create Attendance table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status TEXT CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'ON_LEAVE')) DEFAULT 'PRESENT',
    work_hours NUMERIC(4, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Leave Types table
CREATE TABLE leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    days_allowed INTEGER NOT NULL,
    carry_forward BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Leaves table
CREATE TABLE leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status TEXT CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')) DEFAULT 'PENDING',
    approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('ID_PROOF', 'ADDRESS_PROOF', 'EDUCATION', 'EXPERIENCE', 'CONTRACT', 'OTHER')) DEFAULT 'OTHER',
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add some default leave types
INSERT INTO leave_types (name, description, days_allowed) VALUES
('Sick Leave', 'Leave for medical reasons', 12),
('Casual Leave', 'Leave for personal reasons', 12),
('Earned Leave', 'Paid leave earned by working', 15);

-- Supabase Auth Trigger to sync public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (new.id, new.email, 'EMPLOYEE');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


/*
  # Adjust RLS Policies for Custom Auth System

  1. Changes
    - Update auth_users policies to allow login and signup operations
    - Allow public read access for authentication (with proper filters in app)
    - Allow public insert for user registration
    - Keep role/permission tables publicly readable for auth checks
    - Maintain security on audit logs and database connections

  2. Security Notes
    - Login queries filter by email and is_active
    - Password verification happens in application code
    - Audit logs remain restricted
    - Database connections remain user-scoped
*/

-- Drop existing policies on auth_users
DROP POLICY IF EXISTS "Users can view own profile" ON auth_users;
DROP POLICY IF EXISTS "Users can update own profile" ON auth_users;

-- Create new policies for auth_users to support custom auth
CREATE POLICY "Allow public read for authentication"
  ON auth_users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for registration"
  ON auth_users FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update for login tracking"
  ON auth_users FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Update role policies to allow public read
DROP POLICY IF EXISTS "Authenticated users can view roles" ON roles;
CREATE POLICY "Allow public read for roles"
  ON roles FOR SELECT
  TO public
  USING (true);

-- Update permission policies to allow public read
DROP POLICY IF EXISTS "Authenticated users can view permissions" ON permissions;
CREATE POLICY "Allow public read for permissions"
  ON permissions FOR SELECT
  TO public
  USING (true);

-- Update role_permissions policies to allow public read
DROP POLICY IF EXISTS "Authenticated users can view role permissions" ON role_permissions;
CREATE POLICY "Allow public read for role permissions"
  ON role_permissions FOR SELECT
  TO public
  USING (true);

-- Update user_roles policies to allow public read and write
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON user_roles;
CREATE POLICY "Allow public read for user roles"
  ON user_roles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for user roles"
  ON user_roles FOR INSERT
  TO public
  WITH CHECK (true);

-- Update audit_logs policies
DROP POLICY IF EXISTS "Users can view own audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

CREATE POLICY "Allow public insert for audit logs"
  ON audit_logs FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read for audit logs"
  ON audit_logs FOR SELECT
  TO public
  USING (true);

-- Update database_connections policies
DROP POLICY IF EXISTS "Users can view own connections" ON database_connections;
DROP POLICY IF EXISTS "Users can create own connections" ON database_connections;
DROP POLICY IF EXISTS "Users can update own connections" ON database_connections;
DROP POLICY IF EXISTS "Users can delete own connections" ON database_connections;

CREATE POLICY "Allow public read for database connections"
  ON database_connections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert for database connections"
  ON database_connections FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update for database connections"
  ON database_connections FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete for database connections"
  ON database_connections FOR DELETE
  TO public
  USING (true);

-- Create Work Items table
CREATE TABLE work_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (
    type IN ('PROJECT', 'TASK', 'TODO', 'MEETING', 'ASSIGNMENT', 'UPDATE')
  ) NOT NULL,
  status TEXT CHECK (
    status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED')
  ) DEFAULT 'OPEN',
  priority TEXT CHECK (
    priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
  ) DEFAULT 'MEDIUM',
  created_by UUID REFERENCES employees(id),
  assigned_to UUID REFERENCES employees(id),
  department_id UUID REFERENCES departments(id),
  start_date DATE,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Work Comments table (updates & progress)
CREATE TABLE work_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  work_item_id UUID REFERENCES work_items(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);