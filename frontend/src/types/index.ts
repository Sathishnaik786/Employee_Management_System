// IERS - Integrated Resource & Education System Types

// 1. User & Authentication Types
export type Role =
  | 'STUDENT' | 'FACULTY' | 'GUIDE' | 'DRC_MEMBER' | 'RAC_MEMBER' | 'RRC_MEMBER' | 'ADJUDICATOR'
  | 'ADMIN' | 'PRINCIPAL' | 'MANAGEMENT' | 'DEPT_ADMIN' | 'FINANCE'
  | 'IQAC_MEMBER' | 'DVV_VERIFIER' | 'EXTERNAL_REVIEWER'
  | 'PLACEMENT_OFFICER' | 'RECRUITER' | 'MENTOR'
  | 'HR' | 'MANAGER' | 'EMPLOYEE' | 'HR_MANAGER';

export interface User {
  id: string;
  email: string;
  role: Role;
  fullName: string;
  iersId: string; // Institutional ID (e.g. S2026-001)
  profile_image?: string;
  permissions?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

// 2. Academic Master Types (IERS PURE)

export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  department: string;
  programType: 'PhD' | 'UG' | 'PG';
  currentSemester?: number;
  batch?: string;
  profile_image?: string;
}

export interface Faculty {
  id: string;
  facultyId: string;
  fullName: string;
  email: string;
  department: string;
  expertise: string;
  designation?: string;
  researchAreas?: string[];
}

// 3. PhD Lifecycle Types

export interface PhDApplication {
  id: string;
  application_no: string;
  student_id: string;
  student_name?: string;
  research_area: string;
  program: string;
  status: PhDStatus;
  due_at?: string;
  submitted_at?: string;
  exemption_type?: string;
  exemption_status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE';
  exemption_due_at?: string;
  proof_url?: string;
  created_at: string;
  updated_at: string;

  // Relations
  student?: Student;
  scrutiny?: any[];
  interviews?: any[];
  document_verification?: any;
  payment?: any[];
  guide_allocation?: any;
}

export type PhDStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'SCRUTINY_APPROVED'
  | 'SCRUTINY_REJECTED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'DOCUMENTS_VERIFIED'
  | 'DOCUMENTS_REJECTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'GUIDE_ALLOCATED'
  | 'CANCELLED';

// 4. Workflow System Types (Generic for IERS)

export interface WorkflowInstance {
  id: string;
  workflow_id?: string;
  workflow_name?: string;
  entity_id: string;
  entity_type: string;
  current_step: number;
  status: 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  workflow?: {
    name: string;
  };
  steps?: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  stepOrder: number;
  stepName: string;
  approverRoles: Role[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

// 5. Institutional Compliance (NAAC)

export interface NAAC_IIQA {
  id: string;
  institutionCode: string;
  academicYear: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
}

export interface NAAC_SSR {
  id: string;
  iiqaId: string;
  criterionNo: number;
  sectionCode: string;
  content: any;
  status: string;
}

// 6. Generic API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 7. Notification & Communication
export interface IERSNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ACTION_REQUIRED' | 'UPDATE';
  read: boolean;
  createdAt: string;
}

// 8. Employee Types
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  salary?: number;
  dateOfBirth?: string;
  dateOfJoining?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  createdAt?: string;
  updatedAt?: string;
  department?: {
    id: string;
    name: string;
  };
  userId?: string;
  profile_image?: string;
  avatar?: string;
  departmentName?: string;
  managerId?: string;
}

// 9. Department Types
export interface Department {
  id: string;
  name: string;
  description: string;
  managerId?: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  employeeCount?: number;
  employees?: any[];
}

export interface DepartmentFormData {
  name: string;
  description: string;
  managerId?: string;
}

// 10. Employee Form Data
export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  departmentId?: string;
  position?: string;
  salary?: number;
  dateOfBirth?: string;
  dateOfJoining?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  managerId?: string;
}

// 11. Employee Status
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED';

// 12. Analytics Data Types
export interface AdminOverviewData {
  totalEmployees: number;
  activeEmployees: number;
  totalDepartments: number;
  totalWorkItems: number;
  pendingLeaveRequests: number;
  approvedLeaveRequests: number;
  presentToday: number;
  absentToday: number;
}

export interface ManagerTeamProgressData {
  teamSize: number;
  teamWorkItems: number;
  teamPresentToday: number;
  teamPendingLeaveRequests: number;
  teamCompletedWorkItems: number;
}

export interface HRWorkforceData {
  newHiresThisMonth: number;
  averageTenure: number;
  upcomingBirthdays: number;
  employeesByStatus: Record<string, number>;
}

export interface EmployeeSelfData {
  totalWorkItems: number;
  completedWorkItems: number;
  completionRate: string;
  attendanceThisMonth: number;
  totalLeaveRequests: number;
  approvedLeaveRequests: number;
}
