import { Route, Routes } from 'react-router-dom';
import EvaluatorList from './EvaluatorList';
import SheetDistribution from './SheetDistribution';

export default function EvaluatorPages() {
  return (
    <Routes>
      <Route index element={<EvaluatorList />} />
      <Route path="sheet-distribution" element={<SheetDistribution />} />
    </Routes>
  );
}
