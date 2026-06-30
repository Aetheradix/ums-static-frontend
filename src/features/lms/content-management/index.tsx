import { Route, Routes, Navigate } from 'react-router-dom';
import ModuleManagement from './pages/ModuleManagement';
import ContentUpload from './pages/ContentUpload';

export default function ContentManagement() {
  return (
    <Routes>
      <Route index element={<Navigate to="module" replace />} />
      <Route path="module/*" element={<ModuleManagement />} />
      <Route path="content-upload/*" element={<ContentUpload />} />
    </Routes>
  );
}
