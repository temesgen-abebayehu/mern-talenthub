import JobApplicationsPage from './pages/Company/JobApplicationsPage';
import EmailVerification from './pages/Auth/EmailVerification';
import JobCreatePage from './pages/Jobs/JobCreatePage';
import CompanyJobManagement from './pages/Company/CompanyJobManagement';
import JobApplyPage from './pages/Jobs/JobApplyPage'; // Import the JobApplyPage
// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { JobProvider } from './contexts/JobContext';
import { UserProvider } from './contexts/UserContext';

// Layout Components
import MainLayout from './components/common/Layout/MainLayout';
import AuthLayout from './components/common/Layout/AuthLayout';

// Page Components
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import JobDetail from './pages/Jobs/JobDetail';
import ProfilePage from './pages/Profile/ProfilePage';
import ApplicationsPage from './pages/Profile/ApplicationsPage';
import CompanyJobsPage from './pages/Company/CompanyJobsPage';
import CompanyListPage from './pages/Company/CompanyListPage';
import CompanyRegisterPage from './pages/Company/CompanyRegisterPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import CompanyApprovalPage from './pages/Admin/CompanyApprovalPage';
import JobModerationPage from './pages/Admin/JobModerationPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (redirects authenticated users away from auth pages)
interface PublicRouteProps {
  children: React.ReactNode;
}
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (user) {
    return <Navigate to="/" replace />;
  }
  // Ensure children is always a valid ReactElement or null
  return <>{children}</>;
};

// App Component
function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <JobProvider>
          <Router>
            <div className="App min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                } />


                <Route path="/jobs/:id" element={
                  <MainLayout>
                    <JobDetail />
                  </MainLayout>
                } />

                <Route path="/jobs/:id/apply" element={
                  <MainLayout>
                    <JobApplyPage />
                  </MainLayout>
                } />

                {/* Authentication Routes */}
                <Route path="/login" element={
                  <PublicRoute>
                    <AuthLayout>
                      <LoginPage />
                    </AuthLayout>
                  </PublicRoute>
                } />

                <Route path="/register" element={
                  <PublicRoute>
                    <AuthLayout>
                      <RegisterPage />
                    </AuthLayout>
                  </PublicRoute>
                } />

                <Route path="/forgot-password" element={
                  <PublicRoute>
                    <AuthLayout>
                      <ForgotPasswordPage />
                    </AuthLayout>
                  </PublicRoute>
                } />
                <Route path="/verify-email" element={
                  <PublicRoute>
                    <AuthLayout>
                      <EmailVerification />
                    </AuthLayout>
                  </PublicRoute>
                } />

                <Route path="/reset-password" element={
                  <PublicRoute>
                    <AuthLayout>
                      <ResetPasswordPage />
                    </AuthLayout>
                  </PublicRoute>
                } />

                {/* Protected Routes - All authenticated users */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfilePage />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="/profile/applications" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ApplicationsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Protected Routes - Company Owners */}
                <Route path="/company/my" element={
                  <ProtectedRoute requiredRole="companyOwner">
                    <MainLayout>
                      <CompanyListPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/new" element={
                  <ProtectedRoute requiredRole="companyOwner">
                    <MainLayout>
                      <CompanyRegisterPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/:id/jobs" element={
                  <ProtectedRoute requiredRole="companyOwner">
                    <MainLayout>
                      <CompanyJobsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                <Route path="/company/:companyId/job/:jobId/applications" element={
                  <ProtectedRoute requiredRole="companyOwner">
                    <MainLayout>
                      <JobApplicationsPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                {/* Company Owner: Create Job */}
                <Route path="/jobs/create" element={
                  <ProtectedRoute requiredRole="companyOwner">
                    <MainLayout>
                      <JobCreatePage />
                    </MainLayout>
                  </ProtectedRoute>
                } />
                {/* Company Owner: Manage All My Jobs */}
                <Route path="/jobs/my" element={
                  <ProtectedRoute requiredRole="companyOwner">
                    <MainLayout>
                      <CompanyJobManagement />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Protected Routes - Admin Only */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <MainLayout>
                      <AdminDashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/companies" element={
                  <ProtectedRoute requiredRole="admin">
                    <MainLayout>
                      <CompanyApprovalPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                <Route path="/admin/jobs" element={
                  <ProtectedRoute requiredRole="admin">
                    <MainLayout>
                      <JobModerationPage />
                    </MainLayout>
                  </ProtectedRoute>
                } />

                {/* Catch all route - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </JobProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;