import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import InstitutionLogin from './pages/InstitutionLogin';

export default function DavvCMS() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path=":type/:institution" element={<InstitutionLogin />} />
    </Routes>
  );
}
