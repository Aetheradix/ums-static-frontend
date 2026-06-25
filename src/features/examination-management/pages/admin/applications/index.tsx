import { Route, Routes } from 'react-router-dom';
import StudentApplications from './StudentApplications';
import StudentApplicationDetail from './StudentApplicationDetail';

export default function ApplicationsPages() {
  return (
    <Routes>
      <Route index element={<StudentApplications />} />
      <Route path=":id" element={<StudentApplicationDetail />} />
    </Routes>
  );
}
