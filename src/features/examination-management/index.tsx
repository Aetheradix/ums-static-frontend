import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ExamTypeList from './pages/ExamTypeList';
import ExamCycleList from './pages/ExamCycleList';
import TimeSlotList from './pages/TimeSlotList';
import SessionTemplateList from './pages/SessionTemplateList';
import CenterList from './pages/CenterList';
import DutyTypeList from './pages/DutyTypeList';
import AdmitCardTemplateList from './pages/AdmitCardTemplateList';
import FeeConfiguration from './pages/FeeConfiguration';
import LateFeeConfiguration from './pages/LateFeeConfiguration';
import SessionList from './pages/SessionList';
import StudentApplications from './pages/StudentApplications';
import TimetableManagement from './pages/TimetableManagement';
import AdmitCardGeneration from './pages/AdmitCardGeneration';
import SessionPrograms from './pages/SessionPrograms';
import MarksEntrySheet from './pages/MarksEntrySheet';
import MarksVerification from './pages/MarksVerification';
import MarksApproval from './pages/MarksApproval';
import ResultProcessing from './pages/ResultProcessing';
import RevaluationManagement from './pages/RevaluationManagement';
import HallList from './pages/HallList';
import SeatingPlan from './pages/SeatingPlan';
import DutyAllocation from './pages/DutyAllocation';
import StudentApplicationDetail from './pages/StudentApplicationDetail';
import ModerationManagement from './pages/ModerationManagement';
import ResultPublication from './pages/ResultPublication';
import GradeCardGeneration from './pages/GradeCardGeneration';
import RevaluationEvaluation from './pages/RevaluationEvaluation';
import SupplementaryExamSetup from './pages/SupplementaryExamSetup';
import ReportsDashboard from './pages/ReportsDashboard';
import StudentExamForm from './pages/StudentExamForm';

export default function ExaminationManagement() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="exam-type" element={<ExamTypeList />} />
      <Route path="exam-cycle" element={<ExamCycleList />} />
      <Route path="time-slots" element={<TimeSlotList />} />
      <Route path="session-templates" element={<SessionTemplateList />} />
      <Route path="centers" element={<CenterList />} />
      <Route path="duty-types" element={<DutyTypeList />} />
      <Route path="admit-card-templates" element={<AdmitCardTemplateList />} />
      <Route path="fees" element={<FeeConfiguration />} />
      <Route path="late-fees" element={<LateFeeConfiguration />} />
      <Route path="sessions" element={<SessionList />} />
      <Route path="student-applications" element={<StudentApplications />} />
      <Route
        path="sessions/:sessionId/timetable"
        element={<TimetableManagement />}
      />
      <Route
        path="sessions/:sessionId/admit-cards"
        element={<AdmitCardGeneration />}
      />
      <Route
        path="sessions/:sessionId/programs"
        element={<SessionPrograms />}
      />
      <Route path="sessions/:sessionId/marks" element={<MarksEntrySheet />} />
      <Route
        path="sessions/:sessionId/marks/verify"
        element={<MarksVerification />}
      />
      <Route
        path="sessions/:sessionId/marks/approve"
        element={<MarksApproval />}
      />
      <Route path="sessions/:sessionId/result" element={<ResultProcessing />} />
      <Route path="centers/:centerId/halls" element={<HallList />} />
      <Route path="sessions/:sessionId/seating" element={<SeatingPlan />} />
      <Route
        path="sessions/:sessionId/duty-allocation"
        element={<DutyAllocation />}
      />
      <Route path="revaluation" element={<RevaluationManagement />} />
      <Route
        path="student-applications/:id"
        element={<StudentApplicationDetail />}
      />
      <Route path="moderation" element={<ModerationManagement />} />
      <Route path="result-publication" element={<ResultPublication />} />
      <Route path="grade-cards" element={<GradeCardGeneration />} />
      <Route
        path="revaluation-evaluation"
        element={<RevaluationEvaluation />}
      />
      <Route path="supplementary-setup" element={<SupplementaryExamSetup />} />
      <Route path="reports" element={<ReportsDashboard />} />
      <Route path="student-exam-form" element={<StudentExamForm />} />
    </Routes>
  );
}
