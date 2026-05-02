import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import CertificatesPage from './pages/CertificatesPage';
import ProfilePage from './pages/ProfilePage';
import EmployerDashboard from './pages/EmployerDashboard';
import PostOpportunityPage from './pages/PostOpportunityPage';
import VerifyCertPage from './pages/VerifyCertPage';
import NotFoundPage from './pages/NotFoundPage';

// Layout
import Layout from './components/Layout';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify/:certNumber" element={<VerifyCertPage />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected - all authenticated users */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="opportunities/:id" element={<OpportunityDetailPage />} />
        <Route path="certificates" element={<ProtectedRoute roles={['youth', 'admin']}><CertificatesPage /></ProtectedRoute>} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Employer routes */}
        <Route path="employer" element={<ProtectedRoute roles={['employer', 'admin']}><EmployerDashboard /></ProtectedRoute>} />
        <Route path="employer/post" element={<ProtectedRoute roles={['employer', 'admin']}><PostOpportunityPage /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
