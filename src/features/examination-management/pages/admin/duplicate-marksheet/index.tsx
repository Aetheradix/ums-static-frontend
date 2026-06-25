import { Route, Routes } from 'react-router-dom';
import Applications from './Applications';
import Generate from './Generate';

export default function DuplicateMarksheetPages() {
  return (
    <Routes>
      <Route index element={<Applications />} />
      <Route path="generate" element={<Generate />} />
    </Routes>
  );
}
