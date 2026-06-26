import { Route, Routes } from 'react-router-dom';
import ExamTypeList from './ExamTypeList';
import ExamCycleList from './ExamCycleList';
import TimeSlotList from './TimeSlotList';
import SessionTemplateList from './SessionTemplateList';
import CenterList from './CenterList';
import HallList from './HallList';
import DutyTypeList from './DutyTypeList';
import AdmitCardTemplateList from './AdmitCardTemplateList';

export default function SetupPages() {
  return (
    <Routes>
      <Route index element={<ExamTypeList />} />
      <Route path="exam-types" element={<ExamTypeList />} />
      <Route path="exam-cycles" element={<ExamCycleList />} />
      <Route path="time-slots" element={<TimeSlotList />} />
      <Route path="session-templates" element={<SessionTemplateList />} />
      <Route path="centers" element={<CenterList />} />
      <Route path="centers/:centerId/halls" element={<HallList />} />
      <Route path="duty-types" element={<DutyTypeList />} />
      <Route path="admit-card-templates" element={<AdmitCardTemplateList />} />
    </Routes>
  );
}
