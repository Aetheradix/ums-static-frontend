import { Navigate, Route, Routes } from 'react-router-dom';
import AuditLogReport from './AuditLogReport';
import BloomsTaxonomyReport from './BloomsTaxonomy';
import CoPoAttainmentReport from './CoPoAttainment';
import CustomReport from './CustomReport';
import DepartmentPerformanceReport from './DepartmentPerformance';
import EligibilityAttendanceReport from './EligibilityAttendance';
import EvaluationProgressReport from './EvaluationProgressReport';
import GradeDistributionReport from './GradeDistribution';
import HistoricalComparisonReport from './HistoricalComparison';
import QuestionAnalysisReport from './QuestionAnalysis';
import ResultAnalysisReport from './ResultAnalysis';
import SubmissionStatusReport from './SubmissionStatus';

export default function ReportPages() {
  return (
    <Routes>
      <Route index element={<Navigate to="result-analysis" replace />} />
      <Route
        path="eligibility-attendance"
        element={<EligibilityAttendanceReport />}
      />
      <Route path="submission-status" element={<SubmissionStatusReport />} />
      <Route
        path="evaluation-progress"
        element={<EvaluationProgressReport />}
      />
      <Route path="result-analysis" element={<ResultAnalysisReport />} />
      <Route
        path="department-performance"
        element={<DepartmentPerformanceReport />}
      />
      <Route path="blooms-taxonomy" element={<BloomsTaxonomyReport />} />
      <Route path="co-po-attainment" element={<CoPoAttainmentReport />} />
      <Route path="grade-distribution" element={<GradeDistributionReport />} />
      <Route
        path="historical-comparison"
        element={<HistoricalComparisonReport />}
      />
      <Route path="question-analysis" element={<QuestionAnalysisReport />} />
      <Route path="audit-log" element={<AuditLogReport />} />
      <Route path="custom" element={<CustomReport />} />
    </Routes>
  );
}
