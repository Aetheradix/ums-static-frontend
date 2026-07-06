import { Navigate, Route, Routes } from 'react-router-dom';

// We will import admin/student routes later as we build them.

export default function ConvocationManagementRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to="/home/sub-menu/convocation-management" replace />
        }
      />
      <Route
        path="admin/*"
        element={<Navigate to="/home/sub-menu/convocation-admin" replace />}
      />
      <Route
        path="student/*"
        element={<Navigate to="/home/sub-menu/convocation-student" replace />}
      />
    </Routes>
  );
}
