import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import ExamForm from './ExamForm';
import Timetable from './Timetable';
import AdmitCard from './AdmitCard';
import SeatingPlan from './SeatingPlan';
import Results from './Results';
import GradeCard from './GradeCard';
import Revaluation from './Revaluation';
import DuplicateMarksheet from './DuplicateMarksheet';
import TrackApplications from './TrackApplications';

export default function StudentPages() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="exam-form" element={<ExamForm />} />
      <Route path="timetable" element={<Timetable />} />
      <Route path="admit-card" element={<AdmitCard />} />
      <Route path="seating-plan" element={<SeatingPlan />} />
      <Route path="results" element={<Results />} />
      <Route path="grade-cards" element={<GradeCard />} />
      <Route path="revaluation" element={<Revaluation />} />
      <Route path="duplicate-marksheet" element={<DuplicateMarksheet />} />
      <Route path="track-applications" element={<TrackApplications />} />
    </Routes>
  );
}
