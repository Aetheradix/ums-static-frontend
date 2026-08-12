import { Route, Routes } from 'react-router';
import View from './pages/View';

export default function ApplicationStatus() {
  return (
    <Routes>
      <Route path="/" element={<View />} />
    </Routes>
  );
}
