import { Route, Routes } from 'react-router-dom';
import Settings from './settings';

export default function Employee() {
  return (
    <Routes>
      <Route path="settings/*" element={<Settings />} />
    </Routes>
  );
}
