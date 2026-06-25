import { Route, Routes } from 'react-router-dom';
import Settings from './pages/Settings';
import MyProfile from './pages/my-profile/MyProfile';

export default function SettingsFeature() {
  return (
    <Routes>
      <Route index element={<Settings />} />
      <Route path="my-profile" element={<MyProfile />} />
    </Routes>
  );
}
