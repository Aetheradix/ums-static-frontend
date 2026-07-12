import { Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import Directory from './pages/Directory';
import InstitutionLogin from './pages/InstitutionLogin';

// DAVV CMS routes (mounted at the top-level /davv namespace, outside Octagon and pre-login):
//   /davv                     → Landing
//   /davv/campuses            → Directory
//   /davv/:type/:institution  → InstitutionLogin  (e.g. /davv/utd/iet)
export default function Davv() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="campuses" element={<Directory />} />
      <Route path=":type/:institution" element={<InstitutionLogin />} />
    </Routes>
  );
}
