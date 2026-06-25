import { Route, Routes } from 'react-router';
import Search from './pages/Search';

export default function DraftRegistrationRequest() {
  return (
    <Routes>
      <Route index element={<Search />} />
    </Routes>
  );
}
