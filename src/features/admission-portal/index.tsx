import { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import WorkspaceTopBar from 'shared/components/workspace-layout/WorkspaceTopBar';
import WorkspaceFooterBar from 'shared/components/workspace-layout/WorkspaceFooterBar';
import EmailStep from './components/EmailStep';
import OtpStep from './components/OtpStep';
import DashboardLayout from './components/DashboardLayout';

export default function AdmissionPortal() {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const content = token ? (
    <DashboardLayout onLogout={() => setToken(null)} token={token} />
  ) : email ? (
    <OtpStep email={email} onVerified={setToken} />
  ) : (
    <Routes>
      <Route index element={<EmailStep onOtpSent={setEmail} />} />
      <Route path="*" element={<Navigate to="/admission-portal" />} />
    </Routes>
  );

  return (
    <div className="font-sans bg-[#fbfbfd] min-h-screen text-slate-900 flex flex-col">
      <WorkspaceTopBar />
      {content}
      <WorkspaceFooterBar />
    </div>
  );
}
