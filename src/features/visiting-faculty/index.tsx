import { Navigate, Route, Routes } from 'react-router-dom';
import DepartmentLogin from './department';
import FinanceLogin from './finance';
import HeadOfficeLogin from './head-office';
import MobileApp from './mobile/MobileApp';
import { vfUrls } from './urls';

/**
 * Visiting Faculty — signed-in logins. The public registration forum lives
 * outside the layout at `/visiting-faculty-registration` (see ./public).
 */
export default function VisitingFaculty() {
  return (
    <Routes>
      <Route index element={<Navigate to={vfUrls.portal} replace />} />
      <Route path="department/*" element={<DepartmentLogin />} />
      <Route path="head-office/*" element={<HeadOfficeLogin />} />
      <Route path="finance/*" element={<FinanceLogin />} />
      <Route path="mobile/app" element={<MobileApp />} />
      <Route path="*" element={<Navigate to={vfUrls.portal} replace />} />
    </Routes>
  );
}
