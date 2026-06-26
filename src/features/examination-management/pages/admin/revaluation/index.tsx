import { Route, Routes } from 'react-router-dom';
import RevaluationManagement from './RevaluationManagement';
import RevaluationEvaluation from './RevaluationEvaluation';

export default function RevaluationPages() {
  return (
    <Routes>
      <Route index element={<RevaluationManagement />} />
      <Route path="evaluation" element={<RevaluationEvaluation />} />
    </Routes>
  );
}
