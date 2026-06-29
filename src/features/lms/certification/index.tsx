import { Route, Routes, Navigate } from 'react-router-dom';
import GenerateCertificate from './pages/GenerateCertificate';
import ViewCertificate from './pages/ViewCertificate';

export default function Certification() {
  return (
    <Routes>
      <Route index element={<Navigate to="generate" replace />} />
      <Route path="generate/*" element={<GenerateCertificate />} />
      <Route path="view/*" element={<ViewCertificate />} />
    </Routes>
  );
}
