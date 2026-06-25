import { Route, Routes } from 'react-router';
import MenuPage from './pages/MenuPage';

export default function Menu() {
  return (
    <Routes>
      <Route path="/*" element={<MenuPage />} />
    </Routes>
  );
}
