import { Route, Routes } from 'react-router-dom';

// Admin
import AssessmentTypeMaster from './admin/masters/AssessmentTypeMaster';
import ExamTypeMaster from './admin/masters/ExamTypeMaster';
import GradeLetterMaster from './admin/masters/GradeLetterMaster';
import GradeRuleMaster from './admin/masters/GradeRuleMaster';
import DivisionMaster from './admin/masters/DivisionMaster';
import EvaluationSchemeMaster from './admin/masters/EvaluationSchemeMaster';
import EvaluationPolicyMaster from './admin/masters/EvaluationPolicyMaster';
import ResultStatusMaster from './admin/masters/ResultStatusMaster';
import ProgrammeEvaluationSchemeMapping from './admin/configuration/ProgrammeEvaluationSchemeMapping';
import ProgrammeGradeMapping from './admin/configuration/ProgrammeGradeMapping';
import ProgrammeDivisionMapping from './admin/configuration/ProgrammeDivisionMapping';
import ExaminationSession from './admin/examination/ExaminationSession';
import ExamCreation from './admin/examination/ExamCreation';
import MarksApproval from './admin/evaluation/MarksApproval';
import MarksLock from './admin/evaluation/MarksLock';
import AggregateCalculation from './admin/result-processing/AggregateCalculation';
import GradeCalculation from './admin/result-processing/GradeCalculation';
import CreditCalculation from './admin/result-processing/CreditCalculation';
import SGPACalculation from './admin/result-processing/SGPACalculation';
import CGPACalculation from './admin/result-processing/CGPACalculation';
import ResultProcessing from './admin/result-processing/ResultProcessing';
import ResultApproval from './admin/result-processing/ResultApproval';
import ResultPublish from './admin/result-processing/ResultPublish';
import StudentPromotion from './admin/result-processing/StudentPromotion';
import GradeReports from './admin/reports/GradeReports';
import GradeCard from './admin/reports/GradeCard';
import Transcript from './admin/reports/Transcript';
import GazetteReport from './admin/reports/GazetteReport';

// College
import SubjectEvaluationMapping from './college/configuration/SubjectEvaluationMapping';
import EvaluatorMapping from './college/configuration/EvaluatorMapping';
import SubjectAllocation from './college/configuration/SubjectAllocation';
import StudentEligibility from './college/examination/StudentEligibility';
import StudentAssessmentMarks from './college/evaluation/StudentAssessmentMarks';
import MarksVerification from './college/evaluation/MarksVerification';
import MarksReports from './college/reports/MarksReports';
import ResultReports from './college/reports/ResultReports';
import Marksheet from './college/reports/Marksheet';

// Student
import Revaluation from './student/services/Revaluation';
import ImprovementExam from './student/services/ImprovementExam';
import BacklogRegistration from './student/services/BacklogRegistration';

import EvaluationGradingPortalPage from './EvaluationGradingPortalPage';
import SubMenuPage from './SubMenuPage';

export default function EvaluationGrading() {
  return (
    <Routes>
      <Route index element={<EvaluationGradingPortalPage />} />

      {/* Admin Portal & Sub-menus */}
      <Route
        path="admin-login"
        element={<SubMenuPage slug="evaluation-grading-admin" />}
      />
      <Route
        path="admin-login/masters"
        element={<SubMenuPage slug="eval-admin-masters" />}
      />
      <Route
        path="admin-login/configuration"
        element={<SubMenuPage slug="eval-admin-configuration" />}
      />
      <Route
        path="admin-login/examination"
        element={<SubMenuPage slug="eval-admin-examination" />}
      />
      <Route
        path="admin-login/evaluation"
        element={<SubMenuPage slug="eval-admin-evaluation" />}
      />
      <Route
        path="admin-login/result-processing"
        element={<SubMenuPage slug="eval-admin-result-processing" />}
      />
      <Route
        path="admin-login/reports"
        element={<SubMenuPage slug="eval-admin-reports" />}
      />

      {/* Admin Pages */}
      <Route
        path="admin-login/masters/assessment-type-master"
        element={<AssessmentTypeMaster />}
      />
      <Route
        path="admin-login/masters/exam-type-master"
        element={<ExamTypeMaster />}
      />
      <Route
        path="admin-login/masters/grade-letter-master"
        element={<GradeLetterMaster />}
      />
      <Route
        path="admin-login/masters/grade-rule-master"
        element={<GradeRuleMaster />}
      />
      <Route
        path="admin-login/masters/division-master"
        element={<DivisionMaster />}
      />
      <Route
        path="admin-login/masters/evaluation-scheme-master"
        element={<EvaluationSchemeMaster />}
      />
      <Route
        path="admin-login/masters/evaluation-policy-master"
        element={<EvaluationPolicyMaster />}
      />
      <Route
        path="admin-login/masters/result-status-master"
        element={<ResultStatusMaster />}
      />

      <Route
        path="admin-login/configuration/programme-evaluation-scheme-mapping"
        element={<ProgrammeEvaluationSchemeMapping />}
      />
      <Route
        path="admin-login/configuration/programme-grade-mapping"
        element={<ProgrammeGradeMapping />}
      />
      <Route
        path="admin-login/configuration/programme-division-mapping"
        element={<ProgrammeDivisionMapping />}
      />

      <Route
        path="admin-login/examination/examination-session"
        element={<ExaminationSession />}
      />
      <Route
        path="admin-login/examination/exam-creation"
        element={<ExamCreation />}
      />

      <Route
        path="admin-login/evaluation/marks-approval"
        element={<MarksApproval />}
      />
      <Route path="admin-login/evaluation/marks-lock" element={<MarksLock />} />

      <Route
        path="admin-login/result-processing/aggregate-calculation"
        element={<AggregateCalculation />}
      />
      <Route
        path="admin-login/result-processing/grade-calculation"
        element={<GradeCalculation />}
      />
      <Route
        path="admin-login/result-processing/credit-calculation"
        element={<CreditCalculation />}
      />
      <Route
        path="admin-login/result-processing/sgpa-calculation"
        element={<SGPACalculation />}
      />
      <Route
        path="admin-login/result-processing/cgpa-calculation"
        element={<CGPACalculation />}
      />
      <Route
        path="admin-login/result-processing/result-processing"
        element={<ResultProcessing />}
      />
      <Route
        path="admin-login/result-processing/result-approval"
        element={<ResultApproval />}
      />
      <Route
        path="admin-login/result-processing/result-publish"
        element={<ResultPublish />}
      />
      <Route
        path="admin-login/result-processing/student-promotion"
        element={<StudentPromotion />}
      />

      <Route
        path="admin-login/reports/grade-reports"
        element={<GradeReports />}
      />
      <Route path="admin-login/reports/grade-card" element={<GradeCard />} />
      <Route path="admin-login/reports/transcript" element={<Transcript />} />
      <Route
        path="admin-login/reports/gazette-report"
        element={<GazetteReport />}
      />

      {/* College Portal & Sub-menus */}
      <Route
        path="college-login"
        element={<SubMenuPage slug="evaluation-grading-college" />}
      />
      <Route
        path="college-login/configuration"
        element={<SubMenuPage slug="eval-college-configuration" />}
      />
      <Route
        path="college-login/examination"
        element={<SubMenuPage slug="eval-college-examination" />}
      />
      <Route
        path="college-login/evaluation"
        element={<SubMenuPage slug="eval-college-evaluation" />}
      />
      <Route
        path="college-login/reports"
        element={<SubMenuPage slug="eval-college-reports" />}
      />

      {/* College Pages */}
      <Route
        path="college-login/configuration/subject-evaluation-mapping"
        element={<SubjectEvaluationMapping />}
      />
      <Route
        path="college-login/configuration/evaluator-mapping"
        element={<EvaluatorMapping />}
      />
      <Route
        path="college-login/configuration/subject-allocation"
        element={<SubjectAllocation />}
      />

      <Route
        path="college-login/examination/student-eligibility"
        element={<StudentEligibility />}
      />

      <Route
        path="college-login/evaluation/student-assessment-marks"
        element={<StudentAssessmentMarks />}
      />
      <Route
        path="college-login/evaluation/marks-verification"
        element={<MarksVerification />}
      />

      <Route
        path="college-login/reports/marks-reports"
        element={<MarksReports />}
      />
      <Route
        path="college-login/reports/result-reports"
        element={<ResultReports />}
      />
      <Route path="college-login/reports/marksheet" element={<Marksheet />} />

      {/* Student Portal & Sub-menus */}
      <Route
        path="student-login"
        element={<SubMenuPage slug="evaluation-grading-student" />}
      />
      <Route
        path="student-login/services"
        element={<SubMenuPage slug="eval-student-services" />}
      />

      {/* Student Pages */}
      <Route
        path="student-login/services/revaluation"
        element={<Revaluation />}
      />
      <Route
        path="student-login/services/improvement-exam"
        element={<ImprovementExam />}
      />
      <Route
        path="student-login/services/backlog-registration"
        element={<BacklogRegistration />}
      />
    </Routes>
  );
}
