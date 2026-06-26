import { Route, Routes } from 'react-router';
import Create from './pages/Create';

export default function ProfileDetails() {
  return (
    <Routes>
      <Route path="/" element={<Create />} />
    </Routes>
  );
}
