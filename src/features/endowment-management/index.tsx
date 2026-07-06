import { Navigate, Route, Routes } from 'react-router-dom';

// We will import admin/student routes later as we build them.

export default function EndowmentManagementRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/home/sub-menu/endowment-management" replace />}
      />
      <Route
        path="master/*"
        element={<Navigate to="/home/sub-menu/endowment-master" replace />}
      />
      <Route
        path="admin/*"
        element={<Navigate to="/home/sub-menu/endowment-admin" replace />}
      />
      <Route
        path="student/*"
        element={<Navigate to="/home/sub-menu/endowment-student" replace />}
      />
    </Routes>
  );
}
