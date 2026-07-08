import AvailableFacility from 'features/master/college/college-facility';
import EstablishmentYear from 'features/master/other/establishment-year';
import { Route, Routes } from 'react-router';
import { Navigate } from 'react-router-dom';
import CollegeRegistration from './college-registration';
import CollegeRegistrationApproval from './college-registration-approval';
import CollegeRenewal from './college-renewal';
import CollegeRenewalAdmin from './college-renewal-admin';
import DepartmentRegistration from './department-registration';
import ProgrammeFee from './settings/programme-fee';

import ApprovalStatusReport from './approval-status-report';
import DraftRegistrationRequest from './draft-registration-request';
import InspectionReport from './inspection-report';
import InspectionStatusReport from './inspection-status-report';
import ProfileDetails from './Profile-details';
import InspectionAssignment from './inspection-assignment';
import FinalRegistrationApproval from './final-registration-approval';
import BasicRegistrationDetails from './basic-registration-details';
import ProfileScrutiny from './profile-scrutiny';

export default function AffiliationManagementSystem() {
  return (
    <Routes>
      <Route
        path=""
        element={
          <Navigate to="/home/sub-menu/affiliation-management-system" replace />
        }
      />
      <Route
        path="public"
        element={<Navigate to="/home/sub-menu/public" replace />}
      />
      <Route
        path="college-login"
        element={<Navigate to="/home/sub-menu/college-login" replace />}
      />
      <Route
        path="admin-login"
        element={<Navigate to="/home/sub-menu/admin-login" replace />}
      />

      <Route
        path="registration-approval/*"
        element={<CollegeRegistrationApproval />}
      />
      <Route path="college-registration/*" element={<CollegeRegistration />} />
      <Route
        path="department-registration/*"
        element={<DepartmentRegistration />}
      />
      <Route path="college-renewal/*" element={<CollegeRenewal />} />
      <Route path="college-renewal-admin/*" element={<CollegeRenewalAdmin />} />
      <Route
        path="draft-registration-request/*"
        element={<DraftRegistrationRequest />}
      />
      <Route path="inspection-report/*" element={<InspectionReport />} />
      <Route path="profile-details/*" element={<ProfileDetails />} />
      <Route path="profile-scrutiny/*" element={<ProfileScrutiny />} />
      <Route
        path="basic-registration-details/*"
        element={<BasicRegistrationDetails />}
      />
      <Route
        path="inspection-assignment/*"
        element={<InspectionAssignment />}
      />
      <Route
        path="final-registration-approval/*"
        element={<FinalRegistrationApproval />}
      />
      <Route
        path="approval-status-report/*"
        element={<ApprovalStatusReport />}
      />
      <Route
        path="inspection-status-report/*"
        element={<InspectionStatusReport />}
      />
      <Route path="affiliation-settings/*">
        <Route path="available-facility/*" element={<AvailableFacility />} />
        <Route path="establishment-year/*" element={<EstablishmentYear />} />
        <Route path="programme-fee/*" element={<ProgrammeFee />} />
      </Route>
    </Routes>
  );
}
