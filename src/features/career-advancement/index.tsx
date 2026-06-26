import { Navigate, Route, Routes } from 'react-router-dom';
import { CareerAdvancementProvider } from './context';
import Dashboard from './pages/Dashboard';
import SessionsManagement from './pages/SessionsManagement';
import AparAll from './pages/AparAll';
import AparProcess from './pages/AparProcess';
import AparEmployee from './pages/AparEmployee';
import AparReporting from './pages/AparReporting';
import AparReviewing from './pages/AparReviewing';
import AparTrack from './pages/AparTrack';
import PbasCreate from './pages/PbasCreate';
import PbasApproval from './pages/PbasApproval';
import DeanAcademics from './pages/DeanAcademics';

export default function CareerAdvancement() {
  return (
    <CareerAdvancementProvider>
      <Routes>
        {/* Default redirect to dashboard */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Sessions Configuration */}
        <Route path="sessions-management" element={<SessionsManagement />} />

        {/* APAR / Employee Form */}
        <Route
          path="employee-self-assessment"
          element={<AparEmployee />}
        />

        {/* PBAS / CAS Application Wizard */}
        <Route
          path="performance-appraisal-system"
          element={<PbasCreate />}
        />

        {/* APAR All & Handoff review pages */}
        <Route path="apar-application/all" element={<AparAll />} />
        <Route path="apar-process" element={<AparProcess />} />
        <Route path="apar-reporting" element={<AparReporting />} />
        <Route path="apar-reviewing" element={<AparReviewing />} />
        <Route path="apar-track" element={<AparTrack />} />

        {/* PBAS Review Stages */}
        <Route path="pbas-hod" element={<PbasApproval />} />
        <Route path="pbas-dean" element={<PbasApproval />} />
        <Route path="pbas-iqac" element={<PbasApproval />} />
        <Route path="pbas-dean-academics" element={<DeanAcademics />} />
      </Routes>
    </CareerAdvancementProvider>
  );
}
