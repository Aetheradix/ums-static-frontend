import { Route, Routes } from 'react-router-dom';
import StudentAdditionalInformation from './student-additional-information';
import StudentFeeApproval from './student-fee-approval';

export default function Sis() {
  return (
    <Routes>
      <Route
        path="student-additional-information/*"
        element={<StudentAdditionalInformation />}
      />
      <Route path="student-fee-approval/*" element={<StudentFeeApproval />} />
    </Routes>
  );
}
