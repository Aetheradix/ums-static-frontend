import { Navigate, Route, Routes } from 'react-router-dom';

// Portal Pages
import AlumniPortalPage from './AlumniPortalPage';
import AdminPortalPage from './admin/AdminPortalPage';
import UserPortalPage from './user/UserPortalPage';

// Admin Pages
import AuditLogs from './pages/admin/AuditLogs';
import AdminDashboard from './pages/admin/Dashboard';
import AccountActivation from './pages/admin/communication/AccountActivation';
import EmailCampaigns from './pages/admin/communication/EmailCampaigns';
import EmailTemplates from './pages/admin/communication/EmailTemplates';
import NotificationHistory from './pages/admin/communication/NotificationHistory';
import AddAlumni from './pages/admin/directory/AddAlumni';
import ImportAlumni from './pages/admin/directory/ImportAlumni';
import ProfileView from './pages/admin/directory/ProfileView';
import VerifiedAlumni from './pages/admin/directory/VerifiedAlumni';
import RegistrationDashboard from './pages/admin/registration-management';
import StandardReports from './pages/admin/reports/StandardReports';
import AdditionalFieldsBuilder from './pages/admin/settings/AdditionalFieldsBuilder';
import ContributionAreas from './pages/admin/settings/ContributionAreas';
import MailTemplatesBuilder from './pages/admin/settings/MailTemplatesBuilder';
import OUMapping from './pages/admin/settings/OUMapping';
import PrivacyRules from './pages/admin/settings/PrivacyRules';
import RegistrationRules from './pages/admin/settings/RegistrationRules';

// User Pages
import MyProfile from './pages/user/MyProfile';
import UserDashboard from './pages/user/UserDashboard';
import ContributionPreferences from './pages/user/profile/ContributionPreferences';
import Experience from './pages/user/profile/Experience';
import PrivacySettings from './pages/user/profile/PrivacySettings';
import Qualifications from './pages/user/profile/Qualifications';

export default function AlumniManagement() {
  return (
    <Routes>
      {/* Root portal selector */}
      <Route index element={<AlumniPortalPage />} />

      {/* Admin portal selector */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route
        path="portal-admin"
        element={<Navigate to="/home/sub-menu/alumni-admin-portal" replace />}
      />

      {/* Admin — Dashboard */}
      <Route path="admin/dashboard" element={<AdminDashboard />} />

      {/* Admin — Registration Management */}
      <Route
        path="admin/registration-management"
        element={<RegistrationDashboard />}
      />

      {/* Admin — Directory */}
      <Route path="admin/verified-alumni" element={<VerifiedAlumni />} />
      <Route path="admin/add-alumni" element={<AddAlumni />} />
      <Route path="admin/import-alumni" element={<ImportAlumni />} />
      <Route path="admin/directory/profile/:id" element={<ProfileView />} />

      {/* Admin — Communication */}
      <Route
        path="admin/communication/email-campaigns"
        element={<EmailCampaigns />}
      />
      <Route
        path="admin/communication/email-templates"
        element={<EmailTemplates />}
      />
      <Route
        path="admin/communication/notification-history"
        element={<NotificationHistory />}
      />
      <Route
        path="admin/communication/account-activation-emails"
        element={<AccountActivation />}
      />

      {/* Admin — Reports */}
      <Route path="admin/reports" element={<StandardReports />} />

      {/* Admin — Settings */}
      <Route path="admin/settings/ou-mapping" element={<OUMapping />} />
      <Route
        path="admin/settings/contribution-areas"
        element={<ContributionAreas />}
      />
      <Route
        path="admin/settings/registration-rules"
        element={<RegistrationRules />}
      />
      <Route
        path="admin/settings/mail-templates"
        element={<MailTemplatesBuilder />}
      />
      <Route
        path="admin/settings/additional-fields-builder"
        element={<AdditionalFieldsBuilder />}
      />
      <Route path="admin/settings/privacy-rules" element={<PrivacyRules />} />

      {/* Admin — Audit Logs */}
      <Route path="admin/audit-logs" element={<AuditLogs />} />

      {/* User portal selector */}
      <Route path="user" element={<UserPortalPage />} />
      <Route
        path="portal-user"
        element={<Navigate to="/home/sub-menu/alumni-user-portal" replace />}
      />

      {/* User Pages */}
      <Route path="user/dashboard" element={<UserDashboard />} />
      <Route path="user/my-profile" element={<MyProfile />} />
      <Route path="user/qualifications" element={<Qualifications />} />
      <Route path="user/experience" element={<Experience />} />
      <Route
        path="user/contribution-preferences"
        element={<ContributionPreferences />}
      />
      <Route path="user/privacy-settings" element={<PrivacySettings />} />
    </Routes>
  );
}
