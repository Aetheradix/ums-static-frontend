import { Route, Routes } from 'react-router-dom';
import ActionOption from './action-option';
import ActionOptionReason from './action-option-reason';
import DocumentOption from './document-option';
import EmployeeGroup from './employee-group';
import NatureOfEmployment from './nature-of-employment';
import OrganizationUnit from './organization-unit';
import SeparationReasonType from './separation-reason-type';
import SubjectSpecialization from './subject-specialization';
import TravelPurpose from './travel-purpose';

export default function Settings() {
  return (
    <Routes>
      <Route path="nature-of-employment" element={<NatureOfEmployment />} />
      <Route path="organization-unit" element={<OrganizationUnit />} />
      <Route path="document-option" element={<DocumentOption />} />
      <Route path="action-option" element={<ActionOption />} />
      <Route path="separation-reason-type" element={<SeparationReasonType />} />
      <Route
        path="subject-specialization"
        element={<SubjectSpecialization />}
      />
      <Route path="action-option-reason" element={<ActionOptionReason />} />

      <Route path="travel-purpose" element={<TravelPurpose />} />
      <Route path="employee-group" element={<EmployeeGroup />} />
    </Routes>
  );
}
