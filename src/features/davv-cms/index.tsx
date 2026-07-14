import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AccessPortal from './pages/AccessPortal';
import InstitutionLogin from './pages/InstitutionLogin';

export default function DavvCMS() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="access-portal" element={<AccessPortal />} />
      <Route path=":type/:institution" element={<InstitutionLogin />} />
    </Routes>
  );
}
