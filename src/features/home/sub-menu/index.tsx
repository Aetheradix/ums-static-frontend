import { Route, Routes } from 'react-router';
import SubMenuPage from './pages/SubMenuPage';

export default function SubMenu() {
  return (
    <Routes>
      <Route path=":moduleId/*" element={<SubMenuPage />} />
    </Routes>
  );
}
