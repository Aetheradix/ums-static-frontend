import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

export default function DavvCMS() {
  return (
    <Routes>
      <Route index element={<Home />} />
      {/* Dynamic sub-routes can be added here as we develop more pages */}
    </Routes>
  );
}
