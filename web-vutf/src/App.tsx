// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import StudentHome from './pages/student/StudentHome';
import UploadFile from './pages/student/UploadFile';
import CreateThesisPage from './pages/student/CreateThesisPage';
import InvitationsPage from './pages/student/InvitationsPage';
import GroupManagementPage from './pages/student/GroupManagementPage';
import GroupDetailPage from './pages/student/GroupDetailPage';
import GroupSubmissionPage from './pages/student/GroupSubmissionPage';
import InspectionRoundPage from './pages/student/InspectionRoundPage';
import ThesisReportPage from './pages/student/ThesisReportPage';
import { DashboardPage as InstructorDashboard } from './pages/instructor/DashboardPage';
import LoginPage from './pages/LoginPage';
import { RegisterEmailPage } from './pages/register/RegisterEmailPage';
import { VerifyOtpPage } from './pages/register/VerifyOtpPage';
import { RegisterPage } from './pages/register/RegisterPage';
import { ForgotPasswordPage, VerifyForgotOtpPage, ResetPasswordPage } from './pages/auth/ForgotPasswordPages';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UnauthorizedPage } from './pages/error/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import InspectionManagePage from './pages/admin/InspectionManagePage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AnnouncementsPage } from './pages/announcements/AnnouncementsPage';
import { SetupProfilePage } from './pages/register/SetupProfilePage';
import { ThesisTopicPage } from './pages/admin/ThesisTopicPage';
import { SubmissionDetailPage } from './pages/instructor/SubmissionDetailPage';
import { StudentProfilePage } from './pages/student/StudentProfilePage';
import { InstructorProfilePage } from './pages/instructor/InstructorProfilePage';
import { MyAdvisedGroupsPage } from './pages/instructor/MyAdvisedGroupsPage';
import { ReportPage } from './pages/instructor/ReportPage';
import { ReportDetailPage } from './pages/instructor/ReportDetailPage';
import TrackThesisPage from './pages/admin/TrackThesisPage';
import { Toaster } from 'react-hot-toast';
import ThesisFilePage from './pages/admin/ThesisFilePage';
import SettingsPage from './pages/admin/SettingsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AuditLogPage } from './pages/admin/AuditLogPage';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <BrowserRouter>
        <Routes>
          {/* Public Routes - เข้าได้ทุกคน */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/setup-profile" element={<SetupProfilePage />} />

          {/* Registration & Forgot Password Flow*/}
          <Route path="/register/email" element={<RegisterEmailPage />} />
          <Route path="/register/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/register/form" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-password/verify" element={<VerifyForgotOtpPage />} />
          <Route path="/forgot-password/reset" element={<ResetPasswordPage />} />


          {/* ------------------------------------------------------- */}
          {/* PROTECTED ROUTES: ถ้าไม่ Login เข้าไม่ได้ */}
          {/* ------------------------------------------------------- */}

          {/* 1. โซน Student */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student" element={<MainLayout />}>
              <Route index element={<Navigate to="/student/dashboard" replace />} />
              <Route path="dashboard" element={<StudentHome />} />
              <Route path="upload" element={<UploadFile />} />
              <Route path="thesis/create" element={<CreateThesisPage />} />
              <Route path="invitations" element={<InvitationsPage />} />
              <Route path="group-management" element={<GroupManagementPage />} />
              <Route path="groups/:groupId" element={<GroupDetailPage />} />
              <Route path="groups/:groupId/submissions" element={<GroupSubmissionPage />} />
              <Route path="inspections" element={<InspectionRoundPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
              <Route path="report" element={<ThesisReportPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<div>Setting Page</div>} />
            </Route>
          </Route>

          {/* 2. โซน Instructor */}
          <Route element={<ProtectedRoute allowedRoles={['instructor']} />}>
            <Route path="/instructor" element={<MainLayout />}>
              <Route index element={<Navigate to="/instructor/dashboard" replace />} />
              <Route path="dashboard" element={<InstructorDashboard />} />
              <Route path="profile" element={<InstructorProfilePage />} />
              <Route path="groups" element={<MyAdvisedGroupsPage />} />
              <Route path="submission/:id" element={<SubmissionDetailPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="report/:id" element={<ReportDetailPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />

              <Route element={<ProtectedRoute allowedRoles={['instructor']} allowedPermissions={['manage:users']} />}>
                <Route path="users" element={<UserManagementPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['instructor']} allowedPermissions={['approve:thesis_topic']} />}>
                <Route path="topics" element={<ThesisTopicPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['instructor']} allowedPermissions={['manage:inspections']} />}>
                <Route path="inspections" element={<InspectionManagePage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={['instructor']} allowedPermissions={['manage:thesis_format']} />}>
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Route>

          {/* 3. โซน Admin */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="topics" element={<ThesisTopicPage />} />
              <Route path="files" element={<ThesisFilePage />} />
              <Route path="track" element={<TrackThesisPage />} />
              <Route path="inspections" element={<InspectionManagePage />} />
              <Route path="audit-logs" element={<AuditLogPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;