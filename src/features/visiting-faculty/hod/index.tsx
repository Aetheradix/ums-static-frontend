import { Navigate, Route, Routes } from 'react-router-dom';
import { ScopeProvider } from '../components/scope';
import Applications from '../department/pages/Applications';
import Attendance from '../department/pages/Attendance';
import Bills from '../department/pages/Bills';
import Dashboard from '../department/pages/Dashboard';
import Faculty from '../department/pages/Faculty';
import Interview from '../department/pages/Interview';
import MeritList from '../department/pages/MeritList';
import Reports from '../department/pages/Reports';
import Requirements from '../department/pages/Requirements';
import SubjectMaster from '../department/pages/SubjectMaster';
import Scrutiny from '../department/pages/Scrutiny';
import { vfUrls } from '../urls';

/**
 * HOD login — one per branch of a UTD. The HOD runs the whole process for
 * the branch (applications to merit list, attendance to bill) and forwards
 * the result to the UTD Department.
 */
export default function HodLogin() {
  return (
    <ScopeProvider role="hod">
      <Routes>
        <Route index element={<Navigate to={vfUrls.hod.portal} replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="scrutiny" element={<Scrutiny />} />
        <Route path="interview" element={<Interview />} />
        <Route path="merit-list" element={<MeritList />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="bills" element={<Bills />} />
        <Route path="reports" element={<Reports />} />
        <Route path="subject-master" element={<SubjectMaster />} />
        <Route path="requirements" element={<Requirements />} />
      </Routes>
    </ScopeProvider>
  );
}
