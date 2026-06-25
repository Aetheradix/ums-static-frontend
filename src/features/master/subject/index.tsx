import { Route, Routes } from 'react-router-dom';
import ProgrammeModeOfEducation from './programme-mode-of-education';
import ProgrammeSpecializationStructure from './programme-specialization-structure';
import SubjectCategory from './subject-category';
import SubjectModule from './subjects';

export default function Subject() {
  return (
    <Routes>
      <Route
        path="programme-mode-of-education/*"
        element={<ProgrammeModeOfEducation />}
      />
      <Route path="subjects/*" element={<SubjectModule />} />

      <Route path="subject-category/*" element={<SubjectCategory />} />
      <Route
        path="programme-specialization-structure/*"
        element={<ProgrammeSpecializationStructure />}
      />
    </Routes>
  );
}
