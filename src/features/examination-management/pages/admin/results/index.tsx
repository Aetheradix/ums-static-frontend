import { Navigate, Route, Routes } from 'react-router-dom';
import { useExamSessionsQuery } from '../../../queries';
import ResultProcessing from './ResultProcessing';
import ModerationManagement from './ModerationManagement';
import ResultPublication from './ResultPublication';
import GradeCardGeneration from './GradeCardGeneration';
import { GradeCalculation } from './GradeCalculation';

function ResultsIndex() {
  const { data: sessions } = useExamSessionsQuery();
  const firstActive =
    sessions?.find(s => s.status === 'Active') ?? sessions?.[0];
  if (!firstActive)
    return (
      <div className="p-8 text-gray-400 text-center">
        No sessions available.
      </div>
    );
  return <Navigate to={String(firstActive.id)} replace />;
}

export default function ResultsPages() {
  return (
    <Routes>
      <Route index element={<ResultsIndex />} />
      <Route path=":sessionId" element={<ResultProcessing />} />
      <Route
        path="grade-calculation/:sessionId"
        element={<GradeCalculation />}
      />
      <Route path="moderation" element={<ModerationManagement />} />
      <Route path="publication" element={<ResultPublication />} />
      <Route path="grade-cards" element={<GradeCardGeneration />} />
    </Routes>
  );
}
