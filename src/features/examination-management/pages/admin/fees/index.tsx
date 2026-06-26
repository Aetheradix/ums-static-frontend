import { Route, Routes } from 'react-router-dom';
import FeeConfiguration from './FeeConfiguration';
import LateFeeConfiguration from './LateFeeConfiguration';

export default function FeesPages() {
  return (
    <Routes>
      <Route index element={<FeeConfiguration />} />
      <Route path="exam-fees" element={<FeeConfiguration />} />
      <Route path="late-fees" element={<LateFeeConfiguration />} />
    </Routes>
  );
}
