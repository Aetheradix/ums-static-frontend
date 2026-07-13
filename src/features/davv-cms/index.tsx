import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AccessPortal from './pages/AccessPortal';

export default function DavvCMS() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="access-portal" element={<AccessPortal />} />
    </Routes>
  );
}
