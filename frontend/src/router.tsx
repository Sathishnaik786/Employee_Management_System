import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from '@/components/ProtectedRoute';

// Base Pages
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CalendarPage from "./pages/Calendar";
import MeetupsPage from "./pages/Meetups";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// IERS Pages
import FacultyDirectory from "./pages/FacultyDirectory";
import StudentsDirectory from "./pages/StudentsDirectory";
import PhDApplications from "./pages/PhDApplications";
import PhDApplicationForm from "./pages/PhDApplicationForm";
import StudentApplicationTracker from "./pages/StudentApplicationTracker";
import FacultyDashboard from "./pages/FacultyDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import AdminUsers from './pages/AdminUsers';
import DRCDashboard from "./pages/DRCDashboard";
import RACDashboard from "./pages/RACDashboard";
import RRCDashboard from "./pages/RRCDashboard";
import AdjudicatorDashboard from "./pages/AdjudicatorDashboard";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import ManagementDashboard from "./pages/ManagementDashboard";
import IQACDashboard from "./pages/IQACDashboard";
import DVVDashboard from "./pages/DVVDashboard";
import ExternalReviewerDashboard from "./pages/ExternalReviewerDashboard";
import PlacementOfficerDashboard from "./pages/PlacementOfficerDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAudit from "./pages/AdminAudit";
import PhDScrutiny from "./pages/PhDScrutiny";
import StageLocked from "./pages/StageLocked";
import Documents from "./pages/Documents";
import DRCApplications from "./pages/DRCApplications";
import DashboardError from "./pages/DashboardError";
import DashboardUnauthorized from "./pages/DashboardUnauthorized";

// Layouts
import { StudentLayout } from "@/components/layout/StudentLayout";
import { DRCLayout } from "@/components/layout/DRCLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { FacultyLayout } from "@/components/layout/FacultyLayout";

import { PERMISSIONS } from '@/access/permissions';

export const router = createBrowserRouter([
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPassword /> },
    { path: "/reset-password", element: <ResetPassword /> },
    { path: "/unauthorized", element: <Unauthorized /> },
    {
        path: "/app",
        element: <ProtectedRoute noLayout />,
        errorElement: <DashboardError />,
        children: [
            { index: true, element: <Navigate to="/app/dashboard" replace /> },

            // --- Guide Missing Routes ---
            { path: "iers/guide/acceptance", element: <StageLocked /> },
            { path: "iers/guide/scholars", element: <StageLocked /> },
            { path: "iers/guide/progress", element: <StageLocked /> },
            { path: "iers/guide/thesis", element: <StageLocked /> },
            { path: "iers/guide/rac", element: <StageLocked /> },

            // --- Common Secured Area (Default Layout) ---
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "dashboard", element: <Dashboard /> },
                    { path: "profile", element: <Profile /> },
                    { path: "iers/reports", element: <Dashboard /> },
                    { path: "notifications", element: <Dashboard /> },
                ]
            },

            // --- Faculty & Research ---
            {
                element: <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']} layout={FacultyLayout} />,
                children: [{ path: "iers/faculty", element: <FacultyDirectory /> }]
            },
            {
                element: <ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} layout={StudentLayout} />,
                children: [{ path: "iers/students", element: <StudentsDirectory /> }]
            },
            {
                element: <ProtectedRoute allowedRoles={['FACULTY', 'ADMIN']} layout={FacultyLayout} />,
                children: [{ path: "iers/faculty/dashboard", element: <FacultyDashboard /> }]
            },
            {
                element: <ProtectedRoute allowedRoles={['FACULTY', 'GUIDE', 'ADMIN']} layout={FacultyLayout} />,
                children: [{ path: "iers/guide/dashboard", element: <GuideDashboard /> }]
            },

            // --- Student Ph.D Discovery ---
            {
                element: <ProtectedRoute allowedRoles={['STUDENT']} layout={StudentLayout} />,
                children: [
                    { path: "iers/phd/applications", element: <PhDApplications /> },
                    { path: "iers/phd/applications/:id", element: <PhDApplications /> },
                    { path: "iers/phd/applications/new", element: <PhDApplicationForm /> },
                    { path: "iers/phd/tracker", element: <StudentApplicationTracker /> },
                ]
            },
            // --- DRC Management ---
            {
                element: <ProtectedRoute allowedRoles={['DRC_MEMBER', 'ADMIN']} layout={DRCLayout} />,
                children: [
                    { path: "iers/drc/dashboard", element: <DRCDashboard /> },
                    { path: "iers/drc/applications", element: <DRCApplications /> },
                    { path: "iers/drc/applications/:id", element: <PhDApplications /> },
                    { path: "iers/drc/scrutiny", element: <PhDScrutiny /> },
                    { path: "iers/drc/scrutiny/:id", element: <PhDScrutiny /> },
                    { path: "iers/drc/interviews", element: <StageLocked /> },
                    { path: "iers/drc/evaluation", element: <StageLocked /> },
                ]
            },
            // --- Institutional Evaluation (DRC/RAC/RRC) ---
            {
                element: <ProtectedRoute allowedRoles={['DRC_MEMBER', 'RAC_MEMBER', 'RRC_MEMBER', 'ADMIN']} layout={DRCLayout} />,
                children: [
                    { path: "iers/rac/dashboard", element: <RACDashboard /> },
                    { path: "iers/rac/review", element: <PhDScrutiny /> },
                    { path: "iers/rrc/dashboard", element: <RRCDashboard /> },
                    { path: "iers/rrc/synopsis", element: <RRCDashboard /> },
                    { path: "iers/rrc/thesis", element: <RRCDashboard /> },
                    { path: "iers/rrc/recommendation", element: <RRCDashboard /> },
                ]
            },

            // --- Authority & IQAC ---
            {
                element: <ProtectedRoute allowedRoles={['PRINCIPAL', 'ADMIN']} layout={FacultyLayout} />,
                children: [
                    { path: "iers/principal/dashboard", element: <PrincipalDashboard /> },
                    { path: "iers/principal/approvals", element: <Dashboard /> },
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['MANAGEMENT', 'ADMIN']} layout={FacultyLayout} />,
                children: [
                    { path: "iers/management/dashboard", element: <ManagementDashboard /> },
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['IQAC_MEMBER', 'ADMIN']} layout={FacultyLayout} />,
                children: [
                    { path: "iers/iqac/dashboard", element: <IQACDashboard /> },
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['DVV_VERIFIER', 'ADMIN']} layout={FacultyLayout} />,
                children: [
                    { path: "iers/dvv/dashboard", element: <DVVDashboard /> },
                ]
            },
            {
                element: <ProtectedRoute allowedRoles={['EXTERNAL_REVIEWER', 'ADMIN']} layout={FacultyLayout} />,
                children: [
                    { path: "iers/external/dashboard", element: <ExternalReviewerDashboard /> },
                ]
            },

            // --- Career & Placement ---
            {
                element: <ProtectedRoute requiredPermissions={[PERMISSIONS.PLACEMENT_ANALYTICS_VIEW]} />,
                children: [
                    { path: "iers/placement/dashboard", element: <PlacementOfficerDashboard /> },
                    { path: "iers/placement/companies", element: <PlacementOfficerDashboard /> },
                    { path: "iers/placement/drives", element: <PlacementOfficerDashboard /> },
                    { path: "iers/placement/eligibility", element: <PlacementOfficerDashboard /> },
                    { path: "iers/placement/offers", element: <PlacementOfficerDashboard /> },
                ]
            },
            {
                element: <ProtectedRoute requiredPermissions={[PERMISSIONS.JOB_POST_CREATE]} />,
                children: [
                    { path: "iers/recruiter/dashboard", element: <RecruiterDashboard /> },
                    { path: "iers/recruiter/profile", element: <RecruiterDashboard /> },
                    { path: "iers/recruiter/jobs", element: <RecruiterDashboard /> },
                    { path: "iers/recruiter/candidates", element: <RecruiterDashboard /> },
                    { path: "iers/recruiter/interviews", element: <RecruiterDashboard /> },
                    { path: "iers/recruiter/offers", element: <RecruiterDashboard /> },
                ]
            },

            {
                element: <ProtectedRoute requiredPermissions={[PERMISSIONS.THESIS_ASSIGNED_VIEW]} />,
                children: [
                    { path: "iers/adjudicator/dashboard", element: <AdjudicatorDashboard /> },
                    { path: "iers/adjudicator/thesis", element: <AdjudicatorDashboard /> },
                    { path: "iers/adjudicator/plagiarism", element: <AdjudicatorDashboard /> },
                    { path: "iers/adjudicator/upload", element: <AdjudicatorDashboard /> },
                ]
            },
            {
                element: <ProtectedRoute requiredPermissions={[PERMISSIONS.NAAC_EXTERNAL_VIEW]} />,
                children: [
                    { path: "iers/external/dashboard", element: <ExternalReviewerDashboard /> },
                ]
            },

            // --- Student Career Hub ---
            {
                element: <ProtectedRoute allowedRoles={['STUDENT']} layout={StudentLayout} />,
                children: [
                    { path: "iers/placement/opportunities", element: <Dashboard /> },
                    { path: "iers/placement/applied", element: <Dashboard /> },
                    { path: "iers/placement/interviews", element: <Dashboard /> },
                    { path: "iers/placement/offers-view", element: <Dashboard /> },
                    { path: "iers/training", element: <Dashboard /> },
                ]
            },

            // --- System Administration ---
            {
                element: <ProtectedRoute allowedRoles={['ADMIN']} layout={AdminLayout} />,
                children: [
                    { path: "admin/dashboard", element: <AdminDashboard /> },
                    { path: "admin/users", element: <AdminUsers /> },
                    { path: "admin/audit", element: <AdminAudit /> },
                ]
            },

            // --- Common Secured Tools ---
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "calendar", element: <CalendarPage /> },
                    { path: "meetups", element: <MeetupsPage /> },
                    { path: "documents", element: <Documents /> },
                    { path: "settings", element: <Profile /> },
                    { path: "unauthorized", element: <DashboardUnauthorized /> },
                    { path: "*", element: <NotFound /> },
                ]
            },
        ],
    },
], {
    future: { v7_relativeSplatPath: true },
});
