import { Route, Routes } from 'react-router-dom';
import GenerateCertificate from './pages/GenerateCertificate';
import ViewCertificate from './pages/ViewCertificate';

export default function Certification() {
  return (
    <Routes>
      <Route path="generate/*" element={<GenerateCertificate />} />
      <Route path="view/*" element={<ViewCertificate />} />
    </Routes>
  );
}
