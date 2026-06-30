import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPortalPage from './admin/AdminPortalPage';
import CompanyPortalPage from './company/CompanyPortalPage';
import DeptPortalPage from './dept/DeptPortalPage';
import StudentPortalPage from './student/StudentPortalPage';
import TrainingPlacementPortalPage from './TrainingPlacementPortalPage';
import { tpUrls } from './urls';

import ApplicationView from './pages/admin/applications/ApplicationView';
import StudentApplicationsList from './pages/admin/applications/StudentApplicationsList';
import CompanyDirectory from './pages/admin/companies/CompanyDirectory';
import CompanyForm from './pages/admin/companies/CompanyForm';
import CompanyView from './pages/admin/companies/CompanyView';
import AdminDashboard from './pages/admin/Dashboard';
import ReportsHub from './pages/admin/reports/ReportsHub';
import ModuleConfig from './pages/admin/settings/ModuleConfig';
import OUCoordinatorMapping from './pages/admin/settings/OUCoordinatorMapping';
import OUMappingForm from './pages/admin/settings/OUMappingForm';
import OUMappingList from './pages/admin/settings/OUMappingList';
import OUMappingView from './pages/admin/settings/OUMappingView';
import PlacementSeasonCreate from './pages/admin/settings/PlacementSeasonCreate';
import PlacementSeasonEdit from './pages/admin/settings/PlacementSeasonEdit';
import PlacementSeasonList from './pages/admin/settings/PlacementSeasonList';
import SettingsHub from './pages/admin/settings/SettingsHub';
import CompanySeasonList from './pages/companies/CompanySeasonList';
import CompanyDashboard from './pages/companies/Dashboard';
import DeptDashboard from './pages/dept/Dashboard';
import DeptStudentApplications from './pages/dept/DeptStudentApplications';
import OpportunitiesMonitor from './pages/dept/OpportunitiesMonitor';
import OpportunityApplicantsList from './pages/opportunities/OpportunityApplicantsList';
import OpportunityForm from './pages/opportunities/OpportunityForm';
import OpportunityList from './pages/opportunities/OpportunityList';
import OpportunityView from './pages/opportunities/OpportunityView';
import CompanyRegistration from './pages/public/CompanyRegistration';
import BrowseJobs from './pages/student/BrowseJobs';
import MyApplications from './pages/student/MyApplications';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentRegistration from './pages/student/StudentRegistration';
import StudentSeasons from './pages/student/StudentSeasons';

export default function TrainingPlacement() {
  return (
    <Routes>
      <Route index element={<TrainingPlacementPortalPage />} />

      {/* Admin */}
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />

      {/* Settings Routes */}
      <Route path="admin/settings" element={<SettingsHub />} />
      <Route path="admin/settings/ou-mapping" element={<OUMappingList />} />
      <Route path="admin/settings/ou-mapping/add" element={<OUMappingForm />} />
      <Route
        path="admin/settings/ou-mapping/edit/:id"
        element={<OUMappingForm />}
      />
      <Route
        path="admin/settings/ou-mapping/view/:id"
        element={<OUMappingView />}
      />
      <Route
        path="admin/settings/ou-coordinators"
        element={<OUCoordinatorMapping />}
      />
      <Route path="admin/settings/module-config" element={<ModuleConfig />} />
      <Route
        path="admin/settings/placement-seasons"
        element={<PlacementSeasonList />}
      />
      <Route
        path="admin/settings/placement-seasons/add"
        element={<PlacementSeasonCreate />}
      />
      <Route
        path="admin/settings/placement-seasons/edit/:id"
        element={<PlacementSeasonEdit />}
      />

      {/* Companies Routes */}
      <Route path="admin/companies" element={<CompanyDirectory />} />
      <Route path="admin/companies/add" element={<CompanyForm />} />
      <Route path="admin/companies/view/:id" element={<CompanyView />} />
      <Route path="admin/companies/edit/:id" element={<CompanyForm />} />
      <Route path="admin/company-seasons" element={<CompanySeasonList />} />
      <Route
        path="admin/student-applications"
        element={<StudentApplicationsList />}
      />
      <Route
        path="admin/student-applications/view/:id"
        element={<ApplicationView />}
      />
      <Route path="admin/opportunities" element={<OpportunityList />} />
      <Route path="admin/opportunities/add" element={<OpportunityForm />} />
      <Route
        path="admin/opportunities/edit/:id"
        element={<OpportunityForm />}
      />
      <Route
        path="admin/opportunities/view/:id"
        element={<OpportunityView />}
      />
      <Route
        path="admin/opportunities/:id/applicants"
        element={<OpportunityApplicantsList />}
      />
      <Route path="admin/reports" element={<ReportsHub />} />

      {/* Department */}
      <Route path="dept" element={<DeptPortalPage />} />
      <Route path="dept/dashboard" element={<DeptDashboard />} />
      <Route path="dept/opportunities" element={<OpportunitiesMonitor />} />
      <Route
        path="dept/student-applications"
        element={<DeptStudentApplications />}
      />

      {/* Company */}
      <Route path="company" element={<CompanyPortalPage />} />
      <Route path="company/dashboard" element={<CompanyDashboard />} />
      <Route path="company/profile" element={<CompanyView />} />
      <Route path="company/profile/edit" element={<CompanyForm />} />
      <Route path="company/seasons" element={<CompanySeasonList />} />
      <Route path="company/opportunities" element={<OpportunityList />} />
      <Route path="company/opportunities/add" element={<OpportunityForm />} />
      <Route
        path="company/opportunities/edit/:id"
        element={<OpportunityForm />}
      />
      <Route
        path="company/opportunities/view/:id"
        element={<OpportunityView />}
      />
      <Route
        path="company/opportunities/:id/applicants"
        element={<OpportunityApplicantsList />}
      />

      {/* Student */}
      <Route path="student" element={<StudentPortalPage />} />
      <Route path="student/dashboard" element={<StudentDashboard />} />
      <Route path="student/registration" element={<StudentRegistration />} />
      <Route path="student/seasons/available" element={<StudentSeasons />} />
      <Route path="student/seasons/applied" element={<StudentSeasons />} />
      <Route path="student/jobs" element={<BrowseJobs />} />
      <Route path="student/my-applications" element={<MyApplications />} />

      {/* Public */}
      <Route path="register/company" element={<CompanyRegistration />} />

      <Route path="*" element={<Navigate to={tpUrls.root} replace />} />
    </Routes>
  );
}
