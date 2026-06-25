import { Route, Routes } from 'react-router';
import AdminPortalPage from './admin/AdminPortalPage';
import PmDashboard from './admin/pages/Dashboard';
import Programmes from './admin/pages/Programmes';
import AcademicDistinction from './admin/settings/pages/AcademicDistinction';
import AdmissionQuotas from './admin/settings/pages/AdmissionQuotas';
import Disciplines from './admin/settings/pages/Disciplines';
import EnrolmentStatus from './admin/settings/pages/EnrolmentStatus';
import EnrolmentTypes from './admin/settings/pages/EnrolmentTypes';
import ExamSchemes from './admin/settings/pages/ExamSchemes';
import UgcDegrees from './admin/settings/pages/UgcDegrees';
import SettingsPortalPage from './admin/settings/SettingsPortalPage';
import ProgrammePortalPage from './portal/ProgrammePortalPage';

export default function ProgrammeManagement() {
  return (
    <Routes>
      <Route index element={<ProgrammePortalPage />} />
      <Route path="admin" element={<AdminPortalPage />} />
      <Route path="admin/dashboard" element={<PmDashboard />} />
      <Route path="admin/programmes" element={<Programmes />} />
      <Route path="admin/settings" element={<SettingsPortalPage />} />
      <Route path="admin/settings/disciplines" element={<Disciplines />} />
      <Route path="admin/settings/ugc-degrees" element={<UgcDegrees />} />
      <Route
        path="admin/settings/admission-quotas"
        element={<AdmissionQuotas />}
      />
      <Route
        path="admin/settings/enrolment-types"
        element={<EnrolmentTypes />}
      />
      <Route
        path="admin/settings/enrolment-status"
        element={<EnrolmentStatus />}
      />
      <Route path="admin/settings/exam-schemes" element={<ExamSchemes />} />
      <Route
        path="admin/settings/academic-distinction"
        element={<AcademicDistinction />}
      />
    </Routes>
  );
}
