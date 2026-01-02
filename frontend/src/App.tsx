import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AppLayout } from "@/components/layout/AppLayout";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import AttendancePage from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import Documents from "./pages/Documents";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

import AdminUsers from './pages/AdminUsers';
import Projects from './pages/Projects';
import MyProjects from './pages/MyProjects';
import ProjectDetail from './pages/ProjectDetail';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    { path: "/", element: <Login /> }, // Root path goes to login
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    {
      path: "/app", // Protected routes under /app path
      element: <ProtectedRoute allowedRoles={['ADMIN', 'HR', 'MANAGER', 'EMPLOYEE']}>/* AppLayout is handled by ProtectedRoute */</ProtectedRoute>,
      children: [
        { index: true, element: <Navigate to="/app/dashboard" replace /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "employees", element: <Employees /> },
        { path: "departments", element: <Departments /> },
        { path: "attendance", element: <AttendancePage /> },
        { path: "leaves", element: <Leaves /> },
        { path: "documents", element: <Documents /> },
        { path: "reports", element: <Reports /> },

        { path: "admin/users", element: <AdminUsers /> },
        { path: "projects", element: <Projects /> },
        { path: "my-projects", element: <MyProjects /> },
        { path: "projects/:id", element: <ProjectDetail /> },


        { path: "profile", element: <Profile /> },
        { path: "unauthorized", element: <Unauthorized /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ], {
    future: {
      v7_relativeSplatPath: true,
    },
  });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SidebarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </TooltipProvider>
      </SidebarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
