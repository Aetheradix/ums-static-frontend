import { Route, Routes, Navigate } from 'react-router-dom';
import CourseMasterList from './pages/CourseMasterList';
import CourseCategoryList from './pages/CourseCategoryList';
import ContentTypeList from './pages/ContentTypeList';
import AssessmentTypeList from './pages/AssessmentTypeList';
import CertificationMasterList from './pages/CertificationMasterList';

export default function Masters() {
  return (
    <Routes>
      <Route index element={<Navigate to="course" replace />} />
      <Route path="course/*" element={<CourseMasterList />} />
      <Route path="course-category/*" element={<CourseCategoryList />} />
      <Route path="content-type/*" element={<ContentTypeList />} />
      <Route path="assessment-type/*" element={<AssessmentTypeList />} />
      <Route path="certification/*" element={<CertificationMasterList />} />
    </Routes>
  );
}
