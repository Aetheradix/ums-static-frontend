import { Navigate, Route, Routes } from 'react-router-dom';
import ArchivedFiles from './ArchivedFiles';
import CreateFile from './CreateFile';
import DakCreate from './DakCreate';
import DakList from './DakList';
import Dashboard from './Dashboard';
import FileDetails from './FileDetails';
import FileHistory from './FileHistory';
import IncomingFiles from './IncomingFiles';
import ManageFiles from './ManageFiles';
import Notifications from './Notifications';
import PartFile from './PartFile';
import PrintFiles from './PrintFiles';

export default function EmployeePages() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="create" element={<CreateFile />} />
      <Route path="manage" element={<ManageFiles />} />
      <Route path="view/:id" element={<FileDetails />} />
      <Route path="incoming" element={<IncomingFiles />} />
      <Route path="history" element={<FileHistory />} />
      <Route path="print" element={<PrintFiles />} />
      <Route path="part-file/:parentId" element={<PartFile />} />
      <Route path="dak/create" element={<DakCreate />} />
      <Route path="dak/list" element={<DakList />} />
      <Route path="archive" element={<ArchivedFiles />} />
      <Route path="notifications" element={<Notifications />} />
    </Routes>
  );
}
