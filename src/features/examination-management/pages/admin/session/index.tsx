import { Route, Routes } from 'react-router-dom';
import SessionList from './SessionList';
import SessionPrograms from './SessionPrograms';
import TimetableManagement from './TimetableManagement';
import AdmitCardGeneration from './AdmitCardGeneration';
import SeatingPlan from './SeatingPlan';
import DutyAllocation from './DutyAllocation';

export default function SessionPages() {
  return (
    <Routes>
      <Route index element={<SessionList />} />
      <Route path=":sessionId/programs" element={<SessionPrograms />} />
      <Route path=":sessionId/timetable" element={<TimetableManagement />} />
      <Route path=":sessionId/admit-cards" element={<AdmitCardGeneration />} />
      <Route path=":sessionId/seating" element={<SeatingPlan />} />
      <Route path=":sessionId/duty-allocation" element={<DutyAllocation />} />
    </Routes>
  );
}
