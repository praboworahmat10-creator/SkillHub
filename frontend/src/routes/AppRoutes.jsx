import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingPage from '../pages/Landing/LandingPage';
import FreelancerLandingPage from '../pages/FreelancerLandingPage';
import ExploreServicesPage from '../pages/Explore/ExploreServicesPage';
import ServiceDetailPage from '../pages/Service/ServiceDetailPage';
import PublicJobboardPage from '../pages/Jobboard/PublicJobboardPage';
import PublicJobDetailPage from '../pages/Jobboard/PublicJobDetailPage';
import FreelancerDetailPage from '../pages/Freelancer/FreelancerDetailPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterRoleSelectPage from '../pages/Auth/RegisterRoleSelectPage';
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

import VerifyEmailPage from '../pages/Auth/VerifyEmailPage';
import VerifyPhonePage from '../pages/Auth/VerifyPhonePage';
import SocialAuthCallbackPage from '../pages/Auth/SocialAuthCallbackPage';
import FreelancerOnboardingPage from '../pages/Freelancer/FreelancerOnboardingPage';
import IdentityVerificationPage from '../pages/Freelancer/IdentityVerificationPage';
import VerificationPendingPage from '../pages/Freelancer/VerificationPendingPage';
import FreelancerVerificationsPage from '../pages/Admin/FreelancerVerificationsPage';

// ── Freelancer Workspace Pages ──────────────────────────────────────────────
import BrowseJobsPage from '../pages/Freelancer/BrowseJobsPage';
import JobDetailPage from '../pages/Freelancer/JobDetailPage';
import SubmitProposalPage from '../pages/Freelancer/SubmitProposalPage';
import ProposalListPage from '../pages/Freelancer/ProposalListPage';
import MyGigsPage from '../pages/Freelancer/MyGigsPage';
import FreelancerOrdersPage from '../pages/Freelancer/FreelancerOrdersPage';
import OrderDetailPage from '../pages/Freelancer/OrderDetailPage';
import FreelancerContractsPage from '../pages/Freelancer/FreelancerContractsPage';
import WalletPage from '../pages/Freelancer/WalletPage';

// Dashboard preview placeholder
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
      <Route path="/freelancer" element={<FreelancerLandingPage />} />
      <Route path="/freelancer/login" element={<FreelancerLandingPage initialModal="login" />} />
      <Route path="/freelancer/register" element={<FreelancerLandingPage initialModal="register" />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExploreServicesPage />} />
        <Route path="/freelancers/:id" element={<FreelancerDetailPage />} />
        <Route path="/jobboard" element={<PublicJobboardPage />} />
        <Route path="/jobboard/:id" element={<PublicJobDetailPage />} />
        <Route path="/jobs" element={<PublicJobboardPage />} />
        <Route path="/jobs/:id" element={<PublicJobDetailPage />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterRoleSelectPage />} />
      <Route path="/signup" element={<RegisterRoleSelectPage />} />
      <Route path="/register/client" element={<RegisterCustomerPage />} />
      <Route path="/register-customer" element={<RegisterCustomerPage />} />
      <Route path="/register/freelancer" element={<RegisterFreelancerPage />} />
      <Route path="/register-freelancer" element={<RegisterFreelancerPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Social OAuth Callback */}
      <Route path="/auth/social/callback" element={<SocialAuthCallbackPage />} />

      {/* Verification & Onboarding Flow */}
      <Route path="/freelancer/verify-email" element={<VerifyEmailPage />} />
      <Route path="/freelancer/verify-phone" element={<VerifyPhonePage />} />
      <Route path="/freelancer/onboarding" element={<FreelancerOnboardingPage />} />
      <Route path="/freelancer/verification" element={<IdentityVerificationPage />} />
      <Route path="/freelancer/verification/pending" element={<VerificationPendingPage />} />

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

      {/* ── Protected Routes: Freelancer Workspace ── */}
      <Route element={<ProtectedRoute allowedRoles={['freelancer', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          {/* Main Dashboard Hub */}
          <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />

          {/* Job Marketplace */}
          <Route path="/dashboard/freelancer/browse-jobs" element={<BrowseJobsPage />} />
          <Route path="/dashboard/freelancer/jobs/:id" element={<JobDetailPage />} />
          <Route path="/dashboard/freelancer/jobs/:id/propose" element={<SubmitProposalPage />} />

          {/* Proposals */}
          <Route path="/dashboard/freelancer/proposals" element={<ProposalListPage />} />

          {/* My Gigs / Services */}
          <Route path="/dashboard/freelancer/gigs" element={<MyGigsPage />} />

          {/* Orders */}
          <Route path="/dashboard/freelancer/orders" element={<FreelancerOrdersPage />} />
          <Route path="/dashboard/freelancer/orders/:id" element={<OrderDetailPage />} />

          {/* Contracts */}
          <Route path="/dashboard/freelancer/contracts" element={<FreelancerContractsPage />} />

          {/* Wallet & Earnings */}
          <Route path="/dashboard/freelancer/wallet" element={<WalletPage />} />
        </Route>
      </Route>

      {/* Shared Protected Routes for all authenticated users */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'freelancer', 'admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard/talent" element={<ExploreServicesPage />} />
          <Route path="/dashboard/freelancers/:id" element={<FreelancerDetailPage />} />
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
          <Route path="/admin/freelancer-verifications" element={<FreelancerVerificationsPage />} />
        </Route>
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
