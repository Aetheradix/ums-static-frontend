import { Route, Routes } from 'react-router';
import MasterSubMenuPage from './pages/MasterSubMenuPage';

export default function MasterSubMenu() {
  return (
    <Routes>
      <Route path="/" element={<MasterSubMenuPage />} />
      <Route path=":moduleId/*" element={<MasterSubMenuPage />} />
    </Routes>
  );
}
