import { Navigate, Route, Routes } from 'react-router-dom';
import GatePassRequest from './pages/GatePassRequest';
import GatePassApproval from './pages/GatePassApproval';
import LeaveRequest from './pages/LeaveRequest';
import LeaveApproval from './pages/LeaveApproval';
import AttendanceMarking from './pages/AttendanceMarking';
import VisitorPreRegistration from './pages/VisitorPreRegistration';
import VisitorLogbook from './pages/VisitorLogbook';
import DisciplinaryAction from './pages/DisciplinaryAction';
import IncidentReporting from './pages/IncidentReporting';

export default function StudentOperations() {
  return (
    <Routes>
      <Route index element={<Navigate to="gate-pass-request" replace />} />
      <Route path="gate-pass-request" element={<GatePassRequest />} />
      <Route path="gate-pass-approval" element={<GatePassApproval />} />
      <Route path="leave-request" element={<LeaveRequest />} />
      <Route path="leave-approval" element={<LeaveApproval />} />
      <Route path="attendance-marking" element={<AttendanceMarking />} />
      <Route
        path="visitor-pre-registration"
        element={<VisitorPreRegistration />}
      />
      <Route path="visitor-logbook" element={<VisitorLogbook />} />
      <Route path="disciplinary-action" element={<DisciplinaryAction />} />
      <Route path="incident-reporting" element={<IncidentReporting />} />
    </Routes>
  );
}
