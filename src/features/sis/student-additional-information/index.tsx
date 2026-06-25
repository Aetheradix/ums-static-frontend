import { Route, Routes } from 'react-router-dom';
import List from './pages/List';
import Create from './pages/Create';
import Edit from './pages/Edit';

export default function StudentAdditionalInformation() {
  return (
    <Routes>
      <Route path="/*" element={<List />}>
        <Route path="create" element={<Create />} />
        <Route path="edit/:id" element={<Edit />} />
      </Route>
    </Routes>
  );
}
