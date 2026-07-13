import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Directory from './pages/Directory';
import InstitutionLogin from './pages/InstitutionLogin';

// Mounted at /davv-cms/* in index.tsx
export default function DavvDirectory() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="campuses" element={<Directory />} />
      <Route path=":type/:institution" element={<InstitutionLogin />} />
    </Routes>
  );
}
