import { Route, Routes } from 'react-router-dom';
import StudentPortalPage from './StudentPortalPage';
import StudentDashboard from './pages/Dashboard';
import TopicRegistration from './pages/TopicRegistration';
import ProposalUpload from './pages/ProposalUpload';
import PlagiarismReport from './pages/PlagiarismReport';
import SupervisorDetails from './pages/SupervisorDetails';
import ProgressReports from './pages/ProgressReports';
import MilestoneTracker from './pages/MilestoneTracker';
import MeetingLogs from './pages/MeetingLogs';
import SynopsisSubmission from './pages/SynopsisSubmission';
import FinalThesis from './pages/FinalThesis';
import VivaSchedule from './pages/VivaSchedule';
import Results from './pages/Results';
import Repository from './pages/Repository';
import Notifications from './pages/Notifications';

export default function StudentPortalLayout() {
  return (
    <Routes>
      <Route index element={<StudentPortalPage />} />
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="topic-registration" element={<TopicRegistration />} />
      <Route path="proposal-upload" element={<ProposalUpload />} />
      <Route path="plagiarism-report" element={<PlagiarismReport />} />
      <Route path="supervisor-details" element={<SupervisorDetails />} />
      <Route path="progress-reports" element={<ProgressReports />} />
      <Route path="milestone-tracker" element={<MilestoneTracker />} />
      <Route path="meeting-logs" element={<MeetingLogs />} />
      <Route path="synopsis-submission" element={<SynopsisSubmission />} />
      <Route path="final-thesis" element={<FinalThesis />} />
      <Route path="viva-schedule" element={<VivaSchedule />} />
      <Route path="results" element={<Results />} />
      <Route path="repository" element={<Repository />} />
      <Route path="notifications" element={<Notifications />} />
    </Routes>
  );
}
