import Settings from 'features/master/employee/settings';
import { Route, Routes } from 'react-router-dom';
import FullOnboarding from './full-onboarding';
import ManageEmployees from './manage-employees';
import QuickOnboarding from './quick-onboarding';

export default function EmployeeManagement() {
  return (
    <Routes>
      <Route path="manage-employees/*" element={<ManageEmployees />} />
      <Route path="quick-onboarding/*" element={<QuickOnboarding />} />
      <Route path="full-onboarding/*" element={<FullOnboarding />} />
      <Route path="settings/*" element={<Settings />} />
    </Routes>
  );
}
