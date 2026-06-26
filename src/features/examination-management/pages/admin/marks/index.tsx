import { Route, Routes } from 'react-router-dom';
import MarksEntrySheet from './MarksEntrySheet';
import MarksVerification from './MarksVerification';
import MarksApproval from './MarksApproval';
import { AttendanceMarking } from './AttendanceMarking';

export default function MarksPages() {
  return (
    <Routes>
      <Route path=":sessionId" element={<MarksEntrySheet />} />
      <Route path=":sessionId/verify" element={<MarksVerification />} />
      <Route path=":sessionId/approve" element={<MarksApproval />} />
      <Route path=":sessionId/attendance" element={<AttendanceMarking />} />
    </Routes>
  );
}
