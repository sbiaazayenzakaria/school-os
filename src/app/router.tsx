import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';

// Feature Pages
import { DashboardPage } from '@/features/dashboard';
import {
  StudentsPage,
  StudentProfilePage,
  GuardiansPage,
} from '@/features/students';
import { AdmissionsPage } from '@/features/admissions';
import { StaffPage, StaffProfilePage } from '@/features/staff';
import { AcademicStructurePage } from '@/features/academic-structure';
import { AttendancePage, AttendanceReportPage } from '@/features/attendance';
import {
  AssessmentsPage,
  GradebookPage,
  ReportCardsPage,
} from '@/features/assessments';
import {
  TimetablePage,
  BellSchedulePage,
  SubstitutionsPage,
} from '@/features/timetable';
import { OrganizationsPage, CampusDetailPage } from '@/features/organizations';
import { FinancePage } from '@/features/finance/FinancePage';
import { CommunicationsPage } from '@/features/communications/CommunicationsPage';
import { DocumentsPage } from '@/features/documents/DocumentsPage';
import { HRPage } from '@/features/hr/HRPage';
import { ReportingPage } from '@/features/reporting/ReportingPage';
import { GDPRPage } from '@/features/gdpr/GDPRPage';
import { UsersPage } from '@/features/users/UsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      // Students & Admissions
      {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'students/:id',
        element: <StudentProfilePage />,
      },
      {
        path: 'guardians',
        element: <GuardiansPage />,
      },
      {
        path: 'admissions',
        element: <AdmissionsPage />,
      },
      // Faculty & Staff
      {
        path: 'staff',
        element: <StaffPage />,
      },
      {
        path: 'staff/:id',
        element: <StaffProfilePage />,
      },
      {
        path: 'academic-structure',
        element: <AcademicStructurePage />,
      },
      // Attendance
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
      {
        path: 'attendance/reports',
        element: <AttendanceReportPage />,
      },
      // Assessments & Grading
      {
        path: 'assessments',
        element: <AssessmentsPage />,
      },
      {
        path: 'assessments/gradebook',
        element: <GradebookPage />,
      },
      {
        path: 'assessments/report-cards',
        element: <ReportCardsPage />,
      },
      // Timetable
      {
        path: 'timetable',
        element: <TimetablePage />,
      },
      {
        path: 'timetable/bell-schedule',
        element: <BellSchedulePage />,
      },
      {
        path: 'timetable/substitutions',
        element: <SubstitutionsPage />,
      },
      // Organizations & Campuses
      {
        path: 'organizations',
        element: <OrganizationsPage />,
      },
      {
        path: 'organizations/:id',
        element: <CampusDetailPage />,
      },
      // Finance & Operations
      {
        path: 'finance',
        element: <FinancePage />,
      },
      {
        path: 'communications',
        element: <CommunicationsPage />,
      },
      {
        path: 'documents',
        element: <DocumentsPage />,
      },
      {
        path: 'hr',
        element: <HRPage />,
      },
      {
        path: 'reporting',
        element: <ReportingPage />,
      },
      {
        path: 'gdpr',
        element: <GDPRPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
