import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/Landing/LandingPage';
import ExploreServicesPage from '../pages/Explore/ExploreServicesPage';
import ServiceDetailPage from '../pages/Service/ServiceDetailPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterCustomerPage from '../pages/Auth/RegisterCustomerPage';
import RegisterFreelancerPage from '../pages/Auth/RegisterFreelancerPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ProtectedRoute from './ProtectedRoute';
import FreelancerDashboard from '../pages/FreelancerDashboard';
import ClientDashboard from '../pages/ClientDashboard';
import SavedTalentsPage from '../pages/Client/SavedTalentsPage';
import TimesheetPage from '../pages/Client/TimesheetPage';
import DailyReportPage from '../pages/Client/DailyReportPage';
import MyContractsPage from '../pages/Client/MyContractsPage';
import MyTeamPage from '../pages/Client/MyTeamPage';
import ManageJobsPage from '../pages/Client/ManageJobsPage';
import PendingProposalsPage from '../pages/Client/PendingProposalsPage';
import PostJobPage from '../pages/Client/PostJobPage';
import BillingPage from '../pages/Client/BillingPage';
import ProfilePage from '../pages/Shared/ProfilePage';
import SettingsPage from '../pages/Shared/SettingsPage';
import MessagesPage from '../pages/Shared/MessagesPage';

// Dashboard preview placeholders for Sprint 1 foundation
const AdminDashboardPlaceholder = () => (
  <div className="container py-5">
    <div className="sh-card p-5 bg-white dark:bg-dark">
      <h3 className="fw-bold mb-2">Dashboard Admin</h3>
      <p className="text-muted">Panel Administrator SkillHub Indonesia.</p>
    </div>
  </div>
);

const FeaturePlaceholder = ({ title }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
    <div className="text-center">
      <h3 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>Fitur ini sedang dalam tahap pengembangan dan akan tersedia di Sprint berikutnya.</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExploreServicesPage />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-customer" element={<RegisterCustomerPage />} />
      <Route path="/register-freelancer" element={<RegisterFreelancerPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes: Customer */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/client/jobs" element={<ManageJobsPage />} />
          <Route path="/dashboard/client/proposals" element={<PendingProposalsPage />} />
          <Route path="/dashboard/client/post-job" element={<PostJobPage />} />
          <Route path="/dashboard/client/saved-talents" element={<SavedTalentsPage />} />
          <Route path="/dashboard/client/timesheet" element={<TimesheetPage />} />
          <Route path="/dashboard/client/daily-report" element={<DailyReportPage />} />
          <Route path="/dashboard/client/contracts" element={<MyContractsPage />} />
          <Route path="/dashboard/client/team" element={<MyTeamPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
        </Route>
      </Route>

      {/* Protected Routes: Freelancer */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
          <Route path="/dashboard/freelancer/gigs" element={<FeaturePlaceholder title="My Gigs" />} />
          <Route path="/dashboard/wallet" element={<FeaturePlaceholder title="Wallet & Earnings" />} />
        </Route>
      </Route>
      
      {/* Shared Protected Routes for all authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'freelancer', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/talent" element={<ExploreServicesPage />} />
          <Route path="/dashboard/service/:slug" element={<ServiceDetailPage />} />
          <Route path="/dashboard/messages" element={<MessagesPage />} />
          <Route path="/dashboard/invoices" element={<FeaturePlaceholder title="Invoices" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Protected Routes: Admin */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPlaceholder />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
