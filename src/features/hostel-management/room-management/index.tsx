import { Navigate, Route, Routes } from 'react-router-dom';
import RoomAllotmentConfig from './pages/RoomAllotmentConfig';
import SingleAllotment from './pages/SingleAllotment';
import BulkAllotment from './pages/BulkAllotment';
import AllotmentRoster from './pages/AllotmentRoster';
import StudentCheckInList from './pages/StudentCheckInList';
import CheckInDetails from './pages/CheckInDetails';
import RoomChangeRequest from './pages/RoomChangeRequest';
import RoomChangeApproval from './pages/RoomChangeApproval';

export default function RoomManagement() {
  return (
    <Routes>
      <Route index element={<Navigate to="allotment-config" replace />} />
      <Route path="allotment-config" element={<RoomAllotmentConfig />} />
      <Route path="single-allotment" element={<SingleAllotment />} />
      <Route path="bulk-allotment" element={<BulkAllotment />} />
      <Route path="allotment-roster" element={<AllotmentRoster />} />
      <Route path="check-in-list" element={<StudentCheckInList />} />
      <Route
        path="check-in-details/:allotmentId"
        element={<CheckInDetails />}
      />
      <Route path="room-change-request" element={<RoomChangeRequest />} />
      <Route path="room-change-approval" element={<RoomChangeApproval />} />
    </Routes>
  );
}
